
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Heart,
  Plus,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from "lucide-react";
import "../App.css";
import CartPanel from "./CartPanel";
import CategoryNav from "./CategoryNav";
import StoreFooter from "./StoreFooter";
import StoreHeader from "./StoreHeader";
import { loginSchema, signupSchema } from "../schemas/formSchemas";

const sampleProducts = [
  {
    id: 1,
    name: "Studio Pro Headphones",
    category: "Audio",
    description: "Wireless noise cancelling",
    price: 249,
    previousPrice: 299,
    rating: "4.9",
    reviews: 128,
    badge: "BESTSELLER",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Black over-ear headphones",
  },
  {
    id: 2,
    name: "Everyday Smartwatch",
    category: "Wearables",
    description: "Your day, in perfect rhythm",
    price: 189,
    previousPrice: null,
    rating: "4.8",
    reviews: 86,
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Minimal wristwatch with a dark strap",
  },
  {
    id: 3,
    name: "Airbook 14 Laptop",
    category: "Computers",
    description: "Power to go further",
    price: 1199,
    previousPrice: 1299,
    rating: "4.9",
    reviews: 214,
    badge: "SAVE $100",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Open silver laptop on a desk",
  },
  {
    id: 4,
    name: "Pocket Phone X",
    category: "Mobile",
    description: "Big ideas. Pocket-sized.",
    price: 799,
    previousPrice: null,
    rating: "4.7",
    reviews: 93,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Smartphone viewed from the back",
  },
  {
    id: 5,
    name: "Soundcore Mini Speaker",
    category: "Audio",
    description: "Small speaker, full sound",
    price: 89,
    previousPrice: 109,
    rating: "4.6",
    reviews: 57,
    badge: "SAVE $20",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Portable speaker on a table",
  },
  {
    id: 6,
    name: "Creator Wireless Headset",
    category: "Audio",
    description: "Made for focus and flow",
    price: 159,
    previousPrice: null,
    rating: "4.8",
    reviews: 72,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Wireless headphones in a studio",
  },
  {
    id: 7,
    name: "Mechanical Keyboard",
    category: "Computers",
    description: "A satisfying daily essential",
    price: 129,
    previousPrice: null,
    rating: "4.7",
    reviews: 41,
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Mechanical keyboard with colorful keycaps",
  },
  {
    id: 8,
    name: "Sport Smartwatch",
    category: "Wearables",
    description: "Ready when you are",
    price: 219,
    previousPrice: null,
    rating: "4.8",
    reviews: 65,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Smartwatch with a bright watch face",
  },
];

const categories = ["All products", "Audio", "Computers", "Mobile", "Wearables", "Smartphones", "Tablets", "Accessories", "Gaming"];
const currentYear = new Date().getFullYear();
const fallbackProductImage = "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=85";

function App() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(sampleProducts);
  const [productsLoading, setProductsLoading] = useState(true);
  const [heroSlide, setHeroSlide] = useState(0);
  const [productsError, setProductsError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All products");
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [showWishlist, setShowWishlist] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("kimo-session")) || null;
    } catch {
      return null;
    }
  });
  const {
    register: registerAuth,
    handleSubmit: handleAuthSubmit,
    reset: resetAuth,
    formState: { errors: authFieldErrors, isSubmitting: authSubmitting },
  } = useForm({
    resolver: zodResolver(authMode === "signup" ? signupSchema : loginSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Unable to load products.");
        }
        setProducts(data.map((product) => ({
          id: product._id || product.id,
          name: product.name,
          category: product.category,
          description: product.category,
          price: Number(product.price),
          previousPrice: null,
          rating: null,
          reviews: null,
          badge: null,
          image: product.imageUrl || fallbackProductImage,
          imageAlt: product.name,
        })));
      } catch (error) {
        setProductsError(error instanceof Error ? error.message : "Unable to load products.");
      } finally {
        setProductsLoading(false);
      }
    }

    loadProducts();
  }, []);

  const heroProducts = products.filter((product) => product.image);
  const activeHeroIndex = heroProducts.length ? heroSlide % heroProducts.length : 0;
  const activeHeroProduct = heroProducts[activeHeroIndex];
  const previousHeroProduct = heroProducts.length > 1
    ? heroProducts[(activeHeroIndex - 1 + heroProducts.length) % heroProducts.length]
    : null;

  useEffect(() => {
    if (heroProducts.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const slideTimer = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % heroProducts.length);
    }, 6000);

    return () => window.clearInterval(slideTimer);
  }, [heroProducts.length]);

  const visibleProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All products" || product.category === activeCategory;
    const searchText = search.trim().toLowerCase();
    const matchesSearch =
      !searchText ||
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase()
        .includes(searchText);
    const matchesWishlist = !showWishlist || wishlist.includes(product.id);
    return matchesCategory && matchesSearch && matchesWishlist;
  });

  const cartItems = products.filter((product) => cart[product.id]);
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const cartTotal = cartItems.reduce(
    (total, product) => total + product.price * cart[product.id],
    0,
  );
  const canShop = !session?.token || session.user?.role === "buyer";

  function toggleWishlist(productId) {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }

  function changeQuantity(productId, amount) {
    setCheckoutError("");
    setCheckoutMessage("");
    setCart((current) => {
      const nextQuantity = (current[productId] || 0) + amount;
      if (nextQuantity <= 0) {
        const nextCart = { ...current };
        delete nextCart[productId];
        return nextCart;
      }
      return { ...current, [productId]: nextQuantity };
    });
  }

  function openAuth(mode) {
    resetAuth({ name: "", email: "", password: "" });
    setAuthMessage("");
    setAuthError(false);
    setAuthMode(mode);
  }

  async function submitAuth(credentials) {
    setAuthMessage("");
    setAuthError(false);
    const isSignup = authMode === "signup";

    try {
      const response = await fetch(isSignup ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Account request failed.");
      }

      if (isSignup) {
        resetAuth({ name: "", email: "", password: "" });
        setAuthMode("login");
        setAuthMessage("Account created. Sign in with your new credentials.");
      } else {
        const nextSession = { token: data.token, user: data.user };
        localStorage.setItem("kimo-session", JSON.stringify(nextSession));
        setSession(nextSession);
        setAuthMessage("Signed in successfully.");
        if (data.user.role === "admin" || data.user.role === "seller") {
          setAuthMode(null);
          navigate(data.user.role === "admin" ? "/admin" : "/seller");
        }
      }
    } catch (error) {
      setAuthError(true);
      setAuthMessage(error instanceof Error ? error.message : "Account request failed.");
    }
  }

  async function submitOrder({ shippingAddress }) {
    if (!session?.token) {
      openAuth("login");
      return false;
    }
    if (session.user?.role !== "buyer") {
      setCheckoutError("Only buyer accounts can place orders.");
      return false;
    }

    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({
          items: cartItems.map((product) => ({
            product: product.id,
            quantity: cart[product.id],
          })),
          shippingAddress,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to place your order.");
      }

      setCart({});
      setCheckoutMessage("Your order is placed. A confirmation email is on its way.");
      return true;
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Unable to place your order.");
      return false;
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="storefront">
      <StoreHeader
        search={search}
        setSearch={setSearch}
        showWishlist={showWishlist}
        setShowWishlist={setShowWishlist}
        wishlist={wishlist}
        setActiveCategory={setActiveCategory}
        cartCount={cartCount}
        setCartOpen={setCartOpen}
        canShop={canShop}
        isSignedIn={Boolean(session?.token)}
        isAdmin={session?.user?.role === "admin"}
        isSeller={session?.user?.role === "seller"}
      />
      <CategoryNav setActiveCategory={setActiveCategory} />

      <main>
        <section className="hero" id="home">
          {activeHeroProduct && <div className="hero-backdrop" aria-hidden="true">
            {previousHeroProduct && <img
              key={`previous-${previousHeroProduct.id}`}
              className="hero-backdrop-image hero-backdrop-previous"
              src={previousHeroProduct.image}
              alt=""
            />}
            <img
              key={`current-${activeHeroProduct.id}`}
              className="hero-backdrop-image hero-backdrop-current"
              src={activeHeroProduct.image}
              alt=""
            />
          </div>}
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-copy">
            <h1>Shop everyday tech</h1>
            <p>Browse headphones, computers, wearables, and more.</p>
            <div className="hero-cta-row">
              <a className="primary-button" href="#products">Shop products <ArrowRight size={17} /></a>
            </div>
          </div>
        </section>

        <section className="portable-electronics">
          <h2>Small electronics for life on the move</h2>
          <p>Portable headphones, wearables, and everyday devices you can take anywhere.</p>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A LITTLE SOMETHING FOR EVERY DAY</p>
              <h2>{showWishlist ? "Your wishlist" : "Good things, picked for you."}</h2>
            </div>
            <div className="catalog-tools">
              <span className="result-count">{productsLoading ? "Loading products..." : `${visibleProducts.length} products`}</span>
              {canShop && <button className="filter-button" type="button" onClick={() => setShowWishlist((current) => !current)}>
                <SlidersHorizontal size={16} /> {showWishlist ? "All products" : "Wishlist"}
              </button>}
            </div>
          </div>

          <div className="category-pills" role="group" aria-label="Filter by category">
            {categories.map((category) => (
              <button
                className={activeCategory === category ? "selected" : ""}
                type="button"
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setShowWishlist(false);
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {productsError ? (
            <div className="empty-state" role="alert"><AlertCircle size={25} /><h3>Catalog unavailable</h3><p>{productsError} Check that the backend is running and try again.</p></div>
          ) : productsLoading ? (
            <div className="empty-state" aria-live="polite"><p>Loading products...</p></div>
          ) : visibleProducts.length > 0 ? (
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image-wrap">
                    <img src={product.image} alt={product.imageAlt} loading="lazy" />
                    {product.badge && <span className="product-badge">{product.badge}</span>}
                    {canShop && <button
                      className={`wish-button ${wishlist.includes(product.id) ? "saved" : ""}`}
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      aria-label={`${wishlist.includes(product.id) ? "Remove from" : "Add to"} wishlist: ${product.name}`}
                    >
                      <Heart size={18} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                    </button>}
                    {canShop && <button className="quick-add" type="button" onClick={() => changeQuantity(product.id, 1)}>
                      <Plus size={16} /> Add to bag
                    </button>}
                  </div>
                  <div className="product-details">
                    <div className="product-title-row"><Link to={`/products/${product.id}`}><h3>{product.name}</h3></Link>{product.rating && <span className="product-rating">★ {product.rating}</span>}</div>
                    <p>{product.description}</p>
                    <div className="product-price-row"><strong>${product.price.toLocaleString()}</strong>{product.previousPrice && <del>${product.previousPrice.toLocaleString()}</del>}{product.reviews !== null && <span>({product.reviews})</span>}</div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Heart size={25} />
              <h3>{showWishlist ? "Your wishlist is waiting" : products.length === 0 ? "No products yet" : "No matches just yet"}</h3>
              <p>{showWishlist ? "Tap the heart on anything you love and it will be right here." : products.length === 0 ? "Products added to the store will appear here." : "Try another search or browse all of our picks."}</p>
              {products.length > 0 && <button type="button" onClick={() => { setShowWishlist(false); setSearch(""); setActiveCategory("All products"); }}>Browse all products</button>}
            </div>
          )}
        </section>
      </main>

      <StoreFooter currentYear={currentYear} />

      {canShop && <CartPanel
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cartItems={cartItems}
        cart={cart}
        changeQuantity={changeQuantity}
        cartCount={cartCount}
        cartTotal={cartTotal}
        submitOrder={submitOrder}
        checkoutError={checkoutError}
        checkoutLoading={checkoutLoading}
        checkoutMessage={checkoutMessage}
      />}

      {authMode && (
        <div className="overlay auth-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setAuthMode(null); }}>
          <section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <button className="close-button auth-close" type="button" onClick={() => setAuthMode(null)} aria-label="Close dialog"><X size={21} /></button>
            <div className="auth-mark"><ShoppingBag size={22} /></div>
            <p className="eyebrow">WELCOME TO KimoElectro</p>
            <h2 id="auth-title">{session ? `Welcome, ${session.user.name}.` : authMode === "login" ? "Good to see you." : "Come on in."}</h2>
            <p className="auth-subtitle">{session ? session.user.email : authMode === "login" ? "Sign in to pick up where you left off." : "Create an account for a little more ease."}</p>
            {session ? <button className="auth-submit" type="button" onClick={() => { localStorage.removeItem("kimo-session"); setSession(null); setAuthMessage(""); setAuthMode("login"); }}>Sign out</button> : <>
              <div className="auth-tabs"><button type="button" className={authMode === "login" ? "active" : ""} onClick={() => openAuth("login")}>Sign in</button><button type="button" className={authMode === "signup" ? "active" : ""} onClick={() => openAuth("signup")}>Create account</button></div>
              <form className="auth-form" onSubmit={handleAuthSubmit(submitAuth)} noValidate>
                {authMode === "signup" && <label>Your name<input autoComplete="name" placeholder="Alex Morgan" aria-invalid={Boolean(authFieldErrors.name)} {...registerAuth("name")} />{authFieldErrors.name && <span className="field-error">{authFieldErrors.name.message}</span>}</label>}
                <label>Email address<input autoComplete="email" type="email" placeholder="you@example.com" aria-invalid={Boolean(authFieldErrors.email)} {...registerAuth("email")} />{authFieldErrors.email && <span className="field-error">{authFieldErrors.email.message}</span>}</label>
                <label>Password<input autoComplete={authMode === "login" ? "current-password" : "new-password"} type="password" placeholder="At least 8 characters" aria-invalid={Boolean(authFieldErrors.password)} {...registerAuth("password")} />{authFieldErrors.password && <span className="field-error">{authFieldErrors.password.message}</span>}</label>
                {authMessage && <p className={`auth-message ${authError ? "is-error" : ""}`}>{authError ? <AlertCircle size={15} /> : <Check size={15} />}{authMessage}</p>}
                <button className="auth-submit" type="submit" disabled={authSubmitting}>{authSubmitting ? "Please wait..." : authMode === "login" ? "Sign in" : "Create account"} {!authSubmitting && <ArrowRight size={17} />}</button>
              </form>
              <p className="auth-footnote">Just browsing? Close this window and explore the collection.</p>
            </>}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
