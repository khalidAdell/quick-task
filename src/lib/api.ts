// src/lib/api.ts
import { auth } from "./firebase";

type FetchOptions = RequestInit & {
  body?: any;
};

export async function fetchWithAuth(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get Firebase ID token
  const token = await user.getIdToken();

  // Set headers
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  // Stringify body if present
  const body = options.body ? JSON.stringify(options.body) : undefined;

  return fetch(`${process.env.REACT_APP_STRAPI_URL}${url}`, {
    ...options,
    headers,
    body,
  });
}