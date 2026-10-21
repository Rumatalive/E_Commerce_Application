import { ArrowRight, Heart, Search, ShoppingBag, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

function StoreHeader({
  search,
  setSearch,
  showWishlist,
  setShowWishlist,
  wishlist,
  setActiveCategory,
  cartCount,
  setCartOpen,
  canShop,
  isSignedIn,
  isAdmin,
  isSeller,
}) {
  const navigate = useNavigate();

  return (
    <>
      <div className="announcement">
        <span>GOOD TECH, BETTER DAYS.</span>
        <span>Free delivery on orders </span>
        <button type="button" onClick={() => navigate("/signup")}>
          Join our KimoElectro space<ArrowRight size={14} />
        </button>
      </div>

      <header className="site-header">
        <a className="brand" href="#home" aria-label="KimoElectro home">
          <span className="brand-mark"><ShoppingBag size={19} strokeWidth={2.5} /></span>
          <span>Kimo<span>Electro</span></span>
        </a>

        <div className="search-form" role="search">
          <Search size={18} aria-hidden="true" />
          <input
            aria-label="Search products"
            placeholder="Search for headphones, laptops, and more..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setShowWishlist(false);
            }}
          />
          <kbd> K</kbd>
        </div>

        <div className="header-actions">
          <button className="icon-action account-action" type="button" onClick={() => navigate(isAdmin ? "/admin" : isSeller ? "/seller" : isSignedIn ? "/users" : "/login")} aria-label={isAdmin ? "Admin dashboard" : isSeller ? "Seller workspace" : "Account"}>
            <UserRound size={20} />
            <span>{isAdmin ? "Admin" : isSeller ? "Seller" : "Account"}</span>
          </button>
          {canShop && <button
            className={`icon-action wishlist-action ${showWishlist ? "is-active" : ""}`}
            type="button"
            onClick={() => {
              setShowWishlist((current) => !current);
              setActiveCategory("All products");
            }}
            aria-label={`Wishlist, ${wishlist.length} items`}
          >
            <span className="action-icon-wrap"><Heart size={20} />{wishlist.length > 0 && <span className="count-dot">{wishlist.length}</span>}</span>
            <span>Wishlist</span>
          </button>}
          {canShop && <button className="cart-action" type="button" onClick={() => setCartOpen(true)}>
            <ShoppingBag size={19} />
            <span>Cart</span>
            <span className="cart-count">{cartCount}</span>
          </button>}
        </div>
      </header>
    </>
  );
}

export default StoreHeader;
