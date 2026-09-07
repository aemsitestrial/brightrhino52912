// eslint-disable-next-line import/no-unresolved
import { moveInstrumentation } from '../../scripts/scripts.js';

// keep track globally of the number of tab blocks on the page
let tabBlockCnt = 0;

/**
 * Group the flat panel content (picture, h3, tag, description repeated) into
 * article cards laid out in a grid. Each card is:
 *   picture -> h3 (title) -> p (tag/eyebrow) -> p (description)
 */
function buildCards(panel) {
  // the content lives in the remaining cell of the row (title cell is removed later)
  const contentCell = panel.querySelector(':scope > div') || panel;
  const nodes = [...contentCell.children];
  if (!nodes.length) return;

  const grid = document.createElement('ul');
  grid.className = 'tabs-activity-cards';

  let card = null;
  let body = null;

  const startCard = () => {
    card = document.createElement('li');
    card.className = 'tabs-activity-card';
    body = null;
    grid.append(card);
  };

  const ensureBody = () => {
    if (!body) {
      body = document.createElement('div');
      body.className = 'tabs-activity-card-body';
      card.append(body);
    }
    return body;
  };

  nodes.forEach((node) => {
    const picture = node.tagName === 'PICTURE'
      ? node
      : node.querySelector && node.querySelector('picture');

    if (picture) {
      // image begins a new card
      startCard();
      const imgWrap = document.createElement('div');
      imgWrap.className = 'tabs-activity-card-image';
      imgWrap.append(picture);
      card.append(imgWrap);
      return;
    }

    if (!card) startCard();

    if (node.tagName === 'H3') {
      ensureBody().append(node);
    } else if (node.tagName === 'P') {
      // first paragraph in the card is the tag/eyebrow, the rest are description
      const b = ensureBody();
      if (!b.querySelector('.tabs-activity-tag')) {
        // the tag/eyebrow pill sits above the title
        node.classList.add('tabs-activity-tag');
        b.prepend(node);
      } else {
        node.classList.add('tabs-activity-desc');
        b.append(node);
      }
    } else {
      ensureBody().append(node);
    }
  });

  contentCell.replaceWith(grid);
}

export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-activity-list';
  tablist.setAttribute('role', 'tablist');
  tablist.id = `tablist-${tabBlockCnt += 1}`;

  // the first cell of each row is the title of the tab
  const tabHeadings = [...block.children]
    .filter((child) => child.firstElementChild && child.firstElementChild.children.length > 0)
    .map((child) => child.firstElementChild);

  tabHeadings.forEach((tab, i) => {
    const id = `tabpanel-${tabBlockCnt}-tab-${i + 1}`;

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-activity-panel';
    tabpanel.id = id;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-activity-tab';
    button.id = `tab-${id}`;

    button.innerHTML = tab.innerHTML;

    button.setAttribute('aria-controls', id);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');

    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    // add the new tab list button, to the tablist
    tablist.append(button);

    // remove the tab heading from the dom, which also removes it from the UE tree
    tab.remove();

    // remove the instrumentation from the button's h1, h2 etc (this removes it from the tree)
    if (button.firstElementChild) {
      moveInstrumentation(button.firstElementChild, null);
    }

    // restructure the flat panel content into a grid of article cards
    buildCards(tabpanel);
  });

  block.prepend(tablist);
}
