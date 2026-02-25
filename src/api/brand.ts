const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:4000";

export async function fetchBrand(apiKey: string) {
  console.log("🔑 fetchBrand apiKey:", apiKey);

  if (!apiKey) {
    throw new Error("Missing API key");
  }


  const res = await fetch(
    `${API_BASE_URL}/api/brand/export`,
    {
      method: "GET",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json"
      }
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Failed to fetch brand (${res.status}): ${text}`
    );
  }

  return res.json();
}

export async function saveBrand(
  apiKey: string,
  brand: any
) {
  if (!apiKey) {
    throw new Error("Missing API key");
  }

  const res = await fetch(`${API_BASE_URL}/api/brand`, {
    method: "PUT",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ brand })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Failed to save brand (${res.status}): ${text}`
    );
  }

  return res.json();
}
