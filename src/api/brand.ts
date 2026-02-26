// src/api/brand.ts
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:4000"; // Make sure this matches your backend port (4000 from your server.js)

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export async function fetchBrand() {
  console.log("🔑 fetchBrand - using JWT token");

  const headers = getAuthHeaders();

  const res = await fetch(
    `${API_BASE_URL}/brand/user/active`, // Using the new JWT endpoint
    {
      method: "GET",
      headers
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    const text = await res.text();
    throw new Error(
      `Failed to fetch brand (${res.status}): ${text}`
    );
  }

  return res.json();
}

export async function saveBrand(brandData: any) {
  console.log("🔑 saveBrand - using JWT token");

  const headers = getAuthHeaders();

  // Get the active brand first to get its ID
  const activeBrand = await fetchBrand();
  
  const res = await fetch(`${API_BASE_URL}/brand/user/config`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ 
      brandId: activeBrand.brand.id, 
      config: brandData 
    })
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    const text = await res.text();
    throw new Error(
      `Failed to save brand (${res.status}): ${text}`
    );
  }

  return res.json();
}

// Optional: Keep the API key version for backward compatibility
export async function fetchBrandWithApiKey(apiKey: string) {
  console.log("🔑 fetchBrandWithApiKey - using API key");

  if (!apiKey) {
    throw new Error("Missing API key");
  }

  const res = await fetch(
    `${API_BASE_URL}/brand/export`,
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