import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginSchema, signupSchema } from "../../schemas/formSchemas";

function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function submitAuth(account) {
    setError("");

    try {
      const response = await fetch(isSignup ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to complete the request.");
      }

      if (isSignup) {
        navigate("/login", { state: { message: "Account created. Please sign in." } });
      } else {
        localStorage.setItem("kimo-session", JSON.stringify({ token: data.token, user: data.user }));
        const roleRoutes = { admin: "/admin", seller: "/seller", buyer: "/users" };
        navigate(roleRoutes[data.user.role] || "/shop");
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to complete the request.");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-dialog">
        <p className="eyebrow">KimoElectro</p>
        <h1>{isSignup ? "Create account" : "Sign in"}</h1>
        <p className="auth-subtitle">{isSignup ? "Create an account to place an order." : "Sign in to manage your account and orders."}</p>
        {location.state?.message && <p className="form-success" role="status">{location.state.message}</p>}
        <form className="auth-form" onSubmit={handleSubmit(submitAuth)} noValidate>
          {isSignup && <label>Name<input autoComplete="name" aria-invalid={Boolean(errors.name)} {...register("name")} />{errors.name && <span className="field-error">{errors.name.message}</span>}</label>}
          <label>Email address<input type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} {...register("email")} />{errors.email && <span className="field-error">{errors.email.message}</span>}</label>
          <label>Password<input type="password" autoComplete={isSignup ? "new-password" : "current-password"} aria-invalid={Boolean(errors.password)} {...register("password")} />{errors.password && <span className="field-error">{errors.password.message}</span>}</label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Please wait..." : isSignup ? "Create account" : "Sign in"}</button>
        </form>
        <p className="auth-switch">
          {isSignup ? "Already registered? " : "Need an account? "}
          <Link to={isSignup ? "/login" : "/signup"}>{isSignup ? "Sign in" : "Sign up"}</Link>
        </p>
        <Link className="back-to-shop" to="/shop">Back to shop</Link>
      </section>
    </main>
  );
}

export default AuthPage;
