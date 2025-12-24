import type { Metadata } from 'next'

interface StructuredDataProps {
  type: 'Person' | 'WebSite' | 'Organization'
  data: Record<string, any>
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
      jobTitle: 'DevOps Engineer',
      url: 'https://notharshhaa.site',
      sameAs: [
        'https://github.com/NotHarshhaa',
        'https://linkedin.com/in/harshhaa-vardhan-reddy',
        'https://t.me/notharshhaa'
      ],
      email: 'harshhaa03@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Hyderabad',
        addressCountry: 'IN'
      },
      knowsAbout: [
        'DevOps',
        'Cloud Computing',
        'AWS',
        'Azure',
        'Kubernetes',
        'Terraform',
        'Docker',
        'CI/CD',
        'Infrastructure as Code'
      ]
    }
  })
}

export function getWebSiteSchema() {
  return generateStructuredData({
    type: 'WebSite',
    data: {
      name: 'HARSHHAA Portfolio',
      url: 'https://notharshhaa.site',
      description: 'DevOps Engineer focused on automation, scalability, and cloud infrastructure',
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
      url: 'https://notharshhaa.site',
      logo: 'https://notharshhaa.site/logo.svg',
      sameAs: [
        'https://github.com/NotHarshhaa',
        'https://linkedin.com/in/harshhaa-vardhan-reddy'
      ]
    }
  })
}

