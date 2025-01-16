import { defineCollection, z } from 'astro:content';

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    features: z.array(z.object({
      title: z.string(),
      description: z.string()
    })).optional(),
    services: z.array(z.object({
      title: z.string(),
      description: z.string().optional(),
      features: z.array(z.string()),
      price: z.string().optional()
    })).optional(),
    process: z.array(z.object({
      step: z.string(),
      title: z.string(),
      description: z.string()
    })).optional(),
    benefits: z.array(z.object({
      title: z.string(),
      description: z.string()
    })).optional(),
    steps: z.array(z.object({
      day: z.string(),
      title: z.string(),
      description: z.string()
    })).optional(),
    target: z.array(z.object({
      item: z.string()
    })).optional(),
    expertise: z.array(z.object({
      title: z.string(),
      items: z.array(z.string())
    })).optional(),
    principles: z.array(z.object({
      title: z.string(),
      description: z.string()
    })).optional(),
    quote: z.string().optional(),
    toolCategories: z.array(z.object({
      title: z.string(),
      description: z.string(),
      tools: z.array(z.object({
        name: z.string(),
        description: z.string(),
        features: z.array(z.string())
      }))
    })).optional()
  })
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string(),
    image: z.string().optional(),
    category: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  })
});

export const collections = {
  'pages': pages,
  'blog': blog
};
