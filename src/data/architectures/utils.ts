import type { ArchitectureSystem } from './types'

export function generateMermaidDiagram(arch: ArchitectureSystem): string {
  let mermaid = `%% Architecture Blueprint: ${arch.title}\n`
  mermaid += `graph LR\n`
  mermaid += `  %% Nodes Definition\n`
  arch.nodes.forEach((node) => {
    mermaid += `  ${node.id}["<b>${node.label}</b><br/><i>${node.category} • ${node.protocol}</i>"]\n`
  })
  mermaid += `\n  %% Edge Connections\n`
  arch.edges.forEach((edge) => {
    const label = edge.label ? `|"${edge.label} (${edge.protocol})"|` : ''
    mermaid += `  ${edge.from} -->${label} ${edge.to}\n`
  })
  return mermaid
}
