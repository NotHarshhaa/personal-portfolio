interface StructuredDataProps {
  type: 'Person' | 'WebSite' | 'Organization'
  data: Record<string, unknown>
}

export function generateStructuredData({ type, data }: StructuredDataProps) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  }

  return baseSchema
}

export function getPersonSchema() {
  return generateStructuredData({
    type: 'Person',
    data: {
      name: 'Harshhaa Vardhan Reddy',
      jobTitle: 'Platform Engineer',
      url: 'https://harshhaareddy.site',
      sameAs: [
        'https://github.com/NotHarshhaa',
        'https://linkedin.com/in/harshhaa-vardhan-reddy',
        'https://t.me/prodevopsguy',
        'https://blog.harshhaareddy.site'
      ],
      email: 'harshhaa03@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Hyderabad',
        addressCountry: 'IN'
      },
      knowsAbout: [
        'Platform Engineering',
        'AI Infrastructure',
        'Agentic Systems',
        'DevOps',
        'MLOps',
        'LLMOps',
        'Model Context Protocol',
        'Kubernetes',
        'AWS',
        'Azure',
        'Internal Developer Platforms'
      ]
    }
  })
}

export function getWebSiteSchema() {
  return generateStructuredData({
    type: 'WebSite',
    data: {
      name: 'HARSHHAA Portfolio',
      url: 'https://harshhaareddy.site',
      description:
        'Platform Engineer building cloud platforms, AI infrastructure, and agentic systems.',
      publisher: {
        '@type': 'Person',
        name: 'Harshhaa Vardhan Reddy'
      }
    }
  })
}

export function getOrganizationSchema() {
  return generateStructuredData({
    type: 'Organization',
    data: {
      name: 'HARSHHAA Portfolio',
      url: 'https://harshhaareddy.site',
      logo: 'https://harshhaareddy.site/logo.svg',
      sameAs: [
        'https://github.com/NotHarshhaa',
        'https://linkedin.com/in/harshhaa-vardhan-reddy'
      ]
    }
  })
}
