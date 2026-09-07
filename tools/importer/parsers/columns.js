/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns
 * Base block: columns
 * Source: https://wknd-adventures.com (.grid-layout.desktop-3-column.grid-images)
 * Generated: 2026-09-07
 *
 * Library structure: multiple columns, row 1 = block name, row 2 = one cell per column.
 * NOTE: Columns blocks do NOT use field hints (per hinting rules). Default content only.
 * Source: 3 gallery images side by side → 3 columns in a single content row.
 */
export default function parse(element, { document }) {
  // Validated selector: direct child gallery images
  let items = Array.from(element.querySelectorAll(':scope > img.gallery-img, :scope > img'));

  // Fallback: any images if none matched as direct children
  if (items.length === 0) {
    items = Array.from(element.querySelectorAll('img'));
  }

  // Empty-block guard
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // One row with one cell per column (no field hints for columns block)
  const cells = [items.map((img) => img)];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
