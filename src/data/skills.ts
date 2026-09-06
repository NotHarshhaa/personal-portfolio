export interface SkillCategory {
  category: string
  label?: string
  items: string[]
}

export const CATEGORIZED_SKILLS: SkillCategory[] = [
  {
    category: 'Platform Engineering & IDP',
    items: [
      'Platform Engineering',
      'Internal Developer Platforms (IDP)',
      'Backstage',
      'Developer Experience (DevEx)',
      'GitOps',
      'ArgoCD',
      'Self-Service Portals',
      'Golden Paths'
    ]
  },
  {
    category: 'DevOps & CI/CD',
    items: [
      'DevOps',
      'CI/CD Pipelines',
      'GitHub Actions',
      'Azure DevOps',
      'GitLab CI',
      'Jenkins',
      'Helm',
      'Argo Rollouts',
      'Release Automation'
    ]
  },
  {
    category: 'AI Infrastructure & LLMOps',
    items: [
      'AI Infrastructure',
      'LLMOps',
      'MLOps',
      'vLLM',
      'Ollama',
      'MLflow',
      'Vector Databases (Qdrant/Milvus/pgvector)',
      'RAG Pipelines',
      'GPU Cluster Management'
    ]
  },
  {
    category: 'GenAI, AI Agents & MCP',
    items: [
      'Generative AI',
      'AI Agents',
      'Agentic AI Systems',
      'Model Context Protocol (MCP)',
      'Agent2Agent (A2A)',
      'LangGraph',
      'LangChain',
      'Prompt Engineering',
      'Context Engineering',
      'Autonomous Workflows'
    ]
  },
  {
    category: 'AI Product Development',
    items: [
      'AI Product Development',
      'Full-Stack AI Apps',
      'FastAPI',
      'Next.js AI SDK',
      'Interactive AI Agents',
      'Tool Calling & Function Calling',
      'Semantic Search'
    ]
  },
  {
    category: 'Cloud & Containers',
    items: [
      'Kubernetes (EKS/AKS)',
      'Docker',
      'AWS',
      'Azure',
      'GCP',
      'Karpenter',
      'Container Optimization'
    ]
  },
  {
    category: 'Infrastructure as Code',
    items: [
      'Terraform',
      'OpenTofu',
      'Ansible',
      'Infrastructure as Code (IaC)',
      'Terragrunt',
      'Policy as Code (OPA)'
    ]
  },
  {
    category: 'Observability & SRE',
    items: [
      'Prometheus',
      'Grafana',
      'OpenTelemetry (OTel)',
      'Loki',
      'Alertmanager',
      'Incident Management',
      'Observability'
    ]
  },
  {
    category: 'Languages & Scripting',
    items: [
      'Python',
      'Bash / Shell Scripting',
      'Go (Golang)',
      'Linux Administration & Networking',
      'REST & gRPC APIs'
    ]
  },
  {
    category: 'Community & Open Source',
    items: [
      'Open Source Leadership',
      'Technical Writing',
      'Community Mentorship',
      'DevOps Blueprints'
    ]
  }
]

export const SPECIALTIES = [
  'Platform Engineering',
  'DevOps & GitOps',
  'AI Infrastructure',
  'LLMOps',
  'GenAI & AI Agents',
  'Model Context Protocol (MCP)',
  'AI Product Development',
  'Kubernetes & Cloud'
]

// TECH_STACK maps label to category for backward compatibility across components
export const TECH_STACK = CATEGORIZED_SKILLS.map((cat) => ({
  label: cat.category,
  items: cat.items
}))

export const CURRENT_FOCUS = [
  'Platform Engineering',
  'Internal Developer Platforms (IDP)',
  'Self-Service Portals & Golden Paths',
  'GitOps with ArgoCD & Flux',
  'AI Infrastructure & GPU Orchestration',
  'LLMOps with vLLM & Ollama',
  'Vector Databases (Qdrant, pgvector)',
  'Generative AI & Agentic AI Systems',
  'Model Context Protocol (MCP)',
  'Multi-Agent Coordination (Agent2Agent)',
  'LangGraph & LangChain Workflows',
  'AI Product Development & Tool Calling',
  'Infrastructure as Code (Terraform & OpenTofu)',
  'Zero-Trust Observability (OTel, Prometheus, Loki)',
  'Developer Experience (DevEx)'
]

export const EXPERTISE = [
  'Platform Engineering & IDP',
  'Enterprise DevOps & CI/CD Pipelines',
  'Production Kubernetes (EKS, AKS)',
  'AI Infrastructure & GPU Clusters',
  'LLMOps, vLLM & Local Model Serving',
  'Autonomous AI Agents & Workflows',
  'Model Context Protocol (MCP) Servers',
  'RAG Architectures & Vector Search',
  'Full-Stack AI Application Development',
  'Infrastructure as Code (Terraform, Ansible)',
  'Full-Stack Telemetry (OTel, Prometheus, Grafana)',
  'Open-Source Engineering & Blueprints'
]
