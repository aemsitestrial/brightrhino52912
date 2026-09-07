/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import teaserParser from './parsers/teaser.js';
import tabsActivityParser from './parsers/tabs-activity.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import columnsParser from './parsers/columns.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-adventures-cleanup.js';
import sectionsTransformer from './transformers/wknd-adventures-sections.js';

// PARSER REGISTRY
const parsers = {
  hero: heroParser,
  teaser: teaserParser,
  'tabs-activity': tabsActivityParser,
  'accordion-faq': accordionFaqParser,
  columns: columnsParser,
};

// TRANSFORMER REGISTRY
// Order matters: cleanup first (removes chrome, normalizes image URLs),
// then sections (inserts section breaks + section-metadata).
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'WKND Adventures homepage',
  urls: [
    'https://wknd-adventures.com',
  ],
  blocks: [
    { name: 'hero', instances: ['.hero-section.hero-section--full'] },
    { name: 'section-featured', instances: ['#main-content > section.section.secondary-section:nth-of-type(2)'], section: 'secondary' },
    { name: 'teaser', instances: ['.featured-article'] },
    { name: 'tabs-activity', instances: ['.tab-container.tab-container--wide'] },
    { name: 'section-ticker', instances: ['#main-content > div.ticker-strip'], section: 'ticker' },
    { name: 'section-start-here', instances: ['#main-content > section.section.inverse-section:nth-of-type(4)'], section: 'inverse' },
    { name: 'accordion-faq', instances: ['.faq-list'] },
    { name: 'section-how-we-work', instances: ['#main-content > section.section.secondary-section:nth-of-type(6)'], section: 'secondary' },
    { name: 'section-in-the-field', instances: ['#main-content > section.section.inverse-section:nth-of-type(7)'], section: 'inverse' },
    { name: 'columns', instances: ['.grid-layout.desktop-3-column.grid-images'] },
    { name: 'section-closing-cta', instances: ['#main-content > section.section.accent-section'], section: 'accent' },
  ],
};

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root/homepage URL to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
