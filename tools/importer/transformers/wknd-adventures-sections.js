/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Adventures section breaks + section metadata.
 *
 * The home page imports as a single merged section. This transformer splits the
 * page into distinct EDS sections (separated by <hr>) and attaches a
 * "Section Metadata" block carrying a Style key to each section that maps to a
 * design style (secondary / inverse / accent / ticker). styles/styles.css
 * defines those section style classes.
 *
 * Ordered section list is derived from the DOM-verified selectors in
 * tools/importer/page-templates.json (blocks[].section) and the top-level
 * children of #main-content in migration-work/cleaned.html. The <img> passed to
 * transformers here is the import root (body), NOT <main> — navbar and footer
 * are siblings of <main> — so selectors are anchored with `#main-content > ...`.
 *
 * Why both hooks / marker pattern: every styled section element below is itself
 * a parser target (the section-* blocks). Parsers run between beforeTransform
 * and afterTransform and call element.replaceWith(block), so a styled section
 * element no longer exists by afterTransform. We insert the <hr> boundaries in
 * beforeTransform (while every section still exists), marking the styled ones,
 * then anchor the Section Metadata blocks to those surviving marker <hr>s in
 * afterTransform. Iterate in reverse so inserts never disturb not-yet-processed
 * sections' :nth-of-type selectors.
 */

const SECTION_MARKER_ATTR = 'data-excat-section-id';

/**
 * Ordered top-level sections of the home page (matches #main-content children).
 * `style` omitted => plain white/default section (no Section Metadata emitted).
 */
const SECTIONS = [
  // Hero — full bleed, no style. First section: no leading break, no metadata.
  { id: 'hero', selector: '#main-content > section.hero-section.hero-section--full' },
  // Featured / teaser article.
  { id: 'section-featured', selector: '#main-content > section.section.secondary-section:nth-of-type(2)', style: 'secondary' },
  // Browse by Activity tabs — default/white.
  { id: 'section-browse', selector: '#main-content > section.section:nth-of-type(3)' },
  // Ticker strip (a <div>, not a <section>).
  { id: 'section-ticker', selector: '#main-content > div.ticker-strip', style: 'ticker' },
  // Not sure where to start.
  { id: 'section-start-here', selector: '#main-content > section.section.inverse-section:nth-of-type(4)', style: 'inverse' },
  // Quick Answers FAQ — default/white.
  { id: 'section-faq', selector: '#main-content > section.section:nth-of-type(5)' },
  // How We Work.
  { id: 'section-how-we-work', selector: '#main-content > section.section.secondary-section:nth-of-type(6)', style: 'secondary' },
  // In the Field gallery.
  { id: 'section-in-the-field', selector: '#main-content > section.section.inverse-section:nth-of-type(7)', style: 'inverse' },
  // Closing CTA.
  { id: 'section-closing-cta', selector: '#main-content > section.section.accent-section', style: 'accent' },
];

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Insert section boundaries now, before parsers can replace any section
    // element. A bare <hr> is inserted before every non-first section (styled
    // and white alike) so each becomes its own EDS section and styled sections
    // never bleed into the white ones. Styled sections' <hr>s carry a marker so
    // afterTransform can anchor their metadata even after a parser replaced the
    // original section element.
    for (let i = SECTIONS.length - 1; i >= 0; i -= 1) {
      const section = SECTIONS[i];
      // First section (hero) gets no leading break and no metadata.
      if (i === 0) continue;

      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue; // selector didn't match — skip, never guess

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    // Parsers have now run and may have replaced styled section elements. Anchor
    // each styled section's Section Metadata block to its surviving marker <hr>
    // (falling back to the original element if it still exists).
    for (let i = SECTIONS.length - 1; i >= 0; i -= 1) {
      const section = SECTIONS[i];
      if (!section.style) continue; // white/default sections carry no metadata

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || element.querySelector(section.selector);
      if (!anchor) continue; // neither survived — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { Style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) marker.removeAttribute(SECTION_MARKER_ATTR);
    }
  }
}
