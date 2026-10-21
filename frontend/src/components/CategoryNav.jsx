function CategoryNav({ setActiveCategory }) {
  return (
    <nav className="category-nav" aria-label="Main categories">
      <a className="nav-current" href="#products">Shop</a>
      <a href="#products" onClick={() => setActiveCategory("Audio")}>Audio</a>
      <a href="#products" onClick={() => setActiveCategory("Computers")}>Computers</a>
      <a href="#products" onClick={() => setActiveCategory("Mobile")}>Mobile</a>
      <a href="#products" onClick={() => setActiveCategory("Wearables")}>Wearables</a>
      <a className="nav-deals" href="#products">bonus <span>—</span> buy 2 get 1 free</a>
    </nav>
  );
}

export default CategoryNav;
