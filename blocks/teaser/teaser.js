/**
 * Decorates the teaser block for Adobe Experience Manager Edge Delivery Services.
 *
 * A teaser previews content with an image, optional eyebrow, title, short
 * description, and a call-to-action link.
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
  const image = imageRow?.querySelector('picture') || imageRow?.querySelector('img');
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

  // CTA — the collapsed link cell already renders as an anchor whose text is
  // the authored linkText; just restyle it.
  const cta = linkRow?.querySelector('a');
  if (cta) {
    cta.className = 'teaser-cta';
    content.append(cta);
  }

  block.append(content);
}
