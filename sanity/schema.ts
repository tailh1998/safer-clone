import type { SchemaTypeDefinition } from "sanity"

import author from "./schemas/author"
import blockContent from "./schemas/blockContent"
import category from "./schemas/category"
import page from "./schemas/page"
import post from "./schemas/post"
import project from "./schemas/project"
import service from "./schemas/service"
import siteSettings from "./schemas/siteSettings"
import testimonial from "./schemas/testimonial"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, author, category, blockContent, page, service, project, testimonial, siteSettings]
}
