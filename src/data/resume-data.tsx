import { GitHubIcon } from '@/components/icons/github'
import { LinkedInIcon } from '@/components/icons/linkedin'
import { TelegramIcon } from '@/components/icons/telegram'
import { FileTextIcon, LinkIcon, MailIcon } from 'lucide-react'

export interface ResumeSkillCategory {
  category: string
  skills: string[]
}

export interface ResumeWorkItem {
  company: string
  link: string
  badges: string[]
  title: string
  start: string
  end: string
  description: string[]
}

export interface ResumeProjectItem {
  title: string
  description: string
  architectureHighlights: string[]
  metrics?: string
  tags: string[]
  link: {
    github?: string
    preview?: string
  }
}

export const RESUME_DATA = {
  name: 'Harshhaa Vardhan Reddy',
  initials: 'HR',
  location: 'Hyderabad, India',
  role: 'Platform Engineer • DevOps • AI Infrastructure & AI Product Development',
  about:
    'Building scalable developer platforms, production AI infrastructure, autonomous AI agents, MCP ecosystems, and AI products.',
  summary: [
    'Platform & DevOps Foundation: 5+ years of engineering hands-on internal developer platforms (IDPs), declarative infrastructure with Terraform, Kubernetes container orchestration, and automated GitOps CI/CD pipelines across AWS and Azure.',
    'AI Infrastructure & LLMOps: Building scalable inference infrastructure, GPU-accelerated Kubernetes nodes, model deployment with vLLM and Ollama, vector search retrieval (Qdrant, pgvector), and MLflow experiment tracking.',
    'GenAI, AI Agents & MCP: Architecting autonomous agent workflows with LangGraph and LangChain, developing custom Model Context Protocol (MCP) servers to interface LLMs with cloud APIs and DevOps tooling, and multi-agent coordination (A2A).',
    'AI Product Development: Leading the end-to-end design, implementation, and deployment of user-facing AI products, intelligent platform automation bots, and self-service developer portals.',
    'Open-Source Impact: Prolific builder with 40+ production DevOps & AI project blueprints, educational docs, and open-source tooling empowering 250,000+ engineers globally.'
  ],
  contact: {
    email: 'harshhaa03@gmail.com',
    social: [
      {
        name: 'GitHub',
        url: 'https://github.com/NotHarshhaa',
        icon: GitHubIcon
      },
      {
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/harshhaa-vardhan-reddy',
        icon: LinkedInIcon
      },
      {
        name: 'Telegram',
        url: 'https://t.me/prodevopsguy',
        icon: TelegramIcon
      },
      {
        name: 'Blog',
        url: 'https://blog.harshhaareddy.com',
        icon: LinkIcon
      },
      {
        name: 'Resume',
        url: 'https://cv.harshhaareddy.com',
        icon: FileTextIcon
      },
      {
        name: 'Email',
        url: 'mailto:harshhaa03@gmail.com',
        icon: MailIcon
      }
    ]
  },
  work: [
    {
      company: 'Tata Consultancy Services',
      link: 'https://www.tcs.com',
      badges: ['Full-time', 'Hybrid'],
      title: 'Lead DevOps & Platform Engineer',
      start: 'Mar, 2023',
      end: 'Present',
      description: [
        'Platform Engineering & IDP: Built self-service Internal Developer Platform (IDP) templates with ArgoCD and Kubernetes, enabling developers to spin up ephemeral environments in minutes, reducing onboarding from 3 weeks to under 2 days.',
        'DevOps & GitOps: Engineered enterprise CI/CD pipelines using GitHub Actions, ArgoCD, and Helm across AWS and Azure, boosting deployment frequency by 65% while keeping deployment failure rate under 0.1%.',
        'AI Product & Tooling Development: Spearheaded internal GenAI developer tools and custom Model Context Protocol (MCP) servers, enabling engineering teams to query Kubernetes cluster health and cloud resources using natural language agents.',
        'AI Infrastructure & LLMOps: Provisioned scalable Kubernetes environments for local LLM inference and embedding workloads with optimized container images and GPU resource allocations.',
        'Observability & SRE: Configured end-to-end telemetry across 80+ microservices using Prometheus, Grafana, OpenTelemetry, and Loki, slashing Mean Time to Detection (MTTD) by 45%.',
        'Infrastructure as Code & Cloud Optimization: Managed multi-account AWS and Azure infrastructure via modular Terraform, rightsizing compute resources to achieve 28% infrastructure cost savings.'
      ]
    },
    {
      company: 'DEV Community & Hashnode',
      link: 'https://dev.to/notharshhaa',
      badges: ['Community Lead', 'Remote'],
      title: 'DevOps & AI Technical Writer / Community Lead',
      start: 'Mar, 2022',
      end: 'Present',
      description: [
        'Authored 120+ deep-dive guides on DevOps automation, Kubernetes, Terraform, GenAI agents, and MCP server development, surpassing 250,000+ views worldwide.',
        'Recognized as Top Author and Community Leader on Hashnode and DEV.to for actionable production tutorials and real-world engineering architectures.',
        'Published 30+ open-source project repositories, starter templates, and interview guides actively used by engineers worldwide.'
      ]
    },
    {
      company: 'IBM',
      link: 'https://www.ibm.com',
      badges: ['Full-time', 'Remote'],
      title: 'DevOps & Cloud Engineer',
      start: 'Dec, 2021',
      end: 'Feb, 2023',
      description: [
        'IaC Automation: Automated multi-tier AWS infrastructure provisioning (VPC, EKS, RDS, ALB) using Terraform modules with DynamoDB remote state locking, eliminating configuration drift.',
        'Containerization & CI/CD: Containerized 25+ microservices with Docker multi-stage builds, cutting image sizes by 65% and accelerating Jenkins automated CI/CD build cycles.',
        'Kubernetes Operations: Configured AWS EKS cluster networking, IAM Roles for Service Accounts (IRSA), ingress controllers, and auto-scaling policies for high-traffic services.',
        'Deployment Reliability: Established automated health checks, blue/green release patterns, and CloudWatch monitoring, maintaining 99.95% system uptime.'
      ]
    }
  ],
  education: [
    {
      school: 'Jawaharlal Nehru Technological University Hyderabad (JNTUH)',
      degree: 'Bachelor of Technology (B.Tech)',
      start: '2015',
      end: '2020',
      description:
        'Foundations in computer science, distributed networking, software engineering, and systems architecture.'
    }
  ],
  skills: [
    {
      category: 'Platform Engineering & IDP',
      skills: [
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
      skills: [
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
      skills: [
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
      skills: [
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
      skills: [
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
      skills: [
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
      skills: [
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
      skills: [
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
      skills: [
        'Python',
        'Bash / Shell Scripting',
        'Go (Golang)',
        'Linux Administration & Networking',
        'REST & gRPC APIs'
      ]
    },
    {
      category: 'Community & Open Source',
      skills: [
        'Open Source Leadership',
        'Technical Writing',
        'Community Mentorship',
        'DevOps Blueprints'
      ]
    }
  ],
  projects: [
    {
      title: 'DevOps & Platform Engineering Projects Hub',
      description:
        'Production-grade reference implementations of real-time DevOps, GitOps, and platform engineering architectures.',
      architectureHighlights: [
        'ArgoCD GitOps deployment with automated drift detection',
        'Multi-stage Docker builds and Kubernetes HPA autoscaling',
        'Terraform modular IaC with AWS EKS, ALB, and VPC networking',
        'Integrated Trivy vulnerability scanning and SonarQube quality gates'
      ],
      metrics: '40+ production project blueprints, 10,000+ active repository stars/forks',
      tags: ['Platform Engineering', 'Kubernetes', 'ArgoCD', 'Terraform', 'AWS', 'Docker'],
      link: {
        github: 'https://github.com/NotHarshhaa/DevOps-Projects',
        preview: 'https://projects.prodevopsguytech.com'
      }
    },
    {
      title: 'Agentic AI & Model Context Protocol (MCP) Suite',
      description:
        'Enterprise Model Context Protocol (MCP) servers and autonomous AI agents designed to bridge LLMs with cloud infrastructure, Kubernetes clusters, and enterprise systems.',
      architectureHighlights: [
        'Custom MCP protocol endpoints for dynamic tool discovery and execution',
        'LangGraph state machines managing multi-agent handoffs and task planning',
        'Local inference support with vLLM & Ollama, secured via OAuth tokens',
        'Vector retrieval using Qdrant for semantic infrastructure log troubleshooting'
      ],
      metrics: 'Sub-second tool invocation latency, zero hallucinated tool arguments',
      tags: ['MCP', 'AI Agents', 'LangGraph', 'vLLM', 'FastAPI', 'Python'],
      link: {
        github: 'https://github.com/NotHarshhaa',
        preview: 'https://blog.harshhaareddy.com'
      }
    },
    {
      title: 'Enterprise Internal Developer Platform (IDP)',
      description:
        'Self-service developer platform enabling engineering teams to provision ephemeral environments, deploy microservices, and observe telemetry without ticket bottlenecks.',
      architectureHighlights: [
        'Backstage portal integration with customized service catalog templates',
        'ArgoCD ApplicationSets for automated multi-cluster tenant onboarding',
        'Crossplane and Terraform integration for on-demand cloud resource provisioning',
        'Integrated OpenTelemetry collector with Prometheus and Grafana dashboards'
      ],
      metrics: 'Developer onboarding reduced from 3 weeks to under 2 days',
      tags: ['Platform Engineering', 'IDP', 'Backstage', 'ArgoCD', 'Kubernetes', 'OpenTelemetry'],
      link: {
        github: 'https://github.com/NotHarshhaa',
        preview: 'https://docs.prodevopsguytech.com'
      }
    },
    {
      title: 'AI Infrastructure & LLMOps Production Pipeline',
      description:
        'Automated model evaluation, serving, and GPU resource management infrastructure for fine-tuned LLMs and embedding models on Kubernetes.',
      architectureHighlights: [
        'vLLM high-throughput tensor-parallel inference serving with PagedAttention',
        'MLflow model registry and experiment tracking integrated into GitHub Actions',
        'Karpenter autoscaling for GPU-backed worker node pools with cost optimization',
        'Pgvector and Qdrant cluster for low-latency RAG embedding similarity search'
      ],
      metrics: '3.4x higher token throughput compared to standard HuggingFace endpoints',
      tags: ['LLMOps', 'AI Infrastructure', 'vLLM', 'Qdrant', 'MLflow', 'Kubernetes'],
      link: {
        github: 'https://github.com/NotHarshhaa',
        preview: 'https://repos.prodevopsguytech.com'
      }
    },
    {
      title: 'Ultimate DevOps, Cloud & AI Documentation Portal',
      description:
        'Comprehensive documentation portal featuring 900+ curated guides, real-world deployment patterns, and operational runbooks for engineers globally.',
      architectureHighlights: [
        'Static site generator optimized for instant search and offline caching',
        'Automated CI/CD validation on all code snippets and Terraform configs',
        'Category tagging across DevOps, Kubernetes, Terraform, and GenAI'
      ],
      metrics: '250,000+ readers across 60+ countries',
      tags: ['DevOps', 'Technical Writing', 'Kubernetes', 'Terraform', 'Community'],
      link: {
        github: 'https://gitlab.com/NotHarshhaa/docs-portal',
        preview: 'https://docs.prodevopsguytech.com'
      }
    }
  ]
}
