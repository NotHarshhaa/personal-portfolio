import { GitHubIcon } from '@/components/icons/github'
import { GitHubActionsIcon } from '@/components/icons/tags/githubActions'
import { ZomatoIcon } from '@/components/icons/tags/zomato'
import { UberIcon } from '@/components/icons/tags/uber'
import { PrometheusIcon } from '@/components/icons/tags/prometheus'
import { AWSEKSIcon } from '@/components/icons/tags/awsEKS'
import { LinuxIcon } from '@/components/icons/tags/linux'
import { JenkinsIcon } from '@/components/icons/tags/jenkins'
import { KubernetesIcon } from '@/components/icons/tags/kubernetes'
import { DockerIcon } from '@/components/icons/tags/docker'
import { AzureIcon } from '@/components/icons/tags/azure'
import { AWSIcon } from '@/components/icons/tags/aws'
import { TerraformIcon } from '@/components/icons/tags/terraform'
import { AnsibleIcon } from '@/components/icons/tags/ansible'
import { AzureDevOpsIcon } from '@/components/icons/tags/azureDevOps'
import { DevOpsIcon } from '@/components/icons/tags/devops'

export const TAGS = {
  GITHUB: {
    name: 'GitHub',
    icon: GitHubIcon
  },
  GITHUB_ACTIONS: {
    name: 'GitHub Actions',
    icon: GitHubActionsIcon
  },
  ZOMATO: {
    name: 'Zomato',
    icon: ZomatoIcon
  },
  UBER: {
    name: 'Uber',
    icon: UberIcon
  },
  PROMETHEUS: {
    name: 'Prometheus',
    icon: PrometheusIcon
  },
  AWS_EKS: {
    name: 'AWS EKS',
    icon: AWSEKSIcon
  },
  LINUX: {
    name: 'Linux',
    icon: LinuxIcon
  },
  JENKINS: {
    name: 'Jenkins',
    icon: JenkinsIcon
  },
  KUBERNETES: {
    name: 'Kubernetes',
    icon: KubernetesIcon
  },
  DOCKER: {
    name: 'Docker',
    icon: DockerIcon
  },
  AZURE: {
    name: 'Azure',
    icon: AzureIcon
  },
  AWS: {
    name: 'AWS',
    icon: AWSIcon
  },
  TERRAFORM: {
    name: 'Terraform',
    icon: TerraformIcon
  },
  ANSIBLE: {
    name: 'Ansible',
    icon: AnsibleIcon
  },
  AZURE_DEVOPS: {
    name: 'Azure DevOps',
    icon: AzureDevOpsIcon
  },
  DEVOPS: {
    name: 'DevOps',
    icon: DevOpsIcon
  }
}

export const FEATURED_PROJECTS = [
  {
    category: 'Platform Engineering & IDP',
    items: [
      {
        title: 'Internal Developer Platform (IDP)',
        description: 'Self-service platform with Backstage, ArgoCD, and Kubernetes',
        url: 'https://github.com/NotHarshhaa'
      },
      {
        title: 'Kubernetes Master Reference',
        description: 'Production EKS/AKS cluster patterns and GitOps architecture',
        url: 'https://github.com/NotHarshhaa/Kubernetes'
      },
      {
        title: 'DevOps Monitoring in a Box',
        description: 'Zero-trust observability with Prometheus, Grafana, and Loki',
        url: 'https://github.com/NotHarshhaa'
      },
      {
        title: 'DevOps Tools Collection',
        description: 'Curated developer experience tooling and golden paths',
        url: 'https://github.com/NotHarshhaa/devops-tools'
      }
    ]
  },
  {
    category: 'DevOps & GitOps Automation',
    items: [
      {
        title: 'DevOps Real-Time Projects Hub',
        description: '40+ production CI/CD, Terraform, and Kubernetes deployments',
        url: 'https://github.com/NotHarshhaa/DevOps-Projects'
      },
      {
        title: 'AWS Real-Time Deployments',
        description: 'Terraform IaC with multi-tier VPC, EKS, and ALB architectures',
        url: 'https://github.com/NotHarshhaa/AWS-Projects'
      },
      {
        title: 'CI/CD Pipeline for AWS EKS',
        description: 'Automated GitHub Actions + Helm + ArgoCD release pipeline',
        url: 'https://github.com/NotHarshhaa/CI-CD_EKS-GitHub_Actions'
      },
      {
        title: 'Into the DevOps',
        description: 'Production architecture blueprints and interview master guide',
        url: 'https://github.com/NotHarshhaa/into-the-devops'
      }
    ]
  },
  {
    category: 'AI Infrastructure & LLMOps',
    items: [
      {
        title: 'AI Platform Engineering Handbook',
        description: 'GPU orchestration, Kubernetes inference, and vLLM serving',
        url: 'https://github.com/NotHarshhaa'
      },
      {
        title: 'LLMOps Production Pipeline',
        description: 'End-to-end model serving with vLLM, Ollama, and MLflow',
        url: 'https://github.com/NotHarshhaa'
      },
      {
        title: 'Vector Search & RAG Infrastructure',
        description: 'Low-latency retrieval with Qdrant, pgvector, and Milvus',
        url: 'https://github.com/NotHarshhaa'
      },
      {
        title: 'MLOps Project Generator',
        description: 'Scaffolding for reproducible ML and model registry workflows',
        url: 'https://github.com/NotHarshhaa'
      }
    ]
  },
  {
    category: 'GenAI, AI Agents & MCP',
    items: [
      {
        title: 'DevOps Model Context Protocol (MCP) Server',
        description: 'Exposing Kubernetes & cloud API tool calling to LLM agents',
        url: 'https://github.com/NotHarshhaa'
      },
      {
        title: 'DevOps Incident Response Agent',
        description: 'Autonomous AI agent troubleshooting cluster alerts via MCP',
        url: 'https://github.com/NotHarshhaa'
      },
      {
        title: 'Mainframe MCP Server',
        description: 'Bridging AI assistants with IBM z/OS enterprise workflows',
        url: 'https://github.com/NotHarshhaa'
      },
      {
        title: 'Multi-Agent Orchestration Engine',
        description: 'Agent2Agent (A2A) state machines powered by LangGraph',
        url: 'https://github.com/NotHarshhaa'
      }
    ]
  },
  {
    category: 'AI Product Development',
    items: [
      {
        title: 'Full-Stack Agentic AI Applications',
        description: 'Interactive AI web apps with Next.js AI SDK, FastAPI, and MCP',
        url: 'https://github.com/NotHarshhaa'
      },
      {
        title: 'Interactive Portfolio AI Assistant',
        description: 'In-browser agent with semantic intent resolution & system telemetry',
        url: 'https://github.com/NotHarshhaa'
      },
      {
        title: 'DevOps Project Generator CLI',
        description: 'Automated scaffolding generator for production platforms',
        url: 'https://github.com/NotHarshhaa'
      },
      {
        title: 'Ultimate DevOps & AI Documentation Portal',
        description: 'Knowledge portal serving 250,000+ engineers globally',
        url: 'https://docs.prodevopsguytech.com'
      }
    ]
  }
]

export const PROJECTS = [
  {
    title: ' Real-Time DevOps Projects Hub',
    tags: [TAGS.AWS, TAGS.TERRAFORM, TAGS.DOCKER, TAGS.KUBERNETES, TAGS.LINUX, TAGS.AZURE, TAGS.JENKINS, TAGS.DEVOPS],
    description: 'A dedicated website featuring real-time DevOps & Cloud projects, from beginner to production-level. Perfect to learn by doing whether its CICD, Kubernetes, Terraform, or monitoring tools, it’s all here!',
    link: {
      github: 'https://github.com/NotHarshhaa/projects.prodevopsguytech.com',
      preview: 'https://projects.prodevopsguytech.com'
    },
  },
  {
    title: 'Ultimate DevOps & Cloud Docs Portal',
    tags: [TAGS.AWS, TAGS.AZURE, TAGS.DEVOPS],
    description: 'Struggling to find high-quality learning content? Dive into our portal with 900+ handpicked resources, guides, and docs for AWS, Azure, and DevOps. Perfect for engineers at all levels! and everything you need in one place, accessible with a single click!',
    link: {
      github: 'https://gitlab.com/NotHarshhaa/docs-portal',
      preview: 'https://docs.prodevopsguytech.com'
    },
  },
  {
    title: 'DevOps Repositories Central Hub',
    tags: [TAGS.GITHUB, TAGS.DEVOPS],
    description: 'All the major repositories you’ll ever need — from automation scripts to infra as code to interview prep — curated and organized to help you learn, implement, and grow as a DevOps professional.',
    link: {
      github: 'https://github.com/NotHarshhaa/github-repo-status-tracker',
      preview: 'https://repos.prodevopsguytech.com',
    },
  },
  {
    title: 'AWS Terraform Workshop',
    tags: [TAGS.AWS, TAGS.TERRAFORM, TAGS.DEVOPS],
    description: 'Beginner-friendly guide to setting up AWS infrastructure using Terraform.',
    link: {
      github: 'https://github.com/NotHarshhaa/AWS-Terraform-Workshop',
    },
  },
  {
    title: 'ECR-ECS GitHub Deploy',
    tags: [TAGS.AWS, TAGS.TERRAFORM, TAGS.DOCKER, TAGS.GITHUB_ACTIONS],
    description: 'Automated deployment of a Python app to AWS ECS using GitHub Actions, Docker, and Terraform.',
    link: {
      github: 'https://github.com/NotHarshhaa/tf-ecr-ecs-gh-deploy',
    },
  },
  {
    title: 'EKS Cluster Terraform',
    tags: [TAGS.AWS_EKS, TAGS.TERRAFORM, TAGS.KUBERNETES],
    description: 'Terraform-based provisioning of an Amazon EKS Cluster for Kubernetes deployments.',
    link: {
      github: 'https://github.com/NotHarshhaa/eks-cluster-terraform',
    },
  },
  {
    title: 'CI/CD EKS with GitHub Actions',
    tags: [TAGS.KUBERNETES, TAGS.GITHUB_ACTIONS, TAGS.TERRAFORM, TAGS.AWS_EKS],
    description: 'CI/CD pipeline for deploying a Node.js app on Amazon EKS using GitHub Actions, Terraform, and Kubernetes.',
    link: {
      github: 'https://github.com/NotHarshhaa/CI-CD_EKS-GitHub_Actions',
    },
  },
  {
    title: 'DevOps Tools',
    tags: [TAGS.DEVOPS, TAGS.LINUX],
    description: 'Collection of essential DevOps tools for development, deployment, monitoring, security, and automation.',
    link: {
      github: 'https://github.com/NotHarshhaa/devops-tools',
    },
  },
  {
    title: 'Certified Kubernetes Administrator',
    tags: [TAGS.KUBERNETES],
    description: 'Master Kubernetes from scratch and prepare for the CKA certification.',
    link: {
      github: 'https://github.com/NotHarshhaa/Certified_Kubernetes_Administrator',
    },
  },
  {
    title: 'Kubernetes Dashboard',
    tags: [TAGS.KUBERNETES, TAGS.PROMETHEUS],
    description: 'Kubernetes dashboard with integrated health checks and Trivy scanning.',
    link: {
      github: 'https://github.com/NotHarshhaa/kubernetes-dashboard',
    },
  },
  {
    title: 'DevOps Projects Collection',
    tags: [TAGS.DEVOPS],
    description: 'Real-world DevOps projects from beginner to advanced levels.',
    link: {
      github: 'https://github.com/NotHarshhaa/DevOps-Projects',
    },
  },
  {
    title: 'Uber Clone (DevSecOps)',
    tags: [TAGS.UBER, TAGS.DEVOPS],
    description: 'Full-stack Uber-like transportation application with DevSecOps integration.',
    link: {
      github: 'https://github.com/NotHarshhaa/uber-clone',
    },
  },
  {
    title: 'Kubernetes Projects Learning',
    tags: [TAGS.KUBERNETES],
    description: 'Practical Kubernetes projects to master deployment, management, and scaling of containerized applications.',
    link: {
      github: 'https://github.com/NotHarshhaa/kubernetes-projects-learning',
    },
  },
  {
    title: 'AWS EKS Terraform',
    tags: [TAGS.AWS_EKS, TAGS.TERRAFORM],
    description: 'Provision Amazon EKS Cluster on AWS using Terraform.',
    link: {
      github: 'https://github.com/NotHarshhaa/AWS-EKS_Terraform',
    },
  },
  {
    title: 'Super Mario on Kubernetes',
    tags: [TAGS.KUBERNETES, TAGS.TERRAFORM, TAGS.AWS_EKS],
    description: 'Deploy Super Mario game on Amazon EKS using Terraform.',
    link: {
      github: 'https://github.com/NotHarshhaa/Deployment-of-super-Mario-on-Kubernetes-using-terraform',
    },
  },
  {
    title: 'Cloud Native Monitoring App',
    tags: [TAGS.DOCKER, TAGS.AWS_EKS],
    description: 'Monitoring app built with Python, containerized with Docker, and deployed to EKS.',
    link: {
      github: 'https://github.com/NotHarshhaa/cloud-native-monitoring-app',
    },
  },
  {
    title: 'Zomato Clone (DevSecOps)',
    tags: [TAGS.ZOMATO, TAGS.DEVOPS],
    description: 'Full-stack food delivery app inspired by Zomato with DevSecOps integration.',
    link: {
      github: 'https://github.com/NotHarshhaa/Zomato-Clone',
    },
  },
  {
    title: 'Learning Prometheus',
    tags: [TAGS.PROMETHEUS, TAGS.KUBERNETES],
    description: 'Repository for learning and implementing Prometheus monitoring in Kubernetes environments.',
    link: {
      github: 'https://github.com/NotHarshhaa/Learning-Prometheus',
    },
  },
  {
    title: 'All Things Kubernetes',
    tags: [TAGS.KUBERNETES],
    description: 'Comprehensive Kubernetes learning and deployment repository from basic to advanced.',
    link: {
      github: 'https://github.com/NotHarshhaa/Kubernetes',
    },
  },
  {
    title: 'DevOps Setup Installations',
    tags: [TAGS.DEVOPS, TAGS.LINUX],
    description: 'Guides for installing and setting up essential DevOps and DevSecOps tools.',
    link: {
      github: 'https://github.com/NotHarshhaa/DevOps_Setup-Installations',
    },
  },
  {
    title: 'DevOps Tool Installer',
    tags: [TAGS.LINUX, TAGS.DEVOPS],
    description: 'Automated installation/uninstallation scripts for essential DevOps tools on Linux and Windows.',
    link: {
      github: 'https://github.com/NotHarshhaa/DevOps-Tool-Installer',
    },
  },
  {
    title: 'Kubernetes Learning Path',
    tags: [TAGS.KUBERNETES],
    description: 'Step-by-step Kubernetes learning path from beginner to advanced.',
    link: {
      github: 'https://github.com/NotHarshhaa/kubernetes-learning-path',
    },
  },
  {
    title: 'Jenkins Terraform AWS Infra',
    tags: [TAGS.JENKINS, TAGS.TERRAFORM, TAGS.AWS],
    description: 'Terraform scripts for AWS infrastructure provisioning with Jenkins integration.',
    link: {
      github: 'https://github.com/NotHarshhaa/Jenkins-Terraform-AWS-Infra',
    },
  },
  {
    title: 'Azure All-in-One',
    tags: [TAGS.AZURE],
    description: 'Curated list of Azure resources, libraries, guides, and blogs.',
    link: {
      github: 'https://github.com/NotHarshhaa/azure-all_in_one',
    },
  },
  {
    title: 'AWS Billing Alert Terraform',
    tags: [TAGS.AWS, TAGS.TERRAFORM],
    description: 'Terraform module for setting up AWS billing alerts.',
    link: {
      github: 'https://github.com/NotHarshhaa/aws-billing-alert-terraform',
    },
  },
  {
    title: 'AWS DevOps Real-Time Deployment',
    tags: [TAGS.AWS, TAGS.DEVOPS],
    description: 'End-to-end AWS DevOps deployment pipeline from Dev to Production.',
    link: {
      github: 'https://github.com/NotHarshhaa/AWS-DevOps_Real-Time_Deployment',
    },
  },
  {
    title: 'DevOps Cheatsheet',
    tags: [TAGS.DEVOPS],
    description: 'Quick-reference DevOps cheatsheets covering CI/CD, cloud, security, monitoring, and automation.',
    link: {
      github: 'https://github.com/NotHarshhaa/devops-cheatsheet',
    },
  },
  {
    title: 'DevOps Interview Questions',
    tags: [TAGS.DEVOPS],
    description: '550+ DevOps interview questions with detailed answers covering CI/CD, Kubernetes, Terraform, and cloud.',
    link: {
      github: 'https://github.com/NotHarshhaa/DevOps-Interview-Questions',
    },
  },
  {
    title: 'Into the DevOps',
    tags: [TAGS.DEVOPS, TAGS.LINUX, TAGS.KUBERNETES, TAGS.AWS, TAGS.TERRAFORM],
    description: 'Comprehensive DevOps interview guide covering Linux, AWS, Kubernetes, Terraform, Docker, and more.',
    link: {
      github: 'https://github.com/NotHarshhaa/into-the-devops',
    },
  }
]
