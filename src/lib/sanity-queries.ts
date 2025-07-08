import { client } from "./sanity"

// Get all services
export async function getServices() {
  return client.fetch(`
    *[_type == "service"] | order(title asc) {
      _id,
      title,
      slug,
      category,
      excerpt,
      mainImage,
      features
    }
  `)
}

// Get service by slug
export async function getService(slug: string) {
  return client.fetch(
    `
    *[_type == "service" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      category,
      excerpt,
      mainImage,
      gallery,
      features,
      specifications,
      body,
      seo
    }
  `,
    { slug }
  )
}

// Get all projects
export async function getProjects() {
  return client.fetch(`
    *[_type == "project"] | order(completedDate desc) {
      _id,
      title,
      slug,
      client,
      location,
      completedDate,
      category,
      excerpt,
      mainImage,
      featured
    }
  `)
}

// Get project by slug
export async function getProject(slug: string) {
  return client.fetch(
    `
    *[_type == "project" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      client,
      location,
      completedDate,
      category,
      excerpt,
      mainImage,
      gallery,
      body
    }
  `,
    { slug }
  )
}

// Get all posts
export async function getPosts() {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      author->{name, image},
      mainImage,
      categories[]->{title},
      publishedAt,
      excerpt
    }
  `)
}

// Get post by slug
export async function getPost(slug: string) {
  return client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      author->{name, image, bio},
      mainImage,
      categories[]->{title},
      publishedAt,
      excerpt,
      body
    }
  `,
    { slug }
  )
}

// Get site settings
export async function getSiteSettings() {
  return client.fetch(`
    *[_type == "siteSettings"][0] {
      title,
      description,
      logo,
      contactInfo,
      socialMedia
    }
  `)
}

// Get testimonials
export async function getTestimonials() {
  return client.fetch(`
    *[_type == "testimonial"] | order(featured desc, _createdAt desc) {
      _id,
      name,
      company,
      position,
      image,
      testimonial,
      rating,
      featured
    }
  `)
}
