import { NextResponse } from 'next/server'

const GITHUB_USERNAME = 'NotHarshhaa'
const GITHUB_API_BASE = 'https://api.github.com'

// Cache for repositories to avoid repeated API calls
let repoCache: any[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function GET() {
  try {
    // Check cache first
    const now = Date.now()
    if (repoCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return NextResponse.json({ 
        repositories: repoCache,
        cached: true,
        timestamp: cacheTimestamp
      })
    }

    // Fetch all repositories for the user
    const response = await fetch(
      `${GITHUB_API_BASE}/search/repositories?q=user:${GITHUB_USERNAME}+fork:true&sort=updated&per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-Website',
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN || ''}`
        },
        next: {
          revalidate: 300 // Revalidate every 5 minutes
        }
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Filter out archived and disabled repos, sort by stars
    const filteredRepos = data.items
      .filter((repo: any) => !repo.archived && !repo.disabled && !repo.private)
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)

    // Update cache
    repoCache = filteredRepos
    cacheTimestamp = now

    return NextResponse.json({ 
      repositories: filteredRepos,
      cached: false,
      timestamp: cacheTimestamp,
      total: data.total_count
    })

  } catch (error) {
    console.error('Error fetching GitHub repositories:', error)
    
    // Return cached data if available, otherwise error
    if (repoCache) {
      return NextResponse.json({ 
        repositories: repoCache,
        cached: true,
        timestamp: cacheTimestamp,
        error: 'Using cached data due to API error'
      })
    }

    return NextResponse.json(
      { error: 'Failed to fetch GitHub repositories' },
      { status: 500 }
    )
  }
}
