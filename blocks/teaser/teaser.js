/**
 * Decorates the teaser block for Adobe Experience Manager Edge Delivery Services.
 *
 * A teaser (featured article) previews content with an image beside a content
 * column: eyebrow tag, title, short description, and a single call-to-action
 * link.
 *
 * Universal Editor collapses suffix fields (imageAlt into the image cell,
 * linkText into the link cell), so the authored block has five rows, in order:
 *
 * | Teaser      |
 * | <image>     |
 * | Eyebrow     |
 * | Title       |
 * | Description |
 * | <cta link>  |
 *
 * @param {HTMLElement} block The block element.
 */
export default function decorate(block) {
  block.setAttribute('role', 'region');

  const [imageRow, eyebrowRow, titleRow, descriptionRow, linkRow] = [...block.children];

  block.textContent = '';

  // Media — the image cell contains a <picture> (or a bare <img>); the alt
  // text authored via imageAlt is already applied to the <img> by the editor.
  let image = imageRow?.querySelector('picture') || imageRow?.querySelector('img');
  if (!image) {
    // An AEM asset reference can render as a link to the delivery URL rather
    // than a ready-made <picture>; build an <img> from it in that case.
    const assetLink = imageRow?.querySelector('a');
    if (assetLink) {
      const img = document.createElement('img');
      img.src = assetLink.href;
      img.alt = assetLink.title || '';
      img.loading = 'lazy';
      image = img;
    }
  }
  if (image) {
    const media = document.createElement('div');
    media.className = 'teaser-image';
    media.append(image);
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

  // CTA — the collapsed link cell renders as an anchor; restyle it and wrap it
  // in a row so it can be laid out as a divider-topped action bar.
  const link = linkRow?.querySelector('a');
  if (link) {
    link.className = 'button teaser-cta';

    const ctaRow = document.createElement('div');
    ctaRow.className = 'teaser-cta-row';
    ctaRow.append(link);
    content.append(ctaRow);
  }

  block.append(content);
}
