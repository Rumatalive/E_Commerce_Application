import { ShoppingBag } from "lucide-react";

function StoreFooter({ currentYear }) {
  return (
    <footer className="site-footer" id="about">
      <a className="brand footer-brand" href="#home">
        <span className="brand-mark"><ShoppingBag size={18} strokeWidth={2.5} /></span>
        <span>Kimo<span>Electro</span></span>
      </a>
      <p>Good tech, better days. © {currentYear} KimoElectro</p>
      <div><a href="#products">Shop all</a><a href="#home">Our story</a><a href="#home">Help</a></div>
    </footer>
  );
}

export default StoreFooter;
