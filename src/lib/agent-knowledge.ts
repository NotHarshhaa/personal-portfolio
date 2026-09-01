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
Harshhaa is a Platform Engineer based in Hyderabad, India, specializing in:
- Platform Engineering & Internal Developer Platforms (IDP)
- AI Infrastructure, MLOps, and LLMOps
- Agentic AI Systems, Multi-Agent Architectures, and Model Context Protocol (MCP)
- Cloud Native & DevOps Automation (Kubernetes, AWS, Azure, GCP, Terraform, Helm, Docker, ArgoCD)

Tone: Professional, direct, technical, and concise. Format with bullet points where appropriate.
`

export function getLocalAgentResponse(input: string): { reply: string; suggestions?: string[] } {
  const q = input.trim().toLowerCase()

  // 1. Greetings
  if (/^(hi|hello|hey|greetings|hola|namaste|sup|yo)\b/i.test(q)) {
    return {
      reply: `**Hello! I am Harshhaa's Portfolio Assistant.**\n\nI can help you explore Harshhaa's background in **Platform Engineering**, **AI Infrastructure**, and **Agentic Systems**.\n\nWhat would you like to know?`,
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
      reply: `**Harshhaa Vardhan Reddy** is a **Platform Engineer** based in Hyderabad, India.\n\n` +
        `• **Headline**: *"Platforms, AI infrastructure, and agents that help teams ship faster."*\n` +
        `• **Core Domains**: Platform Engineering, Internal Developer Platforms (IDP), Cloud Native Infrastructure, MLOps, LLMOps, and Agentic AI Systems.\n` +
        `• **Philosophy**: Creating scalable developer platforms, production-ready AI infrastructure, and automated multi-agent systems with developer experience (DevEx) at the center.\n\n` +
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
      reply: `**AI Infrastructure & Agentic Systems Expertise:**\n\n` +
        `Harshhaa focuses on the infrastructure and tooling that powers production AI:\n\n` +
        `• **Agentic AI Systems**: Multi-agent architectures, Agent2Agent (A2A) orchestration, LangGraph, LangChain, Google ADK.\n` +
        `• **Model Context Protocol (MCP)**: Building and integrating MCP servers, tool-use bindings, and dynamic agent capabilities.\n` +
        `• **LLMOps & MLOps**: Model serving, evaluation pipelines, MLflow, prompt engineering, and RAG architectures.\n` +
        `• **AI Infrastructure**: Cloud compute orchestration for AI workloads, vector databases, and automated inference gateways.`,
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
      reply: `**Harshhaa's Core Technical Stack:**\n\n` +
        `• **Cloud**: AWS, Azure, GCP\n` +
        `• **Platform & Containers**: Kubernetes, Docker, Helm, ArgoCD\n` +
        `• **Infrastructure as Code**: Terraform, Ansible\n` +
        `• **CI/CD & Automation**: GitHub Actions, Jenkins, Azure DevOps, GitLab CI\n` +
        `• **Observability**: Prometheus, Grafana\n` +
        `• **AI & Agentic Tools**: Model Context Protocol (MCP), Python, LangChain, LangGraph, MLflow\n\n` +
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
        `• **Docker Ultimate Guide**: Comprehensive production guide for containerization.\n` +
        `• **Kubernetes Cheatsheet & Lab**: Hands-on architecture and configuration patterns for K8s.\n` +
        `• **Agentic AI Platforms**: Orchestrations with MCP tool bindings and contextual agents.\n` +
        `• **Terraform AWS/Azure Modules**: Reusable IaC recipes for automated cloud infrastructure.\n\n` +
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
        `• **Platform Engineer**: Designing scalable developer platforms, automating deployments, and architecting AI infrastructure.\n` +
        `• **DEV Community**: DevOps/Cloud Content Blogger (Aug 2023 – Present), publishing deep-dive engineering guides on cloud-native practices, containers, and agentic workflows.\n` +
        `• **Community Leader**: Founder of ProDevOpsGuy on Telegram, sharing platform engineering and DevOps knowledge with thousands of developers.\n\n` +
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
        `• **Blog**: [blog.harshhaareddy.site](https://blog.harshhaareddy.site)\n\n` +
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
