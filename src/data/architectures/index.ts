import type { ArchitectureSystem } from './types'
import { AGENTIC_MCP_SYSTEM } from './systems/agentic-mcp'
import { GITOPS_K8S_SYSTEM } from './systems/gitops-k8s'
import { CLOUD_IAC_SYSTEM } from './systems/cloud-iac'

export * from './types'
export * from './utils'
export { AGENTIC_MCP_SYSTEM, GITOPS_K8S_SYSTEM, CLOUD_IAC_SYSTEM }

export const ARCHITECTURES: ArchitectureSystem[] = [
  AGENTIC_MCP_SYSTEM,
  GITOPS_K8S_SYSTEM,
  CLOUD_IAC_SYSTEM
]
