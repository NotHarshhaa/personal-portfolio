import type { ArchitectureSystem } from './types'
import { GITOPS_K8S_SYSTEM } from './systems/gitops-k8s'
import { AGENTIC_MCP_SYSTEM } from './systems/agentic-mcp'
import { LLMOPS_PIPELINE_SYSTEM } from './systems/llmops-pipeline'
import { CLOUD_IAC_SYSTEM } from './systems/cloud-iac'

export * from './types'
export * from './utils'
export {
  GITOPS_K8S_SYSTEM,
  AGENTIC_MCP_SYSTEM,
  LLMOPS_PIPELINE_SYSTEM,
  CLOUD_IAC_SYSTEM
}

export const ARCHITECTURES: ArchitectureSystem[] = [
  GITOPS_K8S_SYSTEM,
  AGENTIC_MCP_SYSTEM,
  LLMOPS_PIPELINE_SYSTEM,
  CLOUD_IAC_SYSTEM
]
