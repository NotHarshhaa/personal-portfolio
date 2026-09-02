import {
  Globe,
  Compass,
  Bot,
  Terminal,
  Cpu,
  Database,
  GitBranch,
  Workflow,
  Shield,
  Network,
  Server,
  Activity,
  Layers,
  type LucideIcon
} from 'lucide-react'
import type { ArchitectureNode } from '@/data/architectures'

export function getCategoryIcon(category: string): LucideIcon {
  const cat = category.toLowerCase()
  if (cat.includes('ingress') || cat.includes('presentation')) return Globe
  if (cat.includes('routing') || cat.includes('gateway')) return Compass
  if (cat.includes('agent') || cat.includes('core')) return Bot
  if (cat.includes('tool') || cat.includes('binding')) return Terminal
  if (cat.includes('inference') || cat.includes('llm')) return Cpu
  if (cat.includes('retrieval') || cat.includes('rag') || cat.includes('storage') || cat.includes('vector')) return Database
  if (cat.includes('source') || cat.includes('git')) return GitBranch
  if (cat.includes('automation') || cat.includes('ci')) return Workflow
  if (cat.includes('security') || cat.includes('secrets')) return Shield
  if (cat.includes('network')) return Network
  if (cat.includes('compute')) return Server
  if (cat.includes('monitoring') || cat.includes('observability')) return Activity
  return Layers
}

export function getNodePos(node: ArchitectureNode) {
  return {
    cx: (node.x / 100) * 1000,
    cy: (node.y / 100) * 480
  }
}
