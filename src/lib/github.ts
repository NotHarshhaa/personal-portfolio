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

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics: string[]
  stargazers_count: number
  forks_count: number
  created_at: string
  updated_at: string
  pushed_at: string
  size: number
  open_issues_count: number
  default_branch: string
  archived: boolean
  disabled: boolean
  private: boolean
  fork: boolean
}

interface GitHubRepoResponse {
  items: GitHubRepo[]
  total_count: number
}

const GITHUB_USERNAME = 'NotHarshhaa'
const GITHUB_API_BASE = 'https://api.github.com'

// Cache for repositories to avoid repeated API calls
let repoCache: GitHubRepo[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  // Check cache first
  const now = Date.now()
  if (repoCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return repoCache
  }

  try {
    // Fetch from our API route instead of direct GitHub API
    const response = await fetch('/api/github', {
      next: {
        revalidate: 300 // Revalidate every 5 minutes
      }
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Update cache
    repoCache = data.repositories
    cacheTimestamp = now

    return data.repositories
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error)
    // Return cached data if available, otherwise empty array
    return repoCache || []
  }
}

export function mapGitHubToProject(repo: GitHubRepo) {
  // Map topics to existing tags
  const topicToTagMap: Record<string, string> = {
    'aws': 'AWS',
    'azure': 'Azure', 
    'kubernetes': 'Kubernetes',
    'k8s': 'Kubernetes',
    'docker': 'Docker',
    'terraform': 'Terraform',
    'jenkins': 'Jenkins',
    'github-actions': 'GitHub Actions',
    'prometheus': 'Prometheus',
    'linux': 'Linux',
    'ansible': 'Ansible',
    'devops': 'DevOps',
    'devsecops': 'DevOps',
    'eks': 'AWS EKS',
    'ec2': 'AWS',
    's3': 'AWS',
    'cloud': 'DevOps',
    'monitoring': 'Prometheus',
    'cicd': 'GitHub Actions',
    'python': 'DevOps',
    'nodejs': 'DevOps',
    'react': 'DevOps',
    'nextjs': 'DevOps',
    'typescript': 'DevOps'
  }

  // Extract tags from topics
  const tags = repo.topics
    .map(topic => topicToTagMap[topic.toLowerCase()])
    .filter((tag): tag is string => tag !== undefined) // Type guard to filter out undefined
    .filter((tag, index, arr) => arr.indexOf(tag) === index) // Remove duplicates
    .slice(0, 5) // Limit to 5 tags

  // If no tags found, add default based on language or name
  if (tags.length === 0) {
    if (repo.language) {
      tags.push(repo.language)
    } else {
      tags.push('DevOps')
    }
  }

  return {
    title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: repo.description || `A ${repo.language || 'software'} project with ${repo.stargazers_count} stars and ${repo.forks_count} forks.`,
    tags: tags.map(tagName => ({
      name: tagName,
      icon: getTagIcon(tagName)
    })),
    link: {
      github: repo.html_url,
      preview: repo.homepage || undefined
    },
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    updatedAt: repo.updated_at
  }
}

function getTagIcon(tagName: string) {
  // Import icons dynamically to avoid circular dependencies
  const iconMap: Record<string, any> = {
    'AWS': AWSIcon,
    'Azure': AzureIcon,
    'Kubernetes': KubernetesIcon,
    'Docker': DockerIcon,
    'Terraform': TerraformIcon,
    'Jenkins': JenkinsIcon,
    'GitHub Actions': GitHubActionsIcon,
    'Prometheus': PrometheusIcon,
    'Linux': LinuxIcon,
    'Ansible': AnsibleIcon,
    'DevOps': DevOpsIcon,
    'AWS EKS': AWSEKSIcon,
    'Azure DevOps': AzureDevOpsIcon,
    'GitHub': GitHubIcon
  }

  return iconMap[tagName] || iconMap['DevOps']
}

export async function getAllProjects() {
  try {
    // Fetch GitHub repositories
    const githubRepos = await fetchGitHubRepos()
    
    // Map to project format
    const githubProjects = githubRepos.map(mapGitHubToProject)
    
    // Get existing manual projects
    const { PROJECTS } = await import('@/data')
    
    // Combine both, with GitHub repos first
    return [...githubProjects, ...PROJECTS]
  } catch (error) {
    console.error('Error getting all projects:', error)
    // Fallback to manual projects only
    const { PROJECTS } = await import('@/data')
    return PROJECTS
  }
}
