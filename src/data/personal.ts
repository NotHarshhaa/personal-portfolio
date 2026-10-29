import { GitHubIcon } from '@/components/icons/github'
import { LinkedInIcon } from '@/components/icons/linkedin'
import { TelegramIcon } from '@/components/icons/telegram'
import { FileTextIcon, LinkIcon, MailIcon } from 'lucide-react'

export const AVATAR = {
  name: 'Harshhaa',
  initials: 'HR',
}

export const ABOUT = {
  role: 'Platform Engineer • DevOps • AI Infrastructure & AI Product Development',
  roles: [
    'Platform Engineer',
    'DevOps Engineer',
    'AI Infrastructure Engineer',
    'AI Product Developer',
  ],
  headline:
    'Building scalable developer platforms, production AI infrastructure, autonomous AI agents, MCP ecosystems, and AI products.',
  title:
    'Platform Engineer • DevOps • AI Infrastructure & AI Product Development. Based in Hyderabad, India.',
  description: `Building scalable developer platforms, production AI infrastructure, autonomous AI agents, MCP ecosystems, and AI products.

Platform & DevOps Foundation: 5+ years of engineering hands-on internal developer platforms (IDPs), declarative infrastructure with Terraform, Kubernetes container orchestration, and automated GitOps CI/CD pipelines across AWS and Azure.

AI Infrastructure & LLMOps: Building scalable inference infrastructure, GPU-accelerated Kubernetes nodes, model deployment with vLLM and Ollama, vector search retrieval (Qdrant, pgvector), and MLflow experiment tracking.

GenAI, AI Agents & MCP: Architecting autonomous agent workflows with LangGraph and LangChain, developing custom Model Context Protocol (MCP) servers to interface LLMs with cloud APIs and DevOps tooling, and multi-agent coordination (A2A).

AI Product Development: Leading the end-to-end design, implementation, and deployment of user-facing AI products, intelligent platform automation bots, and self-service developer portals.

Open-Source Impact: Prolific builder with 40+ production DevOps & AI project blueprints, educational docs, and open-source tooling empowering 250,000+ engineers globally.`,
}

export const LINKS = [
  {
    title: 'GitHub',
    url: 'https://github.com/NotHarshhaa',
    icon: GitHubIcon,
  },
  {
    title: 'LinkedIn',
    url: 'https://linkedin.com/in/harshhaa-vardhan-reddy',
    icon: LinkedInIcon,
  },
  {
    title: 'Telegram',
    url: 'https://t.me/prodevopsguy',
    icon: TelegramIcon,
  },
  {
    title: 'Blog',
    url: 'https://blog.harshhaareddy.com',
    icon: LinkIcon,
  },
  {
    title: 'Resume',
    url: 'https://cv.harshhaareddy.com',
    icon: FileTextIcon,
  },
  {
    title: 'Email',
    url: 'mailto:harshhaa03@gmail.com',
    icon: MailIcon,
  },
  {
    title: 'Other Links',
    url: 'https://link.harshhaareddy.com',
    icon: LinkIcon,
  },
]

/** Four capability pillars shown on the home page. */
export const PILLARS = [
  {
    id: 'platform',
    kicker: 'Platform',
    title: 'Developer Platforms',
    description:
      'Internal developer platforms, Backstage portals, golden paths, and self-service that shorten the path from idea to production.',
    tags: ['IDP', 'Backstage', 'GitOps'],
    icon: 'layers',
  },
  {
    id: 'infra',
    kicker: 'AI Infra',
    title: 'AI Infrastructure',
    description:
      'GPU-accelerated Kubernetes, high-throughput inference with vLLM and Ollama, vector search, and dependable LLMOps foundations.',
    tags: ['vLLM', 'GPU', 'Qdrant'],
    icon: 'cpu',
  },
  {
    id: 'agents',
    kicker: 'Agentic',
    title: 'Autonomous Systems',
    description:
      'MCP servers, LangGraph workflows, and A2A coordination that let agents operate real cloud and DevOps tooling safely.',
    tags: ['MCP', 'LangGraph', 'A2A'],
    icon: 'network',
  },
  {
    id: 'product',
    kicker: 'Product',
    title: 'AI Products',
    description:
      'End-to-end AI products — retrieval, tool calling, evaluation, and interfaces people actually enjoy using every day.',
    tags: ['Next.js', 'FastAPI', 'RAG'],
    icon: 'sparkles',
  },
] as const

/** Headline metrics pulled from the longer About copy. */
export const IMPACT_STATS = [
  { value: '5+', label: 'Years in platform & DevOps' },
  { value: '40+', label: 'Production blueprints' },
  { value: '250K+', label: 'Engineers reached' },
  { value: '10', label: 'Engineering domains' },
] as const

/** Short descriptions for the social links shown on the home page. */
export const LINK_DESCRIPTIONS: Record<string, string> = {
  GitHub: 'Open-source blueprints & tooling',
  LinkedIn: 'Professional timeline & network',
  Telegram: 'DevOps community & updates',
  Blog: 'Long-form engineering notes',
  Resume: 'Experience, stack & impact',
}
