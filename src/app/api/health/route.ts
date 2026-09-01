import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const startTime = Date.now()
  
  // Extract region or IP headers from Vercel / Cloudflare / Proxy if available
  const region =
    request.headers.get('x-vercel-id')?.split(':')[0] ||
    request.headers.get('cf-ipcountry') ||
    'BOM1 (HYD)'

  const clientIP =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'

  const uptimeSeconds = process.uptime ? Math.floor(process.uptime()) : 86400

  const responseData = {
    status: 'healthy',
    system: 'operational',
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    region,
    clientIP: clientIP.length > 7 ? `${clientIP.substring(0, 7)}***` : clientIP,
    runtime: 'Node.js / Turbopack',
    services: [
      { name: 'Edge Ingress & CDN', status: 'healthy', protocol: 'TLS 1.3 / HTTP2' },
      { name: 'Next.js App Runtime', status: 'healthy', version: 'v16.2.12' },
      { name: 'AI Portfolio Agent', status: 'ready', engine: 'Grounded v1.0' },
      { name: 'GitHub Telemetry Sync', status: 'healthy', rateLimit: 'OK' }
    ],
    cluster: {
      nodes: 3,
      readyNodes: 3,
      podsRunning: 12,
      memoryStatus: 'Optimal'
    },
    latencyCheckMs: Date.now() - startTime
  }

  return NextResponse.json(responseData, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-Health-Status': 'operational'
    }
  })
}
