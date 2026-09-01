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
  x: number // percentage 0-100
  y: number // percentage 0-100
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
        x: 88,
        y: 75
      }
    ],
    edges: [
      { from: 'terraform', to: 'vpc', protocol: 'AWS API', label: 'Provision' },
      { from: 'vpc', to: 'eks', protocol: 'ENI / CNI', label: 'Attach' },
      { from: 'eks', to: 'vault', protocol: 'IRSA / mTLS', label: 'Fetch Secrets' },
      { from: 'eks', to: 'storage', protocol: 'Private Subnet', label: 'Persist' }
    ]
  }
]
