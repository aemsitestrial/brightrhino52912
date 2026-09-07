export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  // Photo-gallery variant: when every cell in every row is an image-only
  // column, treat the block as an image grid (e.g. "In the Field").
  // Scoped so standard image + text columns are never affected.
  const allImageCols = [...block.children].every((row) => {
    const cells = [...row.children];
    return cells.length > 0 && cells.every((col) => {
      const text = col.textContent.trim();
      return col.querySelector('picture, img') && text === '';
    });
  });
  if (allImageCols) {
    block.classList.add('columns-images');
  }
}
