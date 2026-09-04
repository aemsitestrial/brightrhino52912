/**
 * Decorates the introduction block for Adobe Experience Manager Edge Delivery Services.
 *
 * Expected authoring structure:
 *
 * | Introduction |
 * | Heading      | Welcome to our site |
 * | Description  | ...                  |
 * | CTA          | Learn more | /about   |
 *
 * The block also works with a single-column authored layout.
 *
 * @param {HTMLElement} block The block element.
 */
const INTRODUCTION_LABEL = 'Introduction';
const HEADING_ID = 'introduction-heading';

export default function decorate(block) {
	block.setAttribute('role', 'region');
	block.setAttribute('aria-label', INTRODUCTION_LABEL);

	const rows = [...block.children];
	rows.forEach((row) => {
		row.classList.add('introduction-row');

		const [label, content] = row.children;
		if (label && content) {
			label.classList.add('introduction-label');
			content.classList.add('introduction-content');
		}
	});

	const heading = block.querySelector('h1, h2, h3');
	if (heading) {
		heading.classList.add('introduction-heading');
		if (!heading.id) heading.id = HEADING_ID;
		block.setAttribute('aria-labelledby', heading.id);
	}

	block.querySelectorAll('a').forEach((link) => {
		link.classList.add('introduction-cta');
	});
}
