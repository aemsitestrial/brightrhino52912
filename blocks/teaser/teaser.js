/**
 * Decorates the teaser block for Adobe Experience Manager Edge Delivery Services.
 *
 * A teaser (featured article) previews content with an image beside a content
 * column: eyebrow tag, title, short description, and a single call-to-action
 * link. The authored rows map, in order, to: image, eyebrow, title,
 * description, link.
 *
 * @param {HTMLElement} block The block element.
 */
export default function decorate(block) {
  block.setAttribute('role', 'region');

  const rows = [...block.children];
  const [imageRow, eyebrowRow, titleRow, descriptionRow, linkRow] = rows;

  block.textContent = '';

  // Media
  const picture = imageRow?.querySelector('picture');
  if (picture) {
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
    const heading = titleRow.querySelector('h1, h2, h3, h4, h5, h6')
      || document.createElement('h2');
    heading.classList.add('teaser-title');
    if (!heading.textContent.trim()) heading.textContent = title;
    content.append(heading);
  }

  const description = descriptionRow?.querySelector('p') || descriptionRow;
  if (description && description.textContent.trim()) {
    description.classList.add('teaser-description');
    content.append(description);
  }

  const link = linkRow?.querySelector('a');
  if (link) {
    const cta = document.createElement('a');
    cta.className = 'button teaser-cta';
    cta.href = link.href;
    cta.textContent = link.textContent.trim();

    const ctaRow = document.createElement('div');
    ctaRow.className = 'teaser-cta-row';
    ctaRow.append(cta);
    content.append(ctaRow);
  }

  block.append(content);
}
