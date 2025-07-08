import { createClient } from "@sanity/client"

export const client = createClient({
  projectId: "your-project-id",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-05-03"
})

// Schemas for Sanity Studio
export const schemas = {
  page: {
    name: "page",
    title: "Page",
    type: "document",
    fields: [
      {
        name: "title",
        title: "Title",
        type: "string"
      },
      {
        name: "slug",
        title: "Slug",
        type: "slug",
        options: {
          source: "title",
          maxLength: 96
        }
      },
      {
        name: "content",
        title: "Content",
        type: "array",
        of: [{ type: "block" }]
      },
      {
        name: "seo",
        title: "SEO",
        type: "object",
        fields: [
          {
            name: "metaTitle",
            title: "Meta Title",
            type: "string"
          },
          {
            name: "metaDescription",
            title: "Meta Description",
            type: "text"
          }
        ]
      }
    ]
  },
  service: {
    name: "service",
    title: "Service",
    type: "document",
    fields: [
      {
        name: "title",
        title: "Title",
        type: "string"
      },
      {
        name: "description",
        title: "Description",
        type: "text"
      },
      {
        name: "image",
        title: "Image",
        type: "image",
        options: {
          hotspot: true
        }
      },
      {
        name: "features",
        title: "Features",
        type: "array",
        of: [{ type: "string" }]
      }
    ]
  },
  project: {
    name: "project",
    title: "Project",
    type: "document",
    fields: [
      {
        name: "title",
        title: "Title",
        type: "string"
      },
      {
        name: "description",
        title: "Description",
        type: "text"
      },
      {
        name: "images",
        title: "Images",
        type: "array",
        of: [{ type: "image" }]
      },
      {
        name: "category",
        title: "Category",
        type: "string",
        options: {
          list: [
            { title: "Pallet Racking", value: "pallet-racking" },
            { title: "Mezzanine", value: "mezzanine" },
            { title: "Automation", value: "automation" },
            { title: "Shelving", value: "shelving" }
          ]
        }
      }
    ]
  }
}
