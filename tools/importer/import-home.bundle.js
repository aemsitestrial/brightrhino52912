/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document: document2 }) {
    const bgImage = element.querySelector('.hero-bg img, img[class*="hero-bg"], .hero-section img');
    const contentRoot = element.querySelector(".hero-content-inner, .hero-content, .container");
    const textNodes = [];
    if (contentRoot) {
      const tag = contentRoot.querySelector(".tag, p.tag");
      const heading = contentRoot.querySelector('h1, h2, [class*="heading"]');
      const lead = contentRoot.querySelector(".hero-lead, p.paragraph-xl, p:not(.tag)");
      const ctas = Array.from(contentRoot.querySelectorAll('.button-group a, a.accent-button, a.button--ghost, a[class*="button"]'));
      if (tag) textNodes.push(tag);
      if (heading) textNodes.push(heading);
      if (lead && lead !== tag) textNodes.push(lead);
      ctas.forEach((a) => textNodes.push(a));
    }
    if (!bgImage && textNodes.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      const imageCell = document2.createDocumentFragment();
      imageCell.appendChild(document2.createComment(" field:image "));
      imageCell.appendChild(bgImage);
      cells.push([imageCell]);
    }
    if (textNodes.length) {
      const textCell = document2.createDocumentFragment();
      textCell.appendChild(document2.createComment(" field:text "));
      textNodes.forEach((n) => textCell.appendChild(n));
      cells.push([textCell]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/teaser.js
  function parse2(element, { document: document2 }) {
    const image = element.querySelector(".featured-article-image img, img");
    const eyebrow = element.querySelector('.tag, p.tag, [class*="eyebrow"]');
    const title = element.querySelector('h2, h1, h3, [class*="heading"]');
    const description = element.querySelector('.utility-text-secondary, p.paragraph-lg, [class*="description"]');
    const cta = element.querySelector('.featured-article-footer a, a.button, a[class*="button"]');
    if (!image && !title && !description) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(" field:image "));
      frag.appendChild(image);
      cells.push([frag]);
    }
    if (eyebrow) {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(" field:eyebrow "));
      frag.appendChild(eyebrow);
      cells.push([frag]);
    }
    if (title) {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(" field:title "));
      frag.appendChild(title);
      cells.push([frag]);
    }
    if (description && description !== eyebrow) {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(" field:description "));
      frag.appendChild(description);
      cells.push([frag]);
    }
    if (cta) {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(" field:link "));
      frag.appendChild(cta);
      cells.push([frag]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "teaser", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-activity.js
  function parse3(element, { document: document2 }) {
    const labels = Array.from(element.querySelectorAll(".tab-menu .tab-menu-link, .tab-menu button"));
    const panes = Array.from(element.querySelectorAll('.tab-pane, [class*="tab-pane"]'));
    if (labels.length === 0 && panes.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const count = Math.max(labels.length, panes.length);
    for (let i = 0; i < count; i += 1) {
      const label = labels[i];
      const pane = panes[i];
      const titleCell = document2.createDocumentFragment();
      titleCell.appendChild(document2.createComment(" field:title "));
      titleCell.appendChild(document2.createTextNode(label ? label.textContent.trim() : ""));
      const contentCell = document2.createDocumentFragment();
      if (pane) {
        const richParts = [];
        const cards = Array.from(pane.querySelectorAll('a.article-card, a[class*="card"]'));
        if (cards.length) {
          cards.forEach((card) => {
            const cardImg = card.querySelector("img");
            const cardTag = card.querySelector(".article-card-meta .tag, .tag");
            const cardHeading = card.querySelector("h2, h3, h4, h5, h6");
            const cardDesc = card.querySelector('.utility-text-secondary, p[class*="paragraph"], p');
            const href = card.getAttribute("href") || "";
            if (cardImg) richParts.push(cardImg.cloneNode(true));
            if (cardHeading) {
              const a = document2.createElement("a");
              a.setAttribute("href", href);
              a.textContent = cardHeading.textContent.trim();
              const h = document2.createElement(cardHeading.tagName.toLowerCase());
              h.appendChild(a);
              richParts.push(h);
            }
            if (cardTag && cardTag.textContent.trim()) {
              const tp = document2.createElement("p");
              tp.textContent = cardTag.textContent.trim();
              richParts.push(tp);
            }
            if (cardDesc && cardDesc.textContent.trim()) {
              const dp = document2.createElement("p");
              dp.textContent = cardDesc.textContent.trim();
              richParts.push(dp);
            }
          });
        } else {
          Array.from(pane.querySelectorAll("h2, h3, h4, h5, h6, img, p")).forEach((n) => richParts.push(n.cloneNode(true)));
        }
        if (richParts.length) {
          contentCell.appendChild(document2.createComment(" field:content_richtext "));
          richParts.forEach((n) => contentCell.appendChild(n));
        }
      }
      cells.push([titleCell, contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-activity", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse4(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(":scope > .faq-item, .faq-item"));
    if (items.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const questionBtn = item.querySelector(".faq-question, button");
      let summaryText = "";
      if (questionBtn) {
        const labelSpan = questionBtn.querySelector("span:not(.faq-icon)");
        summaryText = (labelSpan ? labelSpan.textContent : questionBtn.textContent).trim();
      }
      const answer = item.querySelector('.faq-answer, [class*="answer"]');
      const titleCell = document2.createDocumentFragment();
      titleCell.appendChild(document2.createComment(" field:summary "));
      titleCell.appendChild(document2.createTextNode(summaryText));
      const contentCell = document2.createDocumentFragment();
      contentCell.appendChild(document2.createComment(" field:text "));
      if (answer) {
        const p = document2.createElement("p");
        p.innerHTML = answer.innerHTML;
        contentCell.appendChild(p);
      }
      cells.push([titleCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse5(element, { document: document2 }) {
    let items = Array.from(element.querySelectorAll(":scope > img.gallery-img, :scope > img"));
    if (items.length === 0) {
      items = Array.from(element.querySelectorAll("img"));
    }
    if (items.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [items.map((img) => img)];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-adventures-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function getBaseUrl(payload) {
    const candidates = [
      payload && payload.originalURL,
      payload && payload.url
    ];
    for (let i = 0; i < candidates.length; i += 1) {
      const c = candidates[i];
      if (c) {
        try {
          return new URL(c).href;
        } catch (e) {
        }
      }
    }
    return "https://wknd-adventures.com/";
  }
  function toAbsolute(value, baseUrl) {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^(data:|https?:\/\/|\/\/)/i.test(trimmed)) return null;
    try {
      return new URL(trimmed, baseUrl).href;
    } catch (e) {
      return null;
    }
  }
  function normalizeSrcset(srcset, baseUrl) {
    return srcset.split(",").map((part) => {
      const segment = part.trim();
      if (!segment) return null;
      const spaceIdx = segment.search(/\s/);
      const url = spaceIdx === -1 ? segment : segment.slice(0, spaceIdx);
      const descriptor = spaceIdx === -1 ? "" : segment.slice(spaceIdx).trim();
      const abs = toAbsolute(url, baseUrl);
      const finalUrl = abs || url;
      return descriptor ? `${finalUrl} ${descriptor}` : finalUrl;
    }).filter(Boolean).join(", ");
  }
  function normalizeImageUrls(element, payload) {
    const baseUrl = getBaseUrl(payload);
    element.querySelectorAll("img, source").forEach((el) => {
      const src = el.getAttribute("src");
      const absSrc = toAbsolute(src, baseUrl);
      if (absSrc) el.setAttribute("src", absSrc);
      const srcset = el.getAttribute("srcset");
      if (srcset && srcset.trim()) {
        el.setAttribute("srcset", normalizeSrcset(srcset, baseUrl));
      }
    });
  }
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      normalizeImageUrls(element, payload);
      WebImporter.DOMUtils.remove(element, ["a.skip-link"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "div.navbar",
        "footer.footer"
      ]);
    }
  }

  // tools/importer/transformers/wknd-adventures-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  var SECTIONS = [
    // Hero — full bleed, no style. First section: no leading break, no metadata.
    { id: "hero", selector: "#main-content > section.hero-section.hero-section--full" },
    // Featured / teaser article.
    { id: "section-featured", selector: "#main-content > section.section.secondary-section:nth-of-type(2)", style: "secondary" },
    // Browse by Activity tabs — default/white.
    { id: "section-browse", selector: "#main-content > section.section:nth-of-type(3)" },
    // Ticker strip (a <div>, not a <section>).
    { id: "section-ticker", selector: "#main-content > div.ticker-strip", style: "ticker" },
    // Not sure where to start.
    { id: "section-start-here", selector: "#main-content > section.section.inverse-section:nth-of-type(4)", style: "inverse" },
    // Quick Answers FAQ — default/white.
    { id: "section-faq", selector: "#main-content > section.section:nth-of-type(5)" },
    // How We Work.
    { id: "section-how-we-work", selector: "#main-content > section.section.secondary-section:nth-of-type(6)", style: "secondary" },
    // In the Field gallery.
    { id: "section-in-the-field", selector: "#main-content > section.section.inverse-section:nth-of-type(7)", style: "inverse" },
    // Closing CTA.
    { id: "section-closing-cta", selector: "#main-content > section.section.accent-section", style: "accent" }
  ];
  function transform2(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      for (let i = SECTIONS.length - 1; i >= 0; i -= 1) {
        const section = SECTIONS[i];
        if (i === 0) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = SECTIONS.length - 1; i >= 0; i -= 1) {
        const section = SECTIONS[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { Style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) marker.removeAttribute(SECTION_MARKER_ATTR);
      }
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    hero: parse,
    teaser: parse2,
    "tabs-activity": parse3,
    "accordion-faq": parse4,
    columns: parse5
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "home",
    description: "WKND Adventures homepage",
    urls: [
      "https://wknd-adventures.com"
    ],
    blocks: [
      { name: "hero", instances: [".hero-section.hero-section--full"] },
      { name: "section-featured", instances: ["#main-content > section.section.secondary-section:nth-of-type(2)"], section: "secondary" },
      { name: "teaser", instances: [".featured-article"] },
      { name: "tabs-activity", instances: [".tab-container.tab-container--wide"] },
      { name: "section-ticker", instances: ["#main-content > div.ticker-strip"], section: "ticker" },
      { name: "section-start-here", instances: ["#main-content > section.section.inverse-section:nth-of-type(4)"], section: "inverse" },
      { name: "accordion-faq", instances: [".faq-list"] },
      { name: "section-how-we-work", instances: ["#main-content > section.section.secondary-section:nth-of-type(6)"], section: "secondary" },
      { name: "section-in-the-field", instances: ["#main-content > section.section.inverse-section:nth-of-type(7)"], section: "inverse" },
      { name: "columns", instances: [".grid-layout.desktop-3-column.grid-images"] },
      { name: "section-closing-cta", instances: ["#main-content > section.section.accent-section"], section: "accent" }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
