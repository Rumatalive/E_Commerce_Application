import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function UsersPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
          throw new Error(data.message || "Could not load account.");
        }
        setUser(data.user);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Could not load account.");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [navigate]);

  function signOut() {
    localStorage.removeItem("kimo-session");
    navigate("/shop");
  }

  return (
    <main className="simple-page account-page">
      <Link className="text-link" to="/shop">Back to shop</Link>
      <h1>My account</h1>
      {loading ? <p>Loading account...</p> : error ? <p className="form-error" role="alert">{error}</p> : user && (
        <section className="account-details">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <Link className="primary-button" to="/users/edit">Edit my details</Link>
          <button className="plain-button" type="button" onClick={signOut}>Sign out</button>
        </section>
      )}
    </main>
  );
}

export default UsersPage;
