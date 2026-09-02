import type { ArchitectureSystem } from '../types'

export const AGENTIC_MCP_SYSTEM: ArchitectureSystem = {
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
  }
