import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const fallbackImage = "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=85";

function ProductDetailsPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Product could not be found.");
        }
        setProduct(data);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Product could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  return (
    <main className="simple-page product-page">
      <Link className="text-link" to="/shop">Back to shop</Link>
      {loading ? <p>Loading product...</p> : error ? <p className="form-error" role="alert">{error}</p> : product && (
        <article className="product-detail">
          <img src={product.imageUrl || fallbackImage} alt={product.name} />
          <div>
            <p className="eyebrow">{product.category}</p>
            <h1>{product.name}</h1>
            <p className="detail-price">${Number(product.price).toLocaleString()}</p>
            <p>Available from KimoElectro.</p>
            <Link className="primary-button" to="/shop">Continue shopping</Link>
          </div>
        </article>
      )}
    </main>
  );
}

export default ProductDetailsPage;
