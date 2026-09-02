export interface NodeCodeSnippet {
  filename: string
  language: string
  code: string
}

export interface ArchitectureNode {
  id: string
  label: string
  category: string
  protocol: string
  tech: string[]
  description: string
  specs: {
    layer: string
    scaling: string
    security: string
    observability: string
  }
  codeSnippet?: NodeCodeSnippet
  x: number // percentage 0-100
  y: number // percentage 0-100
}

export interface TraceStep {
  step: number
  title: string
  fromNodeId?: string
  toNodeId?: string
  activeNodeId: string
  action: string
  narrative: string
}

export interface ArchitectureEdge {
  from: string
  to: string
  label?: string
  protocol: string
  type?: 'sync' | 'async' | 'event'
}

export interface ArchitectureSystem {
  id: string
  title: string
  badge: string
  subtitle: string
  description: string
  nodes: ArchitectureNode[]
  edges: ArchitectureEdge[]
  traceSteps: TraceStep[]
}

export function generateMermaidDiagram(arch: ArchitectureSystem): string {
  let mermaid = `%% Architecture Blueprint: ${arch.title}\n`
  mermaid += `graph LR\n`
  mermaid += `  %% Nodes Definition\n`
  arch.nodes.forEach((node) => {
    mermaid += `  ${node.id}["<b>${node.label}</b><br/><i>${node.category} • ${node.protocol}</i>"]\n`
  })
  mermaid += `\n  %% Edge Connections\n`
  arch.edges.forEach((edge) => {
    const label = edge.label ? `|"${edge.label} (${edge.protocol})"|` : ''
    mermaid += `  ${edge.from} -->${label} ${edge.to}\n`
  })
  return mermaid
}

export const ARCHITECTURES: ArchitectureSystem[] = [
  {
    id: 'agentic-mcp',
    title: 'Agentic AI & MCP Platform',
    badge: 'GENAI / AGENTIC',
    subtitle: 'Model Context Protocol (MCP) Multi-Agent Pipeline with Real-time Tool Orchestration',
    description:
      'Production architecture for autonomous multi-agent systems using MCP servers for dynamic tool execution, contextual vector retrieval, and LLM inference.',
    nodes: [
      {
        id: 'client',
        label: 'Client / User Intent',
        category: 'Ingress',
        protocol: 'HTTPS / WSS',
        tech: ['Next.js', 'REST', 'WebSocket'],
        description: 'Receives user requests, voice, or API events and streams responses via SSE.',
        specs: {
          layer: 'Presentation & Ingress',
          scaling: 'Global Edge Anycast',
          security: 'TLS 1.3, Rate-Limited, OAuth2 / JWT',
          observability: 'Client-side RUM & Latency metrics'
        },
        codeSnippet: {
          filename: 'api/agent/stream.ts',
          language: 'typescript',
          code: `import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { prompt, sessionId } = await req.json()

  // Establish persistent Server-Sent Events stream
  const response = await fetch('https://gateway.internal/v1/agent/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Session-ID': sessionId,
      'Authorization': 'Bearer ' + process.env.AGENT_SERVICE_KEY
    },
    body: JSON.stringify({ prompt, stream: true })
  })

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}`
        },
        x: 10,
        y: 50
      },
      {
        id: 'gateway',
        label: 'AI Gateway & Router',
        category: 'Routing',
        protocol: 'gRPC / HTTP2',
        tech: ['Envoy', 'Cloudflare Workers', 'Kong'],
        description: 'Handles token bucket rate limiting, auth verification, and semantic request caching.',
        specs: {
          layer: 'API Management & Edge Gateway',
          scaling: 'HPA 5–20 Replicas',
          security: 'mTLS, WAF, API Key Rotation',
          observability: 'Prometheus metrics, Trace ID injection'
        },
        codeSnippet: {
          filename: 'envoy-gateway-config.yaml',
          language: 'yaml',
          code: `apiVersion: gateway.envoyproxy.io/v1alpha1
kind: EnvoyProxy
metadata:
  name: ai-gateway-ingress
  namespace: envoy-gateway-system
spec:
  telemetry:
    tracing:
      provider:
        type: OpenTelemetry
        host: otel-collector.monitoring.svc.cluster.local
        port: 4317
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: agent-orchestrator-route
spec:
  parentRefs:
    - name: eg-gateway
  rules:
    - matches:
        - path: { type: PathPrefix, value: /v1/agent }
      backendRefs:
        - name: agent-orchestrator-svc
          port: 50051`
        },
        x: 32,
        y: 50
      },
      {
        id: 'orchestrator',
        label: 'Agent Orchestrator',
        category: 'Agentic Core',
        protocol: 'Agent2Agent (A2A)',
        tech: ['LangGraph', 'Python', 'Google ADK'],
        description: 'Maintains agent state machines, plan-and-solve loops, and multi-agent coordination.',
        specs: {
          layer: 'Execution Engine',
          scaling: 'Async Event Workers, Redis Queue',
          security: 'Sandboxed Python runtime, Ephemeral state',
          observability: 'Langfuse Tracing, Step Latency'
        },
        codeSnippet: {
          filename: 'agent_graph.py',
          language: 'python',
          code: `from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, Sequence
from langchain_core.messages import BaseMessage
import operator

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    next_step: str
    tool_calls: list[dict]

def route_evaluator(state: AgentState) -> str:
    last_msg = state["messages"][-1]
    if hasattr(last_msg, "tool_calls") and last_msg.tool_calls:
        return "mcp_tool_executor"
    return END

workflow = StateGraph(AgentState)
workflow.add_node("agent_planner", plan_and_reason_node)
workflow.add_node("mcp_tool_executor", execute_mcp_tools)
workflow.set_entry_point("agent_planner")

workflow.add_conditional_edges(
    "agent_planner",
    route_evaluator,
    {"mcp_tool_executor": "mcp_tool_executor", END: END}
)
workflow.add_edge("mcp_tool_executor", "agent_planner")
app = workflow.compile()`
        },
        x: 55,
        y: 50
      },
      {
        id: 'mcp-servers',
        label: 'MCP Tool Servers',
        category: 'Tool Bindings',
        protocol: 'JSON-RPC / stdio / SSE',
        tech: ['Model Context Protocol', 'Docker', 'Kubernetes'],
        description: 'Exposes local and cloud tools (GitHub, Databases, Terminal CLI, Web Search) to agents.',
        specs: {
          layer: 'Tool Integration Protocol',
          scaling: 'Isolated Container Pods',
          security: 'Least-privilege RBAC, Read-only volume mounts',
          observability: 'Tool call execution duration & error rate'
        },
        codeSnippet: {
          filename: 'mcp_servers.json',
          language: 'json',
          code: `{
  "mcpServers": {
    "kubernetes-cluster": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-v", "/var/run/docker.sock:/var/run/docker.sock",
        "ghcr.io/modelcontextprotocol/servers/kubernetes:latest"
      ],
      "env": {
        "KUBECONFIG": "/etc/kubernetes/agent-kubeconfig.yaml",
        "READONLY_MODE": "false"
      }
    },
    "github-automation": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "\${GITHUB_PAT_SECRET}"
      }
    }
  }
}`
        },
        x: 82,
        y: 22
      },
      {
        id: 'llm-runtime',
        label: 'LLM Inference Engine',
        category: 'Inference',
        protocol: 'OpenAI API / vLLM',
        tech: ['vLLM', 'Claude 3.7', 'GPT-4o', 'Ollama'],
        description: 'High-throughput model serving with speculative decoding and prompt cache reuse.',
        specs: {
          layer: 'Model Inference',
          scaling: 'GPU Auto-scaling (Ray / KEDA)',
          security: 'VPC Peering, Private Endpoints',
          observability: 'Tokens/sec, TTFT (Time to First Token)'
        },
        codeSnippet: {
          filename: 'vllm-deployment.yaml',
          language: 'yaml',
          code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-deepseek-serving
  namespace: ml-serving
spec:
  replicas: 4
  template:
    spec:
      containers:
        - name: vllm-engine
          image: vllm/vllm-openai:v0.6.3
          args:
            - "--model=deepseek-ai/DeepSeek-R1-Distill-Qwen-32B"
            - "--tensor-parallel-size=2"
            - "--max-model-len=16384"
            - "--gpu-memory-utilization=0.92"
            - "--enable-prefix-caching"
          resources:
            limits:
              nvidia.com/gpu: "2"
              memory: "48Gi"
          ports:
            - containerPort: 8000`
        },
        x: 82,
        y: 50
      },
      {
        id: 'vector-db',
        label: 'Context & Vector Store',
        category: 'Retrieval (RAG)',
        protocol: 'gRPC / HNSW',
        tech: ['Qdrant', 'Milvus', 'pgvector'],
        description: 'Stores semantic embeddings for long-term agent memory and contextual document retrieval.',
        specs: {
          layer: 'Knowledge Persistence',
          scaling: 'Sharded Cluster, Multi-replica read',
          security: 'AES-256 at rest, TLS in transit',
          observability: 'Query recall %, P99 query latency < 15ms'
        },
        codeSnippet: {
          filename: 'qdrant-collection.yaml',
          language: 'yaml',
          code: `apiVersion: qdrant.io/v1alpha1
kind: QdrantCollection
metadata:
  name: agent-knowledge-base
spec:
  vectors:
    size: 1536
    distance: Cosine
  hnsw_config:
    m: 16
    ef_construct: 128
    full_scan_threshold: 10000
  optimizers_config:
    indexing_threshold: 20000
    memmap_threshold: 50000
  replication_factor: 3
  write_consistency_factor: 2`
        },
        x: 82,
        y: 78
      }
    ],
    edges: [
      { from: 'client', to: 'gateway', protocol: 'HTTPS / WSS', label: 'Stream' },
      { from: 'gateway', to: 'orchestrator', protocol: 'gRPC', label: 'Route' },
      { from: 'orchestrator', to: 'mcp-servers', protocol: 'JSON-RPC', label: 'Tool Exec' },
      { from: 'orchestrator', to: 'llm-runtime', protocol: 'REST / vLLM', label: 'Prompt / Eval' },
      { from: 'orchestrator', to: 'vector-db', protocol: 'gRPC', label: 'RAG Context' }
    ],
    traceSteps: [
      {
        step: 1,
        title: 'Client Ingress',
        activeNodeId: 'client',
        toNodeId: 'gateway',
        action: 'HTTPS / WSS Stream Initiation',
        narrative: 'User dispatches query or event; authenticated edge ingress opens persistent SSE channel.'
      },
      {
        step: 2,
        title: 'Edge Gateway & Routing',
        fromNodeId: 'client',
        activeNodeId: 'gateway',
        toNodeId: 'orchestrator',
        action: 'gRPC Token Routing',
        narrative: 'Envoy validates JWT session token, enforces rate limits, checks semantic cache, and forwards to agent core.'
      },
      {
        step: 3,
        title: 'Agent State Machine & Planning',
        fromNodeId: 'gateway',
        activeNodeId: 'orchestrator',
        action: 'LangGraph Reasoning Loop',
        narrative: 'LangGraph initializes execution state, decomposes intent into goal sub-tasks, and formulates tool requirements.'
      },
      {
        step: 4,
        title: 'Dynamic MCP Tool Execution',
        fromNodeId: 'orchestrator',
        activeNodeId: 'mcp-servers',
        action: 'JSON-RPC Tool Invocation',
        narrative: 'Orchestrator invokes external tool definitions (CLI shell, GitHub API, Database query) over standardized MCP protocol.'
      },
      {
        step: 5,
        title: 'Semantic Context Retrieval (RAG)',
        fromNodeId: 'orchestrator',
        activeNodeId: 'vector-db',
        action: 'HNSW Vector Cosine Lookup',
        narrative: 'Queries Qdrant vector database for relevant code embeddings, past interaction history, and contextual groundings.'
      },
      {
        step: 6,
        title: 'High-Throughput LLM Inference',
        fromNodeId: 'orchestrator',
        activeNodeId: 'llm-runtime',
        action: 'vLLM Speculative Decoding',
        narrative: 'Constructed prompt with tool outputs and RAG context is dispatched to vLLM engine, streaming output tokens back to client.'
      }
    ]
  },
  {
    id: 'gitops-k8s',
    title: 'GitOps & Kubernetes Platform (IDP)',
    badge: 'PLATFORM / GITOPS',
    subtitle: 'Internal Developer Platform (IDP) with Automated ArgoCD Sync and Zero-Trust Mesh',
    description:
      'Declarative cloud-native delivery pipeline: code commits to automated image scans, GitOps synchronization, and zero-downtime canary rollouts.',
    nodes: [
      {
        id: 'developer',
        label: 'Developer / Git Push',
        category: 'Source',
        protocol: 'SSH / Git',
        tech: ['Git', 'GitHub', 'Feature Branch'],
        description: 'Engineers commit code and infrastructure manifests via pull requests.',
        specs: {
          layer: 'Source Control',
          scaling: 'Distributed',
          security: 'Signed Commits (GPG), Branch Protection',
          observability: 'PR lead time, Commit velocity'
        },
        codeSnippet: {
          filename: 'git-commit-hook.sh',
          language: 'bash',
          code: `#!/usr/bin/env bash
# Pre-commit verification & GPG signing
set -euo pipefail

echo "==> Validating Kubernetes manifests with kubeconform..."
kubeconform -strict -summary -kubernetes-version 1.30.0 manifests/

echo "==> Running security linter with Checkov..."
checkov -d manifests/ --framework kubernetes --quiet

echo "==> Ensuring GPG commit signature..."
git config commit.gpgsign true`
        },
        x: 10,
        y: 50
      },
      {
        id: 'ci-pipeline',
        label: 'GitHub Actions CI',
        category: 'Automation',
        protocol: 'Runner Webhook',
        tech: ['GitHub Actions', 'Trivy', 'Docker Buildx'],
        description: 'Runs unit tests, static code analysis, vulnerability scanning, and pushes multi-arch images.',
        specs: {
          layer: 'Continuous Integration',
          scaling: 'Ephemeral Self-hosted Runners',
          security: 'Cosign Image Signatures, SBOM Generation',
          observability: 'Build duration, Test pass rate'
        },
        codeSnippet: {
          filename: '.github/workflows/ci-build.yaml',
          language: 'yaml',
          code: `name: Production Multi-Arch CI Pipeline
on:
  push:
    branches: [ main ]

jobs:
  build-and-sign:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - name: Build and Push OCI Image
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ghcr.io/harshhaa/app:\${{ github.sha }}
      - name: Generate SBOM & Sign with Cosign
        run: |
          syft ghcr.io/harshhaa/app:\${{ github.sha }} -o spdx-json > sbom.spdx.json
          cosign sign --yes ghcr.io/harshhaa/app:\${{ github.sha }}`
        },
        x: 32,
        y: 50
      },
      {
        id: 'argocd',
        label: 'ArgoCD GitOps Controller',
        category: 'GitOps Engine',
        protocol: 'K8s API / gRPC',
        tech: ['ArgoCD', 'Helm', 'Kustomize'],
        description: 'Monitors desired state in Git and reconciles differences in live Kubernetes clusters.',
        specs: {
          layer: 'Continuous Delivery',
          scaling: 'High Availability Multi-Replica',
          security: 'K8s RBAC, Read-Only Git Tokens',
          observability: 'Sync status, Drift detection alert'
        },
        codeSnippet: {
          filename: 'argocd-application.yaml',
          language: 'yaml',
          code: `apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: production-platform-workloads
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    repoURL: 'https://github.com/NotHarshhaa/gitops-manifests.git'
    targetRevision: HEAD
    path: environments/production
    helm:
      valueFiles:
        - values-prod.yaml
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
      - ApplyOutOfSyncOnly=true`
        },
        x: 55,
        y: 50
      },
      {
        id: 'ingress',
        label: 'Ingress & Gateway API',
        category: 'Network',
        protocol: 'HTTP/3 / TLS 1.3',
        tech: ['NGINX Ingress', 'Envoy Gateway', 'Cert-Manager'],
        description: 'Manages external routing, SSL termination, and automated Let\'s Encrypt certificates.',
        specs: {
          layer: 'Cluster Ingress',
          scaling: 'DaemonSet / NLB Integration',
          security: 'Strict HTTPS, Automated Cert Renewals',
          observability: 'Ingress error codes (5xx/4xx), QPS'
        },
        codeSnippet: {
          filename: 'ingress-route.yaml',
          language: 'yaml',
          code: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  namespace: production
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-production
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "64m"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - api.harshhaa.dev
      secretName: api-harshhaa-tls
  rules:
    - host: api.harshhaa.dev
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: platform-service
                port: { number: 8080 }`
        },
        x: 82,
        y: 22
      },
      {
        id: 'workloads',
        label: 'K8s Workloads & Pods',
        category: 'Compute',
        protocol: 'TCP / mTLS',
        tech: ['Kubernetes', 'HPA', 'Linkerd Mesh'],
        description: 'Stateless microservices auto-scaled based on CPU, memory, and custom Prometheus metrics.',
        specs: {
          layer: 'Application Runtime',
          scaling: 'Horizontal Pod Autoscaler (HPA)',
          security: 'Non-root containers, NetworkPolicies',
          observability: 'Pod restart count, CPU/Memory throttle'
        },
        codeSnippet: {
          filename: 'deployment-hpa.yaml',
          language: 'yaml',
          code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: core-workload
  namespace: production
spec:
  replicas: 3
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        seccompProfile: { type: RuntimeDefault }
      containers:
        - name: app
          image: ghcr.io/harshhaa/app:v1.4.0
          securityContext:
            allowPrivilegeEscalation: false
            capabilities: { drop: ["ALL"] }
            readOnlyRootFilesystem: true
          resources:
            requests: { cpu: 250m, memory: 512Mi }
            limits: { cpu: 1000m, memory: 1Gi }
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: core-workload-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: core-workload
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target: { type: Utilization, averageUtilization: 75 }`
        },
        x: 82,
        y: 50
      },
      {
        id: 'observability',
        label: 'Telemetry & SRE Stack',
        category: 'Monitoring',
        protocol: 'PromQL / OTLP',
        tech: ['Prometheus', 'Grafana', 'Loki'],
        description: 'Scrapes container metrics, aggregates structured logs, and routes critical alerts to Slack/PagerDuty.',
        specs: {
          layer: 'Observability & Telemetry',
          scaling: 'Thanos long-term storage',
          security: 'Encrypted S3 bucket storage',
          observability: 'SLO / SLA Burn Rate, MTTD / MTTR'
        },
        codeSnippet: {
          filename: 'prometheus-slo-rules.yaml',
          language: 'yaml',
          code: `apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: platform-slo-alerts
  namespace: monitoring
spec:
  groups:
    - name: platform.slo.rules
      rules:
        - alert: HighErrorRateSLOBurn
          expr: |
            (sum(rate(http_requests_total{status=~"5.."}[5m]))
            /
            sum(rate(http_requests_total[5m]))) > 0.01
          for: 2m
          labels:
            severity: page
            tier: platform
          annotations:
            summary: "Error rate is breaching 99% availability SLO target."`
        },
        x: 82,
        y: 78
      }
    ],
    edges: [
      { from: 'developer', to: 'ci-pipeline', protocol: 'git push', label: 'Commit' },
      { from: 'ci-pipeline', to: 'argocd', protocol: 'Manifest update', label: 'Git Sync' },
      { from: 'argocd', to: 'ingress', protocol: 'K8s API', label: 'Reconcile' },
      { from: 'argocd', to: 'workloads', protocol: 'K8s API', label: 'Apply' },
      { from: 'workloads', to: 'observability', protocol: 'OTLP / Metrics', label: 'Scrape' }
    ],
    traceSteps: [
      {
        step: 1,
        title: 'Developer Commit',
        activeNodeId: 'developer',
        toNodeId: 'ci-pipeline',
        action: 'SSH Push with GPG Signatures',
        narrative: 'Engineer pushes signed Git commit to release branch with automated pre-commit lint validation.'
      },
      {
        step: 2,
        title: 'Continuous Integration Build',
        fromNodeId: 'developer',
        activeNodeId: 'ci-pipeline',
        toNodeId: 'argocd',
        action: 'Multi-Arch Build & Vulnerability Scan',
        narrative: 'GitHub Actions executes Trivy security scan, builds OCI multi-arch image, signs with Cosign, and commits updated image tag.'
      },
      {
        step: 3,
        title: 'ArgoCD Declarative Reconcile',
        fromNodeId: 'ci-pipeline',
        activeNodeId: 'argocd',
        toNodeId: 'workloads',
        action: 'K8s API State Sync',
        narrative: 'ArgoCD detects Git repository update, diffs live cluster state against desired state, and triggers automated self-healing sync.'
      },
      {
        step: 4,
        title: 'Ingress & TLS Certificate Validation',
        fromNodeId: 'argocd',
        activeNodeId: 'ingress',
        action: 'Envoy Gateway / Cert-Manager Route',
        narrative: 'Cluster Ingress establishes TLS 1.3 termination, checks cert renewal via Cert-Manager, and configures upstream service routing.'
      },
      {
        step: 5,
        title: 'Zero-Downtime Workload Rollout',
        fromNodeId: 'argocd',
        activeNodeId: 'workloads',
        toNodeId: 'observability',
        action: 'RollingUpdate & HPA Allocation',
        narrative: 'Kubernetes performs zero-downtime rolling update with Linkerd mTLS mesh injection, scaling dynamically via HPA.'
      },
      {
        step: 6,
        title: 'Telemetry & SRE Health Telemetry',
        fromNodeId: 'workloads',
        activeNodeId: 'observability',
        action: 'OTel Tracing & Prometheus Scraping',
        narrative: 'Prometheus and Loki scrape container metrics and logs; Grafana verifies SLO burn rates and cluster health status.'
      }
    ]
  },
  {
    id: 'cloud-iac',
    title: 'Cloud IaC & DevSecOps Platform',
    badge: 'CLOUD / TERRAFORM',
    subtitle: 'Automated Multi-Tier AWS Infrastructure Provisioned via Reusable Terraform Modules',
    description:
      'Production cloud architecture featuring automated VPC isolation, Managed EKS clusters, Vault secrets management, and least-privilege IAM roles.',
    nodes: [
      {
        id: 'terraform',
        label: 'Terraform IaC Registry',
        category: 'Orchestration',
        protocol: 'HCL / API',
        tech: ['Terraform', 'Terragrunt', 'S3 State Backend'],
        description: 'Declarative infrastructure code with remote state locking in AWS DynamoDB.',
        specs: {
          layer: 'Infrastructure as Code',
          scaling: 'Modular Reusable Components',
          security: 'Encrypted State, Checkov Security Audits',
          observability: 'Plan diff inspection, Drift alerts'
        },
        codeSnippet: {
          filename: 'backend.tf',
          language: 'hcl',
          code: `terraform {
  required_version = ">= 1.8.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.60"
    }
  }
  backend "s3" {
    bucket         = "harshhaa-tf-state-prod"
    key            = "platform/vpc-eks/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}`
        },
        x: 12,
        y: 50
      },
      {
        id: 'vpc',
        label: 'AWS VPC Multi-AZ',
        category: 'Networking',
        protocol: 'IP / BGP',
        tech: ['AWS VPC', 'NAT Gateways', 'Private Subnets'],
        description: 'Isolated three-tier network architecture spanned across multiple Availability Zones.',
        specs: {
          layer: 'Cloud Network Core',
          scaling: 'CIDR Block /20 Allocation',
          security: 'Network ACLs, Private Route Tables',
          observability: 'VPC Flow Logs, CloudWatch Alarms'
        },
        codeSnippet: {
          filename: 'vpc.tf',
          language: 'hcl',
          code: `module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.8"

  name = "prod-platform-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["ap-south-1a", "ap-south-1b", "ap-south-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway     = true
  single_nat_gateway     = false
  one_nat_gateway_per_az = true
  enable_dns_hostnames   = true
  enable_dns_support     = true

  tags = {
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}`
        },
        x: 38,
        y: 50
      },
      {
        id: 'eks',
        label: 'EKS Managed Cluster',
        category: 'Compute Core',
        protocol: 'Kubernetes 1.30+',
        tech: ['Amazon EKS', 'Bottlerocket OS', 'Auto Mode'],
        description: 'Production control plane with managed node groups running security-hardened container OS.',
        specs: {
          layer: 'Container Orchestration',
          scaling: 'Cluster Autoscaler / Karpenter',
          security: 'OIDC IRSA (IAM Roles for Service Accounts)',
          observability: 'EKS Control Plane Audit Logs'
        },
        codeSnippet: {
          filename: 'eks.tf',
          language: 'hcl',
          code: `module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.14"

  cluster_name    = "prod-platform-eks"
  cluster_version = "1.30"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  cluster_endpoint_public_access  = false
  cluster_endpoint_private_access = true

  eks_managed_node_groups = {
    bottlerocket = {
      ami_type       = "BOTTLEROCKET_x86_64"
      instance_types = ["m6i.xlarge"]
      min_size       = 3
      max_size       = 12
      desired_size   = 3
      labels         = { role = "general-workloads" }
    }
  }
}`
        },
        x: 65,
        y: 50
      },
      {
        id: 'vault',
        label: 'HashiCorp Vault & KMS',
        category: 'Security',
        protocol: 'mTLS / REST',
        tech: ['HashiCorp Vault', 'AWS KMS', 'External Secrets'],
        description: 'Centralized secrets management injecting ephemeral credentials directly into memory.',
        specs: {
          layer: 'Secrets & Cryptography',
          scaling: 'Consul Storage Cluster',
          security: 'Auto-unseal via KMS, Dynamic Secrets',
          observability: 'Audit access logs, Lease renewal metrics'
        },
        codeSnippet: {
          filename: 'vault.tf',
          language: 'hcl',
          code: `resource "vault_auth_backend" "aws" {
  type = "aws"
  tune {
    default_lease_ttl = "1h"
    max_lease_ttl     = "24h"
  }
}

resource "vault_aws_auth_backend_role" "eks_workloads" {
  backend                  = vault_auth_backend.aws.path
  role                     = "eks-production-role"
  auth_type                = "iam"
  bound_iam_principal_arns = [module.eks.cluster_iam_role_arn]
  token_policies           = ["production-read-secrets"]
}`
        },
        x: 88,
        y: 25
      },
      {
        id: 'storage',
        label: 'Cloud Persistence & RDS',
        category: 'Storage',
        protocol: 'Postgres / S3 API',
        tech: ['Amazon Aurora', 'AWS S3', 'EFS CSI'],
        description: 'Multi-AZ database clusters with automated snapshotting and encrypted object storage.',
        specs: {
          layer: 'Data Storage',
          scaling: 'Read Replicas, Auto-growing Storage',
          security: 'KMS Customer-Managed Keys (CMK)',
          observability: 'Enhanced Monitoring, Performance Insights'
        },
        codeSnippet: {
          filename: 'aurora-rds.tf',
          language: 'hcl',
          code: `module "aurora" {
  source  = "terraform-aws-modules/rds-aurora/aws"
  version = "~> 9.3"

  name           = "prod-platform-aurora"
  engine         = "aurora-postgresql"
  engine_version = "16.2"
  instance_class = "db.r6g.large"

  instances = {
    writer   = {}
    reader_1 = {}
    reader_2 = {}
  }

  vpc_id               = module.vpc.vpc_id
  db_subnet_group_name = module.vpc.database_subnet_group_name
  storage_encrypted    = true
  kms_key_id           = aws_kms_key.database.arn
}`
        },
        x: 88,
        y: 75
      }
    ],
    edges: [
      { from: 'terraform', to: 'vpc', protocol: 'AWS API', label: 'Provision' },
      { from: 'vpc', to: 'eks', protocol: 'ENI / CNI', label: 'Attach' },
      { from: 'eks', to: 'vault', protocol: 'IRSA / mTLS', label: 'Fetch Secrets' },
      { from: 'eks', to: 'storage', protocol: 'Private Subnet', label: 'Persist' }
    ],
    traceSteps: [
      {
        step: 1,
        title: 'Terraform Plan & Remote State',
        activeNodeId: 'terraform',
        toNodeId: 'vpc',
        action: 'S3 State Locking & DynamoDB Hash',
        narrative: 'Terraform reads locked state from S3, plans infrastructure changes, and executes validated AWS API calls.'
      },
      {
        step: 2,
        title: 'VPC Multi-AZ Provisioning',
        fromNodeId: 'terraform',
        activeNodeId: 'vpc',
        toNodeId: 'eks',
        action: '3-Tier Subnet & NAT Routing',
        narrative: 'AWS VPC provisions redundant public and private subnets across 3 Availability Zones with dedicated NAT Gateways.'
      },
      {
        step: 3,
        title: 'EKS Control Plane & Worker Nodes',
        fromNodeId: 'vpc',
        activeNodeId: 'eks',
        action: 'Bottlerocket OS & Auto Mode Node Group',
        narrative: 'Managed EKS cluster joins isolated private subnets, initializing security-hardened Bottlerocket worker nodes.'
      },
      {
        step: 4,
        title: 'HashiCorp Vault Secrets Injection',
        fromNodeId: 'eks',
        activeNodeId: 'vault',
        action: 'IAM OIDC IRSA Authentication',
        narrative: 'Pods authenticate via IRSA and dynamically retrieve short-lived database and API credentials from Vault in-memory.'
      },
      {
        step: 5,
        title: 'Aurora PostgreSQL Storage Tier',
        fromNodeId: 'eks',
        activeNodeId: 'storage',
        action: 'KMS-Encrypted Connection Pool',
        narrative: 'Workloads execute high-throughput transactions against Aurora Multi-AZ writer and reader replicas with automatic failover.'
      }
    ]
  }
]
