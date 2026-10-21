import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { profileSchema } from "../../schemas/formSchemas";

function EditUserPage() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "" },
  });

  useEffect(() => {
    async function loadUser() {
      const session = JSON.parse(localStorage.getItem("kimo-session") || "null");
      if (!session?.token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${session.token}` },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Could not load account details.");
        }
        reset({ name: data.user.name, email: data.user.email });
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Could not load account details.");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [navigate, reset]);

  async function saveUser(profile) {
    setError("");
    setMessage("");
    const session = JSON.parse(localStorage.getItem("kimo-session") || "null");

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(profile),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not update account.");
      }
      localStorage.setItem("kimo-session", JSON.stringify({ ...session, user: data.user }));
      setMessage("Your details have been updated.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not update account.");
    }
  }

  return (
    <main className="simple-page account-page">
      <Link className="text-link" to="/users">Back to my account</Link>
      <h1>Edit my details</h1>
      {loading ? <p>Loading account...</p> : (
        <form className="auth-form account-form" onSubmit={handleSubmit(saveUser)} noValidate>
          <label>Name<input aria-invalid={Boolean(errors.name)} {...register("name")} />{errors.name && <span className="field-error">{errors.name.message}</span>}</label>
          <label>Email address<input type="email" aria-invalid={Boolean(errors.email)} {...register("email")} />{errors.email && <span className="field-error">{errors.email.message}</span>}</label>
          {error && <p className="form-error" role="alert">{error}</p>}
          {message && <p className="form-success" role="status">{message}</p>}
          <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save changes"}</button>
        </form>
      )}
    </main>
  );
}

export default EditUserPage;
