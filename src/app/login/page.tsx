"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    document.cookie = "token=loggedin; path=/";
    router.push("/");
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/assets/js/main.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      {/* CSS */}
      <link rel="stylesheet" href="/assets/css/main.css" />

      <div className="is-preload">
        {/* Header */}
        <header id="header">
          <h1>TaskSplit</h1>
          <p>Please sign in to continue</p>
        </header>

        {/* Login Form */}
        <form id="signup-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <input type="submit" value="Sign In" />
        </form>

        {/* Footer */}
        <footer id="footer">
          <ul className="copyright">
            <li>&copy; TaskSplit</li>
          </ul>
        </footer>
      </div>
    </>
  );
}
