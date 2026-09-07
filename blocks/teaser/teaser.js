/**
 * Decorates the teaser block for Adobe Experience Manager Edge Delivery Services.
 *
 * A teaser previews content with an image, optional eyebrow, title, short
 * description, and a call-to-action link. Authored rows map, in order, to:
 * image, alt text, eyebrow, title, description, CTA link, CTA text.
 *
 * @param {HTMLElement} block The block element.
 */
export default function decorate(block) {
  block.setAttribute('role', 'region');

  const rows = [...block.children];
  const [
    imageRow,
    altRow,
    eyebrowRow,
    titleRow,
    descriptionRow,
    ctaLinkRow,
    ctaTextRow,
  ] = rows;

  block.textContent = '';

  // Media
  const picture = imageRow?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const alt = altRow?.textContent.trim();
    if (img && alt) img.alt = alt;

    const media = document.createElement('div');
    media.className = 'teaser-image';
    media.append(picture);
    block.append(media);
  }

  // Content
  const content = document.createElement('div');
  content.className = 'teaser-content';

  const eyebrow = eyebrowRow?.textContent.trim();
  if (eyebrow) {
    const el = document.createElement('p');
    el.className = 'teaser-eyebrow';
    el.textContent = eyebrow;
    content.append(el);
  }

  const title = titleRow?.textContent.trim();
  if (title) {
    const heading = document.createElement('h3');
    heading.className = 'teaser-title';
    heading.textContent = title;
    content.append(heading);
  }

  const description = descriptionRow?.querySelector('p') || descriptionRow;
  if (description && description.textContent.trim()) {
    description.classList.add('teaser-description');
    content.append(description);
  }

  const ctaText = ctaTextRow?.textContent.trim();
  const ctaLink = ctaLinkRow?.querySelector('a')?.href
    || ctaLinkRow?.textContent.trim();
  if (ctaText && ctaLink) {
    const cta = document.createElement('a');
    cta.className = 'teaser-cta';
    cta.href = ctaLink;
    cta.textContent = ctaText;
    content.append(cta);
  }

  block.append(content);
}
