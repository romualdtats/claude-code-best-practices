import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';

// Define custom schema with language support
const customFrontmatterSchema = frontmatterSchema.extend({
  // Add language field for content
  lang: z.enum(['en', 'zh']).optional(),
});

// English documentation
export const docsEn = defineDocs({
  dir: 'content/docs/en',
  docs: {
    schema: customFrontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

// Chinese documentation
export const docsZh = defineDocs({
  dir: 'content/docs/zh',
  docs: {
    schema: customFrontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

// Keep the original for backward compatibility (defaults to English)
export const docs = docsEn;

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
