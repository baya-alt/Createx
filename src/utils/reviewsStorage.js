const STORAGE_PREFIX = "reviews";

function keyFor(category, productId) {
  return `${STORAGE_PREFIX}:${category}:${String(productId)}`;
}

export function loadReviews({ category, productId, fallback = [] }) {
  try {
    const raw = localStorage.getItem(keyFor(category, productId));
    if (!raw) return Array.isArray(fallback) ? fallback : [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : (Array.isArray(fallback) ? fallback : []);
  } catch {
    return Array.isArray(fallback) ? fallback : [];
  }
}

export function saveReviews({ category, productId, reviews }) {
  try {
    localStorage.setItem(keyFor(category, productId), JSON.stringify(Array.isArray(reviews) ? reviews : []));
  } catch {
    // ignore quota / serialization errors
  }
}

