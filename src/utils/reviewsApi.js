const CATEGORY_BASE_URLS = {
  kids: "https://6947cef21ee66d04a44dfb36.mockapi.io",
  men: "https://691bbd103aaeed735c8e1d0d.mockapi.io",
  women: "https://691bbd103aaeed735c8e1d0d.mockapi.io",
};

function baseUrlForCategory(category) {
  return CATEGORY_BASE_URLS[category];
}

function reviewsUrl(category) {
  const base = baseUrlForCategory(category);
  if (!base) throw new Error(`Unknown reviews category: ${category}`);
  return `${base}/reviews`;
}

async function safeJson(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function fetchReviews({ category, productId }) {
  const url = new URL(reviewsUrl(category));
  url.searchParams.set("productId", String(productId));
  // newest first by timestamp when MockAPI supports sorting
  url.searchParams.set("sortBy", "timestamp");
  url.searchParams.set("order", "desc");

  const res = await fetch(url.toString());
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.message || `Failed to fetch reviews (${res.status})`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function createReview({ category, productId, review }) {
  const res = await fetch(reviewsUrl(category), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: String(productId),
      ...review,
    }),
  });
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.message || `Failed to create review (${res.status})`);
  }
  return await res.json();
}

export async function updateReview({ category, reviewId, patch }) {
  const res = await fetch(`${reviewsUrl(category)}/${reviewId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.message || `Failed to update review (${res.status})`);
  }
  return await res.json();
}

