export interface FormState {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
}

export async function signIn(formData: FormState): Promise<AuthResponse> {
  const isLocalhost = window.location.hostname === "localhost";
  const baseUrl = isLocalhost ? "/api/auth" : "/doable/api/auth";

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "An error occurred");
  }

  return response.json();
}
