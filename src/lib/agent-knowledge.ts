export interface AgentMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  suggestions?: string[]
}

export const INITIAL_SUGGESTIONS = [
  'What is Harshhaa\'s primary expertise?',
  'Tell me about his AI Infrastructure & Agentic work',
  'What is his tech stack & DevOps skills?',
  'How can I get in touch or hire him?'
]

export const AGENT_SYSTEM_PROMPT = `
You are Harshhaa's Portfolio Agent, a dedicated assistant for Harshhaa Vardhan Reddy's personal portfolio.
Harshhaa is a Platform Engineer • DevOps • AI Infrastructure & AI Product Development specialist based in Hyderabad, India, specializing in:
- Platform Engineering & Internal Developer Platforms (IDP) (Backstage, ArgoCD, Kubernetes, GitOps)
- DevOps & Infrastructure as Code (Terraform, CI/CD with GitHub Actions & Jenkins, AWS/Azure automation)
- AI Infrastructure & LLMOps (vLLM, Ollama, MLflow, GPU cluster management, vector databases, RAG pipelines)
- GenAI, AI Agents & Model Context Protocol (MCP) (LangGraph, custom MCP servers, agent tool calling, multi-agent orchestration)
- AI Product Development (Full-lifecycle development of agentic AI applications, AI developer tools, and intelligent platform services)

Tone: Professional, direct, technical, and concise. Format with bullet points where appropriate.
`

export function getLocalAgentResponse(input: string): { reply: string; suggestions?: string[] } {
  const q = input.trim().toLowerCase()

  // 1. Greetings
  if (/^(hi|hello|hey|greetings|hola|namaste|sup|yo)\b/i.test(q)) {
    return {
      reply: `**Hello! I am Harshhaa's Portfolio Assistant.**\n\nI can help you explore Harshhaa's background in **Platform Engineering**, **DevOps**, **AI Infrastructure**, and **AI Product Development**.\n\nWhat would you like to know?`,
      suggestions: [
        'What is his primary expertise?',
        'Tell me about his AI & Agentic work',
        'What is his core tech stack?',
        'How can I contact him?'
      ]
    }
  }

  // 2. Who is Harshhaa / Bio / Overview
  if (
    q.includes('who is') ||
    q.includes('about') ||
    q.includes('introduce') ||
    q.includes('background') ||
    q.includes('summary')
  ) {
    return {
      reply: `**Harshhaa Vardhan Reddy** is a **Platform Engineer • DevOps • AI Infrastructure & AI Product Development** specialist based in Hyderabad, India.\n\n` +
        `• **Headline**: *"Building scalable developer platforms, production AI infrastructure, autonomous AI agents, MCP ecosystems, and AI products."*\n` +
        `• **Platform & DevOps Foundation**: 5+ years building Internal Developer Platforms (IDPs), declarative IaC with Terraform, Kubernetes, and GitOps CI/CD pipelines.\n` +
        `• **AI Infrastructure & LLMOps**: GPU orchestration on Kubernetes, vLLM/Ollama model serving, vector search (Qdrant, pgvector), and MLflow.\n` +
        `• **GenAI, AI Agents & MCP**: LangGraph workflows, custom Model Context Protocol (MCP) servers, and multi-agent coordination.\n` +
        `• **AI Product Development**: End-to-end user-facing AI applications, platform automation bots, and self-service portals.\n\n` +
        `You can learn more on the [Career Timeline](/career) and [About Section](/).`,
      suggestions: [
        'What is his tech stack?',
        'Tell me about his AI Infrastructure work',
        'View his projects'
      ]
    }
  }

  // 3. AI Infrastructure & Agentic Systems / MCP
  if (
    q.includes('ai') ||
    q.includes('agent') ||
    q.includes('mcp') ||
    q.includes('llm') ||
    q.includes('genai') ||
    q.includes('mlops') ||
    q.includes('llmops')
  ) {
    return {
      reply: `**AI Infrastructure, GenAI & MCP Expertise:**\n\n` +
        `Harshhaa designs and deploys production AI systems from infrastructure to agent interfaces:\n\n` +
        `• **Model Context Protocol (MCP)**: Custom MCP servers interfacing LLMs with Kubernetes, cloud APIs, and enterprise systems.\n` +
        `• **Autonomous AI Agents**: Multi-agent architectures with LangGraph, tool calling, and Agent2Agent (A2A) coordination.\n` +
        `• **AI Infrastructure & LLMOps**: High-throughput inference with vLLM, Ollama, GPU worker pools, and MLflow experiment tracking.\n` +
        `• **Vector Search & RAG**: Semantic retrieval pipelines using Qdrant, pgvector, and Milvus for real-time contextual intelligence.`,
      suggestions: [
        'What DevOps tools does he use?',
        'What projects has he built?',
        'How can I contact him?'
      ]
    }
  }

  // 3.5 System Architecture Blueprints
  if (q.includes('architecture') || q.includes('diagram') || q.includes('blueprint')) {
    return {
      reply: `**Interactive System Architectures & Blueprints:**\n\n` +
        `Harshhaa has architected three production systems featured on the portfolio:\n\n` +
        `1. **Agentic AI & MCP Platform**: Multi-agent orchestration with Model Context Protocol (MCP) tool execution, vLLM inference, and Qdrant vector retrieval.\n` +
        `2. **Kubernetes & GitOps IDP**: Automated delivery pipeline with GitHub Actions, ArgoCD controllers, Ingress routing, and HPA autoscaling.\n` +
        `3. **Cloud Native IaC & DevSecOps**: Modular AWS infrastructure provisioned via Terraform with Vault secrets and OIDC IAM.\n\n` +
        `Check out the interactive blueprint canvas with live traffic simulation on the [Home Page](/).`,
      suggestions: [
        'Tell me about his AI Infrastructure work',
        'What is his core tech stack?',
        'View his projects'
      ]
    }
  }

  // 4. Tech Stack / Skills / Technologies
  if (
    q.includes('stack') ||
    q.includes('skill') ||
    q.includes('technology') ||
    q.includes('technologies') ||
    q.includes('tool') ||
    q.includes('kubernetes') ||
    q.includes('docker') ||
    q.includes('aws') ||
    q.includes('terraform')
  ) {
    return {
      reply: `**Harshhaa's 10 Core Skill Categories:**\n\n` +
        `1. **Platform Engineering & IDP**: Backstage, ArgoCD, Kubernetes, GitOps, Self-Service Portals\n` +
        `2. **DevOps & CI/CD**: GitHub Actions, Jenkins, Azure DevOps, GitLab CI, Helm, Argo Rollouts\n` +
        `3. **AI Infrastructure & LLMOps**: vLLM, Ollama, MLflow, Qdrant, pgvector, GPU cluster management\n` +
        `4. **GenAI, AI Agents & MCP**: LangGraph, LangChain, Model Context Protocol (MCP), Agent2Agent\n` +
        `5. **AI Product Development**: FastAPI, Next.js AI SDK, Interactive AI Agents, Tool Calling\n` +
        `6. **Cloud & Containers**: Kubernetes (EKS/AKS), Docker, AWS, Azure, GCP, Karpenter\n` +
        `7. **Infrastructure as Code**: Terraform, OpenTofu, Ansible, Terragrunt, Policy as Code\n` +
        `8. **Observability & SRE**: Prometheus, Grafana, OpenTelemetry, Loki, Alertmanager\n` +
        `9. **Languages & Scripting**: Python, Bash / Shell, Go (Golang), Linux, REST & gRPC\n` +
        `10. **Community & Open Source**: 40+ blueprints, 120+ deep-dive guides, 250,000+ readers\n\n` +
        `Explore all crafts in the [Projects Catalog](/projects).`,
      suggestions: [
        'Tell me about his featured projects',
        'What is his work experience?',
        'Download or view Resume'
      ]
    }
  }

  // 5. Projects / Crafts / Open Source
  if (
    q.includes('project') ||
    q.includes('craft') ||
    q.includes('github') ||
    q.includes('repo') ||
    q.includes('open source')
  ) {
    return {
      reply: `**Featured Projects & Open Source Crafts:**\n\n` +
        `Harshhaa maintains several open-source platforms, guides, and infrastructure templates:\n\n` +
        `• **DevOps & Platform Projects Hub**: 40+ production CI/CD, Kubernetes, and Terraform projects.\n` +
        `• **Agentic AI & MCP Suite**: Autonomous AI agents with Model Context Protocol tool calling.\n` +
        `• **Internal Developer Platform (IDP)**: Self-service developer portal templates with ArgoCD.\n` +
        `• **AI Infrastructure & LLMOps Pipeline**: High-throughput vLLM serving on GPU Kubernetes nodes.\n\n` +
        `Check out the interactive search and demo links on the [Projects Page](/projects) or his [GitHub Profile](https://github.com/NotHarshhaa).`,
      suggestions: [
        'What is his work experience?',
        'What is his primary expertise?',
        'How to contact him?'
      ]
    }
  }

  // 6. Career / Experience / Jobs
  if (
    q.includes('experience') ||
    q.includes('career') ||
    q.includes('work') ||
    q.includes('job') ||
    q.includes('company') ||
    q.includes('history')
  ) {
    return {
      reply: `**Career & Professional Journey:**\n\n` +
        `• **Tata Consultancy Services** (Lead DevOps & Platform Engineer, Mar 2023 – Present):\n` +
        `  Built self-service IDPs cutting onboarding to under 2 days, boosted deployment frequency by 65%, built custom MCP servers & GenAI dev tools, and reduced MTTD by 45% with OpenTelemetry & Prometheus.\n` +
        `• **DEV Community & Hashnode** (DevOps & AI Technical Writer / Community Lead, Mar 2022 – Present):\n` +
        `  Authored 120+ guides on DevOps, Kubernetes, Terraform, and MCP, reaching 250,000+ engineers worldwide.\n` +
        `• **IBM** (DevOps & Cloud Engineer, Dec 2021 – Feb 2023):\n` +
        `  Automated AWS infrastructure via modular Terraform, containerized 25+ microservices, and maintained 99.95% system uptime.\n\n` +
        `Read the full timeline on the [Career Page](/career).`,
      suggestions: [
        'View his projects',
        'What is his tech stack?',
        'How to contact him?'
      ]
    }
  }

  // 7. Contact / Hire / Email / Telegram / Socials
  if (
    q.includes('contact') ||
    q.includes('hire') ||
    q.includes('email') ||
    q.includes('reach') ||
    q.includes('telegram') ||
    q.includes('linkedin') ||
    q.includes('resume') ||
    q.includes('available') ||
    q.includes('availability')
  ) {
    return {
      reply: `**Get in Touch with Harshhaa:**\n\n` +
        `Harshhaa is open to collaborations, technical consultations, and platform/AI infrastructure engineering opportunities.\n\n` +
        `• **Email**: [harshhaa03@gmail.com](mailto:harshhaa03@gmail.com)\n` +
        `• **LinkedIn**: [linkedin.com/in/harshhaa-vardhan-reddy](https://linkedin.com/in/harshhaa-vardhan-reddy)\n` +
        `• **GitHub**: [github.com/NotHarshhaa](https://github.com/NotHarshhaa)\n` +
        `• **Telegram**: [@prodevopsguy](https://t.me/prodevopsguy)\n` +
        `• **Blog**: [blog.harshhaareddy.com](https://blog.harshhaareddy.com)\n\n` +
        `You can also send a direct message through the [Contact Form](/contact).`,
      suggestions: [
        'What is his primary expertise?',
        'Tell me about his AI & Agentic work',
        'View his projects'
      ]
    }
  }

  // 8. Location / Timezone
  if (q.includes('location') || q.includes('where') || q.includes('city') || q.includes('country') || q.includes('timezone')) {
    return {
      reply: `Harshhaa is based in **Hyderabad, India** (IST / UTC+5:30) and works with teams globally across remote and hybrid environments.`,
      suggestions: [
        'How can I contact him?',
        'What is his primary expertise?',
        'View his projects'
      ]
    }
  }

  // 9. Telemetry & Infrastructure Healthcheck
  if (
    q.includes('telemetry') ||
    q.includes('health') ||
    q.includes('status') ||
    q.includes('uptime') ||
    q.includes('operational') ||
    q.includes('ping') ||
    q.includes('latency')
  ) {
    return {
      reply: `**Live Platform & Infrastructure Telemetry:**\n\n` +
        `• **System Status**: All systems fully operational (100% healthy)\n` +
        `• **Edge Routing**: Primary region BOM1 (Hyper-local CDN & Ingress)\n` +
        `• **Runtime**: Next.js 16 with Turbopack Engine\n` +
        `• **Security**: TLS 1.3 Strict HTTPS with auto-renewed certificates\n` +
        `• **Services**: Edge Ingress, App Runtime, AI Portfolio Agent, and GitHub Telemetry Sync are all online.\n\n` +
        `You can click the **[INSPECT]** button in the footer or the **\`● HEALTHY\`** beacon in the header to view real-time latency and cluster health.`,
      suggestions: [
        'What is Harshhaa\'s primary expertise?',
        'Tell me about his AI Infrastructure work',
        'What is his core tech stack?'
      ]
    }
  }

  // Default fallback with helpful direction
  return {
    reply: `I understand you are asking about: *"${input}"*.\n\n` +
      `As Harshhaa's Portfolio Agent, I can answer questions regarding:\n` +
      `• **Platform Engineering & DevOps** (Kubernetes, AWS, Terraform, Docker, Helm)\n` +
      `• **AI Infrastructure & Agentic Systems** (MCP, LLMOps, Multi-Agent Systems, RAG)\n` +
      `• **Projects & Open-Source Crafts**\n` +
      `• **Career Journey & Contact Details**\n\n` +
      `Would you like to explore any of the options below, or send a message via the [Contact Form](/contact)?`,
    suggestions: [
      'What is Harshhaa\'s primary expertise?',
      'Tell me about his AI Infrastructure work',
      'What is his core tech stack?',
      'How to get in touch or hire him?'
    ]
  }
}
