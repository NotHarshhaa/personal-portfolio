import { getPersonSchema, getWebSiteSchema, getOrganizationSchema } from '@/lib/structured-data'

export function StructuredData() {
  const personSchema = getPersonSchema()
  const websiteSchema = getWebSiteSchema()
  const organizationSchema = getOrganizationSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  )
}

