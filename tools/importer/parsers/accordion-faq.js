/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: accordion-faq
 * Base block: accordion (container)
 * Source: https://wknd-adventures.com (.faq-list)
 * Generated: 2026-09-07
 *
 * Library structure: 2 columns, row 1 = block name, each subsequent row = one accordion item.
 *   Cell 1 (title): the clickable label   → field:summary
 *   Cell 2 (content): the answer body      → field:text
 * Item model (accordion-faq-item): summary (text), text (richtext).
 */
export default function parse(element, { document }) {
  // Validated selector: each accordion item
  const items = Array.from(element.querySelectorAll(':scope > .faq-item, .faq-item'));

  // Empty-block guard
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  items.forEach((item) => {
    // Title — validated: .faq-question span text (first span holds the label)
    const questionBtn = item.querySelector('.faq-question, button');
    let summaryText = '';
    if (questionBtn) {
      const labelSpan = questionBtn.querySelector('span:not(.faq-icon)');
      summaryText = (labelSpan ? labelSpan.textContent : questionBtn.textContent).trim();
    }

    // Content — validated: .faq-answer
    const answer = item.querySelector('.faq-answer, [class*="answer"]');

    // Title cell (field:summary)
    const titleCell = document.createDocumentFragment();
    titleCell.appendChild(document.createComment(' field:summary '));
    titleCell.appendChild(document.createTextNode(summaryText));

    // Content cell (field:text) — wrap plain text in a <p> to preserve richtext semantics
    const contentCell = document.createDocumentFragment();
    contentCell.appendChild(document.createComment(' field:text '));
    if (answer) {
      const p = document.createElement('p');
      p.innerHTML = answer.innerHTML;
      contentCell.appendChild(p);
    }

    cells.push([titleCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
