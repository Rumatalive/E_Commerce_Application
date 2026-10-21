import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { productSchema, sellerSchema } from "../../schemas/formSchemas";

const blankProduct = { name: "", category: "", price: "" };

function getSession() {
  try {
    return JSON.parse(localStorage.getItem("kimo-session") || "null");
  } catch {
    return null;
  }
}

async function fetchDashboard(token) {
  const headers = { Authorization: `Bearer ${token}` };
  const [dashboardResponse, productsResponse] = await Promise.all([
    fetch("/api/admin/dashboard", { headers }),
    fetch("/api/products"),
  ]);
  const dashboardData = await dashboardResponse.json();
  const productsData = await productsResponse.json();

  if (!dashboardResponse.ok) {
    throw new Error(dashboardData.message || "Could not load admin dashboard.");
  }
  if (!productsResponse.ok) {
    throw new Error(productsData.message || "Could not load products.");
  }

  return { dashboardData, productsData };
}

function AdminDashboardPage() {
  const [session] = useState(getSession);
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const sellerForm = useForm({
    resolver: zodResolver(sellerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });
  const productForm = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: blankProduct,
  });

  async function loadDashboard() {
    if (!session?.token) {
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { dashboardData, productsData } = await fetchDashboard(session.token);
      setDashboard(dashboardData);
      setProducts(productsData);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not load admin dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    if (!session?.token) {
      navigate("/login", { replace: true });
      return undefined;
    }

    fetchDashboard(session.token)
      .then(({ dashboardData, productsData }) => {
        if (active) {
          setDashboard(dashboardData);
          setProducts(productsData);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Could not load admin dashboard.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [session?.token, navigate]);

  function editProduct(product) {
    setEditingId(product._id);
    productForm.reset({
      name: product.name,
      category: product.category,
      price: String(product.price),
    });
    setMessage("");
  }

  function resetProductForm() {
    setEditingId(null);
    productForm.reset(blankProduct);
  }

  async function saveProduct(values) {
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/products/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not save product.");
      }

      resetProductForm();
      setMessage("Product updated.");
      await loadDashboard();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not save product.");
    }
  }

  async function deleteProduct(productId) {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not delete product.");
      }
      setMessage("Product deleted.");
      await loadDashboard();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not delete product.");
    }
  }

  async function createSeller(values) {
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/sellers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not create seller account.");
      }

      sellerForm.reset({ name: "", email: "", password: "" });
      setMessage(`Seller account created for ${data.seller.email}.`);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not create seller account.");
    }
  }

  function signOut() {
    localStorage.removeItem("kimo-session");
    navigate("/login");
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <Link className="text-link" to="/shop">Back to shop</Link>
          <h1>Admin dashboard</h1>
          <p>{session?.user?.email}</p>
        </div>
        <button className="plain-button" type="button" onClick={signOut}>Sign out</button>
      </header>

      {error && <p className="form-error" role="alert">{error}</p>}
      {message && <p className="form-success" role="status">{message}</p>}

      {loading ? <p>Loading dashboard...</p> : dashboard && <>
        <section className="admin-stats" aria-label="Store overview">
          <article><span>Products</span><strong>{dashboard.overview.products}</strong></article>
          <article><span>Users</span><strong>{dashboard.overview.users}</strong></article>
          <article><span>Sellers</span><strong>{dashboard.overview.sellers}</strong></article>
          <article><span>Orders</span><strong>{dashboard.overview.orders}</strong></article>
          <article><span>Paid revenue</span><strong>${Number(dashboard.overview.paidRevenue).toLocaleString()}</strong></article>
        </section>

        <section className="admin-section">
          <div className="admin-section-title"><div><h2>Create seller account</h2><p>Only admins can add sellers. Use a temporary password and share it privately.</p></div></div>
          <form className="admin-product-form" onSubmit={sellerForm.handleSubmit(createSeller)} noValidate>
            <label>Seller name<input aria-invalid={Boolean(sellerForm.formState.errors.name)} {...sellerForm.register("name")} />{sellerForm.formState.errors.name && <span className="field-error">{sellerForm.formState.errors.name.message}</span>}</label>
            <label>Email address<input type="email" aria-invalid={Boolean(sellerForm.formState.errors.email)} {...sellerForm.register("email")} />{sellerForm.formState.errors.email && <span className="field-error">{sellerForm.formState.errors.email.message}</span>}</label>
            <label>Temporary password<input type="password" aria-invalid={Boolean(sellerForm.formState.errors.password)} {...sellerForm.register("password")} />{sellerForm.formState.errors.password && <span className="field-error">{sellerForm.formState.errors.password.message}</span>}</label>
            <div className="admin-form-actions"><button className="auth-submit" type="submit" disabled={sellerForm.formState.isSubmitting}>{sellerForm.formState.isSubmitting ? "Creating..." : "Create seller"}</button></div>
          </form>
        </section>

        {editingId && <section className="admin-section">
          <div className="admin-section-title">
            <div><h2>Edit product</h2><p>Update product details.</p></div>
          </div>
          <form className="admin-product-form" onSubmit={productForm.handleSubmit(saveProduct)} noValidate>
            <label>Product name<input aria-invalid={Boolean(productForm.formState.errors.name)} {...productForm.register("name")} />{productForm.formState.errors.name && <span className="field-error">{productForm.formState.errors.name.message}</span>}</label>
            <label>Category<input aria-invalid={Boolean(productForm.formState.errors.category)} {...productForm.register("category")} />{productForm.formState.errors.category && <span className="field-error">{productForm.formState.errors.category.message}</span>}</label>
            <label>Price<input type="number" min="0" step="0.01" aria-invalid={Boolean(productForm.formState.errors.price)} {...productForm.register("price")} />{productForm.formState.errors.price && <span className="field-error">{productForm.formState.errors.price.message}</span>}</label>
            <div className="admin-form-actions">
              <button className="auth-submit" type="submit" disabled={productForm.formState.isSubmitting}>{productForm.formState.isSubmitting ? "Saving..." : "Save product"}</button>
              {editingId && <button className="plain-button" type="button" onClick={resetProductForm}>Cancel</button>}
            </div>
          </form>
        </section>}

        <section className="admin-section">
          <div className="admin-section-title"><div><h2>Products</h2><p>Manage items displayed in the shop.</p></div><button className="plain-button" type="button" onClick={loadDashboard}>Refresh</button></div>
          {products.length ? <div className="admin-table-wrap"><table className="admin-table">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Actions</th></tr></thead>
            <tbody>{products.map((product) => <tr key={product._id}>
              <td>{product.name}</td><td>{product.category}</td><td>${Number(product.price).toLocaleString()}</td>
              <td className="admin-row-actions"><button type="button" onClick={() => editProduct(product)}>Edit</button><button type="button" onClick={() => deleteProduct(product._id)}>Delete</button></td>
            </tr>)}</tbody>
          </table></div> : <p>No products have been added yet.</p>}
        </section>

        <section className="admin-section">
          <div className="admin-section-title"><div><h2>Recent orders</h2><p>Revenue counts paid orders only.</p></div></div>
          {dashboard.recentOrders.length ? <div className="admin-table-wrap"><table className="admin-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Payment</th></tr></thead>
            <tbody>{dashboard.recentOrders.map((order) => <tr key={order._id}>
              <td>{order._id.slice(-8)}</td><td>{order.user?.name || order.user?.email || "Unknown"}</td>
              <td>${Number(order.totalAmount).toLocaleString()}</td><td>{order.status}</td><td>{order.paymentStatus}</td>
            </tr>)}</tbody>
          </table></div> : <p>No orders yet.</p>}
          {dashboard.orderStatuses.length > 0 && <p className="admin-statuses">{dashboard.orderStatuses.map((status) => `${status._id}: ${status.count}`).join(" · ")}</p>}
        </section>
      </>}
    </main>
  );
}

export default AdminDashboardPage;
