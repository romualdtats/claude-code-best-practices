import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
  // it assigns a URL to your pages
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});

// For proper i18n support, we use separate sources for different languages
// This approach is more aligned with Fumadocs standards and Next.js App Router
export const sourceZh = loader({
  baseUrl: '/docs/zh',
  source: docs.toFumadocsSource(),
});
