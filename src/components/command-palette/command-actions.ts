import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {
  Compass,
  Terminal,
  FileText,
  Send,
  Layers,
  Bot,
  Activity,
  Sun,
  Moon,
  Copy,
  Check,
  Github,
  Linkedin,
  Globe
} from 'lucide-react'
import type { CommandItem } from './types'

interface BuildCommandsOptions {
  router: AppRouterInstance
  theme?: string
  setTheme: (theme: string) => void
  setIsOpen: (isOpen: boolean) => void
  copiedEmail: boolean
  copyEmail: () => void
}

export function buildCommands({
  router,
  theme,
  setTheme,
  setIsOpen,
  copiedEmail,
  copyEmail
}: BuildCommandsOptions): CommandItem[] {
  return [
    // Navigation
    {
      id: 'nav-home',
      title: 'Home',
      description: 'Go to personal overview & specialties',
      category: 'Navigation',
      icon: Compass,
      shortcut: 'G H',
      action: () => {
        setIsOpen(false)
        router.push('/')
      }
    },
    {
      id: 'nav-projects',
      title: 'Projects',
      description: 'Explore open source platforms, tools & guides',
      category: 'Navigation',
      icon: Terminal,
      shortcut: 'G P',
      action: () => {
        setIsOpen(false)
        router.push('/projects')
      }
    },
    {
      id: 'nav-career',
      title: 'Career Timeline',
      description: 'View work history, experience & achievements',
      category: 'Navigation',
      icon: FileText,
      shortcut: 'G C',
      action: () => {
        setIsOpen(false)
        router.push('/career')
      }
    },
    {
      id: 'nav-contact',
      title: 'Contact',
      description: 'Send direct message or book technical consultation',
      category: 'Navigation',
      icon: Send,
      shortcut: 'G T',
      action: () => {
        setIsOpen(false)
        router.push('/contact')
      }
    },

    // Platform Actions
    {
      id: 'act-architecture',
      title: 'System Architecture Diagrams',
      description: 'Explore interactive blueprints for AI, GitOps & Cloud',
      category: 'Platform Actions',
      icon: Layers,
      action: () => {
        setIsOpen(false)
        router.push('/#architectures')
      }
    },
    {
      id: 'act-agent',
      title: "Ask Harshhaa's Agent",
      description: 'Open conversational AI portfolio assistant',
      category: 'Platform Actions',
      icon: Bot,
      action: () => {
        setIsOpen(false)
        const agentBtn = document.querySelector(
          'button[aria-label="Ask Harshhaa\'s Agent"]'
        ) as HTMLButtonElement
        if (agentBtn) agentBtn.click()
      }
    },
    {
      id: 'act-telemetry',
      title: 'Inspect Platform Telemetry',
      description: 'View real-time cluster health, latency & edge routing',
      category: 'Platform Actions',
      icon: Activity,
      action: () => {
        setIsOpen(false)
        const telBtn = document.querySelector(
          'button[aria-label="Inspect Platform Telemetry & Healthcheck"]'
        ) as HTMLButtonElement
        if (telBtn) telBtn.click()
      }
    },
    {
      id: 'act-theme',
      title: 'Toggle Theme',
      description: `Switch between dark and light appearance (Current: ${theme})`,
      category: 'Platform Actions',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }
    },
    {
      id: 'act-copy-email',
      title: copiedEmail ? 'Email Copied!' : 'Copy Email Address',
      description: 'harshhaa03@gmail.com',
      category: 'Platform Actions',
      icon: copiedEmail ? Check : Copy,
      action: copyEmail
    },

    // External
    {
      id: 'ext-github',
      title: 'GitHub Profile',
      description: 'github.com/NotHarshhaa',
      category: 'External',
      icon: Github,
      action: () => {
        window.open('https://github.com/NotHarshhaa', '_blank', 'noopener,noreferrer')
      }
    },
    {
      id: 'ext-linkedin',
      title: 'LinkedIn Profile',
      description: 'linkedin.com/in/harshhaa-vardhan-reddy',
      category: 'External',
      icon: Linkedin,
      action: () => {
        window.open('https://linkedin.com/in/harshhaa-vardhan-reddy', '_blank', 'noopener,noreferrer')
      }
    },
    {
      id: 'ext-blog',
      title: 'Engineering Blog',
      description: 'blog.harshhaareddy.com',
      category: 'External',
      icon: Globe,
      action: () => {
        window.open('https://blog.harshhaareddy.com', '_blank', 'noopener,noreferrer')
      }
    },
    {
      id: 'ext-telegram',
      title: 'Telegram Channel',
      description: 't.me/prodevopsguy',
      category: 'External',
      icon: Send,
      action: () => {
        window.open('https://t.me/prodevopsguy', '_blank', 'noopener,noreferrer')
      }
    }
  ]
}
