export interface SignUpFormState {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
}

export async function signUp(formData: SignUpFormState): Promise<AuthResponse> {
  const isLocalhost = window.location.hostname === "localhost";
  const baseUrl = isLocalhost ? "/api/users" : "/doable/api/users";

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
