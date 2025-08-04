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

// Single docs configuration that supports multiple languages
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: customFrontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
