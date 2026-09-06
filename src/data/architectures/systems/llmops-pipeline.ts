import type { ArchitectureSystem } from '../types'

export const LLMOPS_PIPELINE_SYSTEM: ArchitectureSystem = {
  id: 'llmops-pipeline',
  title: 'Production LLMOps Pipeline',
  badge: 'LLMOPS / AI INFRA',
  subtitle: 'Karpenter GPU Autoscaling, MLflow Registry, and vLLM / Triton High-Throughput Serving',
  description:
    'End-to-end production AI infrastructure featuring Karpenter GPU node provisioning, MLflow model registry, vLLM inference engine with PagedAttention, and automated model observability.',
  nodes: [
    {
      id: 'mlflow-registry',
      label: 'MLflow Model Registry',
      category: 'Model Governance',
      protocol: 'REST / S3 API',
      tech: ['MLflow', 'DVC', 'PostgreSQL', 'AWS S3'],
      description:
        'Centralized model registry tracking weights, lineage, hyperparameter experiments, and approval transitions.',
      specs: {
        layer: 'Model Registry & Lineage',
        scaling: 'Managed Multi-AZ RDS + S3 Artifacts',
        security: 'IAM S3 Bucket Policies, KMS Encryption',
        observability: 'Experiment runs, Perplexity & Accuracy metrics'
      },
      codeSnippet: {
        filename: 'model_registry.py',
        language: 'python',
        code: `import mlflow
from mlflow.tracking import MlflowClient

client = MlflowClient()

# Promote tested model checkpoint to production staging
model_name = "llama-3-8b-platform-agent"
latest_version = client.get_latest_versions(model_name, stages=["Staging"])[0].version

client.transition_model_version_stage(
    name=model_name,
    version=latest_version,
    stage="Production",
    archive_existing_versions=True
)

print(f"==> Model {model_name} v{latest_version} successfully deployed to Production stage.")`
      },
      x: 10,
      y: 50
    },
    {
      id: 'eval-pipeline',
      label: 'CI/CD Model Evaluation Gate',
      category: 'Evaluation',
      protocol: 'Runner Webhook / gRPC',
      tech: ['GitHub Actions', 'DeepEval', 'Prometheus'],
      description:
        'Automated gate benchmarking token latency, hallucination score, and format conformance before deployment.',
      specs: {
        layer: 'Automated Model Testing',
        scaling: 'Ephemeral GPU Runner Nodes',
        security: 'Signed Model Checksums, Cosign Attestations',
        observability: 'P99 Latency benchmarks, Hallucination delta'
      },
      codeSnippet: {
        filename: '.github/workflows/model-eval.yaml',
        language: 'yaml',
        code: `name: Model Evaluation & Security Gate
on:
  workflow_dispatch:
    inputs:
      model_uri:
        description: "MLflow Model S3 URI"
        required: true

jobs:
  evaluate-weights:
    runs-on: [self-hosted, gpu-runner]
    steps:
      - uses: actions/checkout@v4
      - name: Run DeepEval Benchmark Test Suite
        run: |
          python -m pytest tests/model_benchmarks.py \\
            --model-uri "\${{ inputs.model_uri }}" \\
            --max-p99-latency-ms 180 \\
            --min-faithfulness-score 0.94
      - name: Sign Model Checksum with Cosign
        run: |
          cosign sign-blob --key env://COSIGN_KEY model_weights.bin > checksum.sig`
      },
      x: 32,
      y: 50
    },
    {
      id: 'karpenter-gpu',
      label: 'Karpenter GPU Autoscaler',
      category: 'Infrastructure',
      protocol: 'AWS EC2 Fleet API',
      tech: ['Karpenter', 'Kubernetes EKS', 'AWS EC2 (g5/p4d)', 'NVIDIA Operator'],
      description:
        'Just-in-time GPU node provisioner spinning up NVIDIA A100/L4 instances in sub-minute cold starts.',
      specs: {
        layer: 'GPU Compute Orchestration',
        scaling: 'Sub-60s Just-in-Time Fleet Scaling',
        security: 'Bottlerocket OS, AWS IRSA Least Privilege',
        observability: 'GPU Allocation %, Spot Interruption Alarms'
      },
      codeSnippet: {
        filename: 'karpenter-gpu-nodepool.yaml',
        language: 'yaml',
        code: `apiVersion: karpenter.sh/v1beta1
kind: NodePool
metadata:
  name: gpu-inference-pool
spec:
  template:
    spec:
      requirements:
        - key: "karpenter.k8s.aws/instance-family"
          operator: In
          values: ["g5", "p4d"]
        - key: "karpenter.sh/capacity-type"
          operator: In
          values: ["spot", "on-demand"]
        - key: "kubernetes.io/arch"
          operator: In
          values: ["amd64"]
      nodeClassRef:
        apiVersion: karpenter.k8s.aws/v1beta1
        kind: EC2NodeClass
        name: gpu-optimized-al2023
  limits:
    gpu: 32
  disruption:
    consolidationPolicy: WhenUnderutilized
    expireAfter: 720h`
      },
      x: 55,
      y: 50
    },
    {
      id: 'vllm-engine',
      label: 'vLLM & Triton Inference Server',
      category: 'Inference Engine',
      protocol: 'HTTP/2 / gRPC OpenAI-Compatible',
      tech: ['vLLM', 'Triton Inference Server', 'PagedAttention', 'CUDA 12.4'],
      description:
        'High-throughput model serving engine utilizing PagedAttention, continuous batching, and tensor parallelism.',
      specs: {
        layer: 'Inference Runtime',
        scaling: 'HPA on Concurrent Token Queue Length',
        security: 'mTLS Service Mesh, API Key Gateway',
        observability: 'Tokens/sec, Time-to-First-Token (TTFT), KV Cache %'
      },
      codeSnippet: {
        filename: 'vllm-deployment.yaml',
        language: 'yaml',
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-inference-service
  namespace: llmops
spec:
  replicas: 3
  selector:
    matchLabels:
      app: vllm-engine
  template:
    metadata:
      labels:
        app: vllm-engine
    spec:
      containers:
        - name: vllm
          image: vllm/vllm-openai:v0.6.3
          args:
            - "--model"
            - "meta-llama/Meta-Llama-3.1-8B-Instruct"
            - "--tensor-parallel-size"
            - "1"
            - "--gpu-memory-utilization"
            - "0.92"
            - "--max-model-len"
            - "8192"
            - "--enable-chunked-prefill"
          resources:
            limits:
              nvidia.com/gpu: 1
              memory: 32Gi
            requests:
              nvidia.com/gpu: 1
              cpu: "8"
              memory: 16Gi
          ports:
            - containerPort: 8000
              name: http`
      },
      x: 78,
      y: 24
    },
    {
      id: 'semantic-cache',
      label: 'Semantic Cache & Vector DB',
      category: 'Cache / Retrieval',
      protocol: 'gRPC / RESP',
      tech: ['Qdrant', 'Redis Vector Library', 'pgvector'],
      description:
        'Caches high-frequency LLM responses and retrieves RAG embeddings with sub-5ms cosine similarity.',
      specs: {
        layer: 'Embedding & Semantic Cache',
        scaling: 'Sharded Memory Cluster',
        security: 'VPC Peered, Encrypted Transit (mTLS)',
        observability: 'Cache hit ratio, Embedding latency'
      },
      codeSnippet: {
        filename: 'semantic_cache.py',
        language: 'python',
        code: `from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

client = QdrantClient(host="qdrant.llmops.svc.cluster.local", port=6334)

# Check semantic similarity cache before invoking GPU cluster
def query_semantic_cache(query_vector: list[float], threshold: float = 0.96):
    results = client.search(
        collection_name="llm_semantic_cache",
        query_vector=query_vector,
        limit=1,
        score_threshold=threshold
    )
    if results:
        return results[0].payload["generated_response"]
    return None`
      },
      x: 78,
      y: 76
    },
    {
      id: 'model-observability',
      label: 'Telemetry & DCGM GPU Exporter',
      category: 'Observability',
      protocol: 'Prometheus Pull / OTLP',
      tech: ['Prometheus', 'NVIDIA DCGM', 'Grafana', 'OpenTelemetry'],
      description:
        'Captures GPU temperature, SM utilization, KV cache usage, token throughput, and TTFT latency in real time.',
      specs: {
        layer: 'Telemetry & SRE Observability',
        scaling: 'Prometheus Agent + OTel Gateway',
        security: 'Read-only metrics endpoint',
        observability: 'P99 TTFT, GPU Duty Cycle, Tokens/Sec'
      },
      codeSnippet: {
        filename: 'dcgm-alerts.yaml',
        language: 'yaml',
        code: `apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: llmops-gpu-alerts
  namespace: monitoring
spec:
  groups:
    - name: GPUPerformance
      rules:
        - alert: HighGPUVRAMUtilization
          expr: (DCGM_FI_DEV_FB_USED / DCGM_FI_DEV_FB_TOTAL) > 0.95
          for: 2m
          labels:
            severity: warning
          annotations:
            summary: "GPU VRAM exceeded 95% on {{ $labels.instance }}"
        - alert: HighInferenceLatencyP99
          expr: histogram_quantile(0.99, rate(vllm:time_to_first_token_seconds_bucket[5m])) > 0.350
          for: 3m
          labels:
            severity: critical
          annotations:
            summary: "P99 Time to First Token exceeded 350ms"`
      },
      x: 95,
      y: 50
    }
  ],
  edges: [
    {
      from: 'mlflow-registry',
      to: 'eval-pipeline',
      label: 'Weight Attestation',
      protocol: 'S3 URI / Checksum',
      type: 'sync'
    },
    {
      from: 'eval-pipeline',
      to: 'karpenter-gpu',
      label: 'Capacity Request',
      protocol: 'K8s Scheduling Pod',
      type: 'async'
    },
    {
      from: 'karpenter-gpu',
      to: 'vllm-engine',
      label: 'Attaches NVIDIA GPU',
      protocol: 'PCIe / Container Runtime',
      type: 'sync'
    },
    {
      from: 'vllm-engine',
      to: 'semantic-cache',
      label: 'Embeddings / Cache',
      protocol: 'gRPC Vectors',
      type: 'async'
    },
    {
      from: 'vllm-engine',
      to: 'model-observability',
      label: 'Metrics Stream',
      protocol: 'Prometheus OTLP',
      type: 'event'
    }
  ],
  traceSteps: [
    {
      step: 1,
      title: 'Model Registration & Checkpoint Promotion',
      fromNodeId: 'mlflow-registry',
      activeNodeId: 'mlflow-registry',
      toNodeId: 'eval-pipeline',
      action: 'Promote Staging Checkpoint',
      narrative:
        'New fine-tuned model checkpoint is approved in MLflow Model Registry with version lineage and signed checksums.'
    },
    {
      step: 2,
      title: 'Automated Evaluation & Security Benchmark',
      fromNodeId: 'mlflow-registry',
      activeNodeId: 'eval-pipeline',
      toNodeId: 'karpenter-gpu',
      action: 'Run DeepEval & Security Checks',
      narrative:
        'GitHub Actions evaluates candidate weights against DeepEval test suites, checking perplexity and hallucination bounds.'
    },
    {
      step: 3,
      title: 'Just-in-Time GPU Provisioning',
      fromNodeId: 'eval-pipeline',
      activeNodeId: 'karpenter-gpu',
      toNodeId: 'vllm-engine',
      action: 'Provision AWS EC2 GPU Fleet',
      narrative:
        'Karpenter detects GPU pod resource requirements and provisions optimized AWS EC2 g5/p4d GPU instances in <60 seconds.'
    },
    {
      step: 4,
      title: 'vLLM PagedAttention Inference Hot-Reload',
      fromNodeId: 'karpenter-gpu',
      activeNodeId: 'vllm-engine',
      toNodeId: 'semantic-cache',
      action: 'Initialize PagedAttention Engine',
      narrative:
        'vLLM initializes weights into GPU memory, activating PagedAttention and continuous batching with OpenAI API parity.'
    },
    {
      step: 5,
      title: 'Semantic Caching & Low-Latency Retrieval',
      fromNodeId: 'vllm-engine',
      activeNodeId: 'semantic-cache',
      toNodeId: 'model-observability',
      action: 'Cosine Similarity Lookup',
      narrative:
        'Incoming inference prompts query Qdrant/Redis semantic cache to return cached answers instantly or dispatch new tokens.'
    },
    {
      step: 6,
      title: 'Real-Time GPU & Token Telemetry',
      fromNodeId: 'vllm-engine',
      activeNodeId: 'model-observability',
      action: 'DCGM & Token Metric Scraping',
      narrative:
        'NVIDIA DCGM and Prometheus record Time-to-First-Token (TTFT), KV cache usage, and GPU thermal health in Grafana.'
    }
  ]
}
