/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero
 * Base block: hero
 * Source: https://wknd-adventures.com (.hero-section.hero-section--full)
 * Generated: 2026-09-07
 *
 * Library structure: 1 column, 3 rows.
 *   Row 1: block name
 *   Row 2: background image (field:image)
 *   Row 3: text — title, subheading, CTA (field:text)
 * Model fields: image (reference), imageAlt (collapsed → img alt), text (richtext)
 */
export default function parse(element, { document }) {
  // Background image (optional) — validated: .hero-bg img
  const bgImage = element.querySelector('.hero-bg img, img[class*="hero-bg"], .hero-section img');

  // Text content container — validated: .hero-content-inner
  const contentRoot = element.querySelector('.hero-content-inner, .hero-content, .container');

  // Text elements: eyebrow/tag, heading, lead, CTA buttons
  const textNodes = [];
  if (contentRoot) {
    const tag = contentRoot.querySelector('.tag, p.tag');
    const heading = contentRoot.querySelector('h1, h2, [class*="heading"]');
    const lead = contentRoot.querySelector('.hero-lead, p.paragraph-xl, p:not(.tag)');
    const ctas = Array.from(contentRoot.querySelectorAll('.button-group a, a.accent-button, a.button--ghost, a[class*="button"]'));
    if (tag) textNodes.push(tag);
    if (heading) textNodes.push(heading);
    if (lead && lead !== tag) textNodes.push(lead);
    ctas.forEach((a) => textNodes.push(a));
  }

  // Empty-block guard
  if (!bgImage && textNodes.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (field:image)
  if (bgImage) {
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(bgImage);
    cells.push([imageCell]);
  }

  // Row 3: text (field:text)
  if (textNodes.length) {
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    textNodes.forEach((n) => textCell.appendChild(n));
    cells.push([textCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
