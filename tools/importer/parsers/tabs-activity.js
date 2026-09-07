/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: tabs-activity
 * Base block: tabs (container)
 * Source: https://wknd-adventures.com (.tab-container.tab-container--wide)
 * Generated: 2026-09-07
 *
 * Library structure: 2 columns, row 1 = block name, each subsequent row = one tab.
 *   Cell 1: tab label            → field:title
 *   Cell 2: tab content group    → field:content_heading, field:content_image, field:content_richtext
 * Item model (tabs-activity-item): title, content_heading, content_headingType (collapsed → heading tag),
 *   content_image (reference), content_richtext (richtext).
 * Source: tab labels in .tab-menu button; content panes in .tab-pane (aligned by order).
 */
export default function parse(element, { document }) {
  // Tab labels — validated: .tab-menu .tab-menu-link
  const labels = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu button'));
  // Content panes — validated: .tab-pane
  const panes = Array.from(element.querySelectorAll('.tab-pane, [class*="tab-pane"]'));

  // Empty-block guard
  if (labels.length === 0 && panes.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  const count = Math.max(labels.length, panes.length);

  for (let i = 0; i < count; i += 1) {
    const label = labels[i];
    const pane = panes[i];

    // Cell 1: tab label (field:title)
    const titleCell = document.createDocumentFragment();
    titleCell.appendChild(document.createComment(' field:title '));
    titleCell.appendChild(document.createTextNode(label ? label.textContent.trim() : ''));

    // Cell 2: content group
    const contentCell = document.createDocumentFragment();

    if (pane) {
      // The pane content is a grid of article cards. There is no distinct pane-level
      // heading or single hero image — each card carries its own image, tag, heading
      // and description. Put the whole card grid into content_richtext to avoid
      // duplicating the first card's heading/image into content_heading/content_image.
      const richParts = [];
      const cards = Array.from(pane.querySelectorAll('a.article-card, a[class*="card"]'));
      if (cards.length) {
        cards.forEach((card) => {
          const cardImg = card.querySelector('img');
          const cardTag = card.querySelector('.article-card-meta .tag, .tag');
          const cardHeading = card.querySelector('h2, h3, h4, h5, h6');
          const cardDesc = card.querySelector('.utility-text-secondary, p[class*="paragraph"], p');
          const href = card.getAttribute('href') || '';
          // Preserve each card's image (and its alt text)
          if (cardImg) richParts.push(cardImg.cloneNode(true));
          // Preserve the card heading, wrapped in a link to the article
          if (cardHeading) {
            const a = document.createElement('a');
            a.setAttribute('href', href);
            a.textContent = cardHeading.textContent.trim();
            const h = document.createElement(cardHeading.tagName.toLowerCase());
            h.appendChild(a);
            richParts.push(h);
          }
          // Preserve tag + description
          if (cardTag && cardTag.textContent.trim()) {
            const tp = document.createElement('p');
            tp.textContent = cardTag.textContent.trim();
            richParts.push(tp);
          }
          if (cardDesc && cardDesc.textContent.trim()) {
            const dp = document.createElement('p');
            dp.textContent = cardDesc.textContent.trim();
            richParts.push(dp);
          }
        });
      } else {
        // Fallback: any headings, images and paragraphs in the pane
        Array.from(pane.querySelectorAll('h2, h3, h4, h5, h6, img, p')).forEach((n) => richParts.push(n.cloneNode(true)));
      }

      if (richParts.length) {
        contentCell.appendChild(document.createComment(' field:content_richtext '));
        richParts.forEach((n) => contentCell.appendChild(n));
      }
    }

    cells.push([titleCell, contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-activity', cells });
  element.replaceWith(block);
}
