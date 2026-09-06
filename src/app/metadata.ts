import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Harshhaa | Platform Engineer • DevOps • AI Infrastructure & AI Product Development',
  description:
    'Building scalable developer platforms, production AI infrastructure, autonomous AI agents, MCP ecosystems, and AI products. Platform Engineering, DevOps, LLMOps, Kubernetes, Terraform, and GitOps.',
  keywords: [
    'Platform Engineer',
    'DevOps',
    'AI Infrastructure',
    'GenAI',
    'AI Agents',
    'Model Context Protocol',
    'MCP',
    'LLMOps',
    'AI Product Development',
    'Kubernetes',
    'Internal Developer Platform',
    'IDP',
    'ArgoCD',
    'Terraform',
    'vLLM',
    'LangGraph',
    'AWS',
    'Azure',
    'Portfolio'
  ],
  authors: [{ name: 'Harshhaa Vardhan Reddy' }],
  creator: 'Harshhaa Vardhan Reddy',
  publisher: 'Harshhaa Vardhan Reddy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  metadataBase: new URL('https://harshhaareddy.com'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Harshhaa | Platform Engineer • DevOps • AI Infrastructure & AI Product Development',
    description:
      'Building scalable developer platforms, production AI infrastructure, autonomous AI agents, MCP ecosystems, and AI products.',
    url: 'https://harshhaareddy.com',
    siteName: 'HARSHHAA Portfolio',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'HARSHHAA Portfolio'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harshhaa | Platform Engineer • DevOps • AI Infrastructure & AI Product Development',
    description:
      'Building scalable developer platforms, production AI infrastructure, autonomous AI agents, MCP ecosystems, and AI products.',
    images: ['/opengraph-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}
