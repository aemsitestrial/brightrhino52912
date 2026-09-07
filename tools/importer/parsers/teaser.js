/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: teaser
 * Base block: teaser (custom — no library convention; structure inferred from model + source)
 * Source: https://wknd-adventures.com (.featured-article)
 * Generated: 2026-09-07
 *
 * Model fields (simple block → 1 column, one row per field/group):
 *   image (reference) + imageAlt (collapsed → img alt)  → 1 row (field:image)
 *   eyebrow (text)                                       → 1 row (field:eyebrow)
 *   title (text)                                         → 1 row (field:title)
 *   description (richtext)                               → 1 row (field:description)
 *   link (aem-content) + linkText (collapsed → anchor)   → 1 row (field:link)
 */
export default function parse(element, { document }) {
  // Image — validated: .featured-article-image img
  const image = element.querySelector('.featured-article-image img, img');

  // Eyebrow — validated: .tag
  const eyebrow = element.querySelector('.tag, p.tag, [class*="eyebrow"]');

  // Title — validated: h2.h2-heading
  const title = element.querySelector('h2, h1, h3, [class*="heading"]');

  // Description — validated: p.paragraph-lg (exclude the tag/eyebrow paragraph)
  const description = element.querySelector('.utility-text-secondary, p.paragraph-lg, [class*="description"]');

  // CTA link — validated: .featured-article-footer a
  const cta = element.querySelector('.featured-article-footer a, a.button, a[class*="button"]');

  // Empty-block guard
  if (!image && !title && !description) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row: image (field:image)
  if (image) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:image '));
    frag.appendChild(image);
    cells.push([frag]);
  }

  // Row: eyebrow (field:eyebrow)
  if (eyebrow) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:eyebrow '));
    frag.appendChild(eyebrow);
    cells.push([frag]);
  }

  // Row: title (field:title)
  if (title) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:title '));
    frag.appendChild(title);
    cells.push([frag]);
  }

  // Row: description (field:description)
  if (description && description !== eyebrow) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:description '));
    frag.appendChild(description);
    cells.push([frag]);
  }

  // Row: CTA link (field:link) — linkText collapses into the anchor text
  if (cta) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:link '));
    frag.appendChild(cta);
    cells.push([frag]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'teaser', cells });
  element.replaceWith(block);
}
