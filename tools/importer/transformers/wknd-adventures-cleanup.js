/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Adventures site-wide cleanup.
 * Removes non-authorable global chrome (skip link, navbar/header, footer) and
 * normalizes image URLs so relative-src images survive import.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

/**
 * Resolve the base URL of the page being imported so relative image paths can be
 * made absolute. Prefer the payload's own URL(s); fall back to the known origin.
 */
function getBaseUrl(payload) {
  const candidates = [
    payload && payload.originalURL,
    payload && payload.url,
  ];
  for (let i = 0; i < candidates.length; i += 1) {
    const c = candidates[i];
    if (c) {
      try {
        return new URL(c).href;
      } catch (e) {
        /* not a valid absolute URL — keep looking */
      }
    }
  }
  // Hardcoded fallback for this source site.
  return 'https://wknd-adventures.com/';
}

/**
 * Convert a single URL to an absolute URL against baseUrl.
 * - relative paths (no leading slash) resolve against the page path/origin
 * - root-relative paths (leading slash) resolve against the origin
 * - already-absolute URLs (http/https/protocol-relative) and data: URIs are left untouched
 * Returns null when nothing should change.
 */
function toAbsolute(value, baseUrl) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  // Leave data URIs and already-absolute/protocol-relative URLs alone.
  if (/^(data:|https?:\/\/|\/\/)/i.test(trimmed)) return null;
  try {
    return new URL(trimmed, baseUrl).href;
  } catch (e) {
    return null;
  }
}

/**
 * Normalize a srcset attribute: each candidate is "url [descriptor]".
 */
function normalizeSrcset(srcset, baseUrl) {
  return srcset
    .split(',')
    .map((part) => {
      const segment = part.trim();
      if (!segment) return null;
      const spaceIdx = segment.search(/\s/);
      const url = spaceIdx === -1 ? segment : segment.slice(0, spaceIdx);
      const descriptor = spaceIdx === -1 ? '' : segment.slice(spaceIdx).trim();
      const abs = toAbsolute(url, baseUrl);
      const finalUrl = abs || url;
      return descriptor ? `${finalUrl} ${descriptor}` : finalUrl;
    })
    .filter(Boolean)
    .join(', ');
}

/**
 * Rewrite every <img>/<source> src and srcset to an absolute URL. This runs
 * before WebImporter.rules.adjustImageUrls, which drops images whose src is a
 * relative path (no leading slash) — the hero background, the featured/teaser
 * image, and the "In the Field" gallery images all use relative src on the
 * source page.
 */
function normalizeImageUrls(element, payload) {
  const baseUrl = getBaseUrl(payload);
  element.querySelectorAll('img, source').forEach((el) => {
    const src = el.getAttribute('src');
    const absSrc = toAbsolute(src, baseUrl);
    if (absSrc) el.setAttribute('src', absSrc);

    const srcset = el.getAttribute('srcset');
    if (srcset && srcset.trim()) {
      el.setAttribute('srcset', normalizeSrcset(srcset, baseUrl));
    }
  });
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Normalize image URLs to absolute BEFORE block parsing and adjustImageUrls,
    // so relative-src images (hero bg, teaser, gallery) are not dropped.
    normalizeImageUrls(element, payload);

    // No blocking overlays/cookie banners present in captured DOM.
    // Skip link sits before <main> and is not authorable content.
    // Found in cleaned.html: <a href="#main-content" class="skip-link">
    WebImporter.DOMUtils.remove(element, ['a.skip-link']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome. Found in cleaned.html:
    //   <div class="navbar"> ... </div>  (site header + megamenu nav, before <main>)
    //   <footer class="footer inverse-footer"> ... </footer>
    WebImporter.DOMUtils.remove(element, [
      'div.navbar',
      'footer.footer',
    ]);
  }
}
