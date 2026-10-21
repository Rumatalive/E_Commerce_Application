import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { productCreateSchema, productSchema } from "../../schemas/formSchemas";

const emptyProduct = { name: "", category: "", price: "" };

function readSession() {
  try {
    return JSON.parse(localStorage.getItem("kimo-session") || "null");
  } catch {
    return null;
  }
}

async function fetchSellerProducts(token) {
  const response = await fetch("/api/seller/products", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not load your products.");
  }
  return data;
}

function SellerWorkspacePage() {
  const [session] = useState(readSession);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const productForm = useForm({
    resolver: zodResolver(editingId ? productSchema : productCreateSchema),
    defaultValues: emptyProduct,
  });

  async function loadProducts() {
    if (!session?.token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setProducts(await fetchSellerProducts(session.token));
      setError("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not load your products.");
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

    fetchSellerProducts(session.token)
      .then((data) => {
        if (active) {
          setProducts(data);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Could not load your products.");
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

  function startEdit(item) {
    setEditingId(item._id);
    productForm.reset({ name: item.name, category: item.category, price: String(item.price) });
    setMessage("");
  }

  function resetForm() {
    setEditingId("");
    productForm.reset(emptyProduct);
  }

  async function saveProduct(values) {
    setError("");
    setMessage("");

    try {
      const headers = { Authorization: `Bearer ${session.token}` };
      let body;
      if (editingId) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(values);
      } else {
        body = new FormData();
        body.append("name", values.name);
        body.append("category", values.category);
        body.append("price", String(values.price));
        body.append("image", values.image);
      }

      const response = await fetch(editingId ? `/api/products/${editingId}` : "/api/products", {
        method: editingId ? "PUT" : "POST",
        headers,
        body,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not save product.");
      }

      const wasEditing = Boolean(editingId);
      resetForm();
      setMessage(wasEditing ? "Product updated." : "Product added.");
      await loadProducts();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not save product.");
    }
  }

  async function removeProduct(productId) {
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
      await loadProducts();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not delete product.");
    }
  }

  function signOut() {
    localStorage.removeItem("kimo-session");
    navigate("/login");
  }

  return (
    <main className="admin-page seller-page">
      <header className="admin-header">
        <div>
          <Link className="text-link" to="/shop">Back to shop</Link>
          <h1>Seller workspace</h1>
          <p>{session?.user?.email}</p>
        </div>
        <button className="plain-button" type="button" onClick={signOut}>Sign out</button>
      </header>

      {error && <p className="form-error" role="alert">{error}</p>}
      {message && <p className="form-success" role="status">{message}</p>}

      <section className="admin-section">
        <div className="admin-section-title">
          <div><h2>{editingId ? "Edit product" : "Add a product"}</h2><p>Manage only products listed under your account.</p></div>
        </div>
        <form className="admin-product-form" onSubmit={productForm.handleSubmit(saveProduct)} noValidate>
          <label>Product name<input aria-invalid={Boolean(productForm.formState.errors.name)} {...productForm.register("name")} />{productForm.formState.errors.name && <span className="field-error">{productForm.formState.errors.name.message}</span>}</label>
          <label>Category<input aria-invalid={Boolean(productForm.formState.errors.category)} {...productForm.register("category")} />{productForm.formState.errors.category && <span className="field-error">{productForm.formState.errors.category.message}</span>}</label>
          <label>Price<input type="number" min="0" step="0.01" aria-invalid={Boolean(productForm.formState.errors.price)} {...productForm.register("price")} />{productForm.formState.errors.price && <span className="field-error">{productForm.formState.errors.price.message}</span>}</label>
          {!editingId && <label>Product image<input type="file" accept="image/*" aria-invalid={Boolean(productForm.formState.errors.image)} {...productForm.register("image")} />{productForm.formState.errors.image && <span className="field-error">{productForm.formState.errors.image.message}</span>}</label>}
          <div className="admin-form-actions">
            <button className="auth-submit" type="submit" disabled={productForm.formState.isSubmitting}>{productForm.formState.isSubmitting ? "Saving..." : editingId ? "Save changes" : "Add product"}</button>
            {editingId && <button className="plain-button" type="button" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </section>

      <section className="admin-section">
        <div className="admin-section-title"><div><h2>My products</h2><p>{products.length} listed</p></div><button className="plain-button" type="button" onClick={loadProducts}>Refresh</button></div>
        {loading ? <p>Loading products...</p> : products.length ? <div className="admin-table-wrap"><table className="admin-table">
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Actions</th></tr></thead>
          <tbody>{products.map((item) => <tr key={item._id}>
            <td>{item.name}</td><td>{item.category}</td><td>${Number(item.price).toLocaleString()}</td>
            <td className="admin-row-actions"><button type="button" onClick={() => startEdit(item)}>Edit</button><button type="button" onClick={() => removeProduct(item._id)}>Delete</button></td>
          </tr>)}</tbody>
        </table></div> : <p>You have not added any products yet.</p>}
      </section>
    </main>
  );
}

export default SellerWorkspacePage;
