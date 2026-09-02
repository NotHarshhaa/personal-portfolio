export interface NodeCodeSnippet {
  filename: string
  language: string
  code: string
}

export interface ArchitectureNode {
  id: string
  label: string
  category: string
  protocol: string
  tech: string[]
  description: string
  specs: {
    layer: string
    scaling: string
    security: string
    observability: string
  }
  codeSnippet?: NodeCodeSnippet
  x: number // percentage 0-100
  y: number // percentage 0-100
}

export interface TraceStep {
  step: number
  title: string
  fromNodeId?: string
  toNodeId?: string
  activeNodeId: string
  action: string
  narrative: string
}

export interface ArchitectureEdge {
  from: string
  to: string
  label?: string
  protocol: string
  type?: 'sync' | 'async' | 'event'
}

export interface ArchitectureSystem {
  id: string
  title: string
  badge: string
  subtitle: string
  description: string
  nodes: ArchitectureNode[]
  edges: ArchitectureEdge[]
  traceSteps: TraceStep[]
}
