import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="simple-page not-found-page">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>This page does not exist.</p>
      <Link className="primary-button" to="/shop">Go to shop</Link>
    </main>
  );
}

export default NotFoundPage;
