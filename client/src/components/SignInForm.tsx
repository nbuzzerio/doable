import React, { useState } from "react";

interface FormState {
  email: string;
  password: string;
}

interface SignupFormProps {
  setLogin: React.Dispatch<React.SetStateAction<"" | "signin" | "signup">>;
  setUser: React.Dispatch<React.SetStateAction<string>>;
}

const SignInForm: React.FC<SignupFormProps> = ({ setLogin, setUser }) => {
  const [formData, setFormData] = useState<FormState>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/doable/api/auth", {
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

      const data = await response.json();
      setSuccess("User registered successfully!");
      document.cookie = `x-auth-token=${data.token}`;
      setUser(data.token);
      setFormData({ email: "", password: "" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="signup-form my-40 flex w-full flex-col items-center justify-center gap-10 bg-slate-300 p-20 md:w-[768px]">
      <h2 className="pb-10 text-7xl text-slate-800">Sign In</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex">
          <label className="w-20" htmlFor="email">
            Email
          </label>
          <input
            className="px-2"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex">
          <label className="w-20" htmlFor="password">
            Password
          </label>
          <input
            className="px-2"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="bg-white" type="submit">
          Sign In
        </button>
      </form>
      <div className="flex w-full items-center justify-between gap-20">
        <button
          className="flex w-full justify-center border border-black shadow-2xl"
          disabled
          onClick={() => setLogin("signin")}
        >
          sign in
        </button>
        <button
          className="flex w-full justify-center border border-black shadow-2xl"
          onClick={() => setLogin("signup")}
        >
          sign up
        </button>
      </div>
    </div>
  );
};

export default SignInForm;
