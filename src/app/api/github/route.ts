import { NextResponse } from 'next/server'

const GITHUB_USERNAME = 'NotHarshhaa'
const GITHUB_API_BASE = 'https://api.github.com'

// Cache for repositories and user profile to avoid repeated API calls
let repoCache: any[] | null = null
let userCache: any | null = {
  login: GITHUB_USERNAME,
  followers: 3579,
  public_repos: 105
}
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function GET() {
  try {
    const now = Date.now()
    if (repoCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return NextResponse.json({ 
        repositories: repoCache,
        user: userCache,
        cached: true,
        timestamp: cacheTimestamp
      })
    }

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-Website',
      ...(process.env.GITHUB_TOKEN
        ? { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` }
        : {})
    }

    // Fetch both repositories and user profile in parallel
    const [reposResponse, userResponse] = await Promise.all([
      fetch(
        `${GITHUB_API_BASE}/search/repositories?q=user:${GITHUB_USERNAME}+fork:true&sort=updated&per_page=100`,
        { headers, next: { revalidate: 300 } }
      ),
      fetch(
        `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`,
        { headers, next: { revalidate: 300 } }
      )
    ])

    if (!reposResponse.ok) {
      throw new Error(`GitHub repos API error: ${reposResponse.status}`)
    }

    const reposData = await reposResponse.json()
    
    // Filter out archived and disabled repos, sort by stars
    const filteredRepos = reposData.items
      .filter((repo: any) => !repo.archived && !repo.disabled && !repo.private)
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)

    // Update user cache if user profile fetch succeeded
    if (userResponse.ok) {
      const userData = await userResponse.json()
      userCache = {
        login: userData.login,
        name: userData.name,
        followers: userData.followers,
        public_repos: userData.public_repos,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url
      }
    }

    // Update cache
    repoCache = filteredRepos
    cacheTimestamp = now

    return NextResponse.json({ 
      repositories: filteredRepos,
      user: userCache,
      cached: false,
      timestamp: cacheTimestamp,
      total: reposData.total_count
    })

  } catch (error) {
    console.error('Error fetching GitHub data:', error)
    
    // Return cached data if available, otherwise error
    if (repoCache) {
      return NextResponse.json({ 
        repositories: repoCache,
        user: userCache,
        cached: true,
        timestamp: cacheTimestamp,
        error: 'Using cached data due to API error'
      })
    }

    return NextResponse.json(
      { 
        error: 'Failed to fetch GitHub data',
        user: userCache 
      },
      { status: 500 }
    )
  }
}
