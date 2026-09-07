/**
 * Decorates the hero block for Adobe Experience Manager Edge Delivery Services.
 *
 * The hero model has three fields — image, imageAlt (collapsed into the image
 * cell as the alt attribute), and text — so the authored block has two rows:
 *
 * | Hero    |
 * | <image> |
 * | <text>  |
 *
 * An image chosen from AEM Assets can render as a link to the delivery URL
 * rather than a ready-made <picture>; in that case build an <img> from it so
 * the image shows instead of the link text.
 *
 * @param {HTMLElement} block The block element.
 */
export default function decorate(block) {
  const imageCell = block.querySelector(':scope > div > div');
  if (!imageCell) return;

  const hasPicture = imageCell.querySelector('picture, img');
  if (!hasPicture) {
    const assetLink = imageCell.querySelector('a');
    if (assetLink) {
      const img = document.createElement('img');
      img.src = assetLink.href;
      img.alt = assetLink.title || '';
      img.loading = 'eager';
      assetLink.replaceWith(img);
    }
  }
}
