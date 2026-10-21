import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { checkoutSchema } from "../schemas/formSchemas";

function CartPanel({
  cartOpen,
  setCartOpen,
  cartItems,
  cart,
  changeQuantity,
  cartCount,
  cartTotal,
  submitOrder,
  checkoutError,
  checkoutLoading,
  checkoutMessage,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { shippingAddress: "" },
  });

  if (!cartOpen) {
    return null;
  }

  async function handleOrder(order) {
    if (await submitOrder(order)) {
      reset({ shippingAddress: "" });
    }
  }

  return (
    <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
      <aside className="side-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="panel-header">
          <div><p className="eyebrow">YOUR PICKS</p><h2 id="cart-title">Your bag <span>({cartCount})</span></h2></div>
          <button className="close-button" type="button" onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={21} /></button>
        </div>
        {cartItems.length > 0 ? <>
          <div className="cart-lines">
            {cartItems.map((product) => (
              <div className="cart-line" key={product.id}>
                <img src={product.image} alt="" />
                <div className="cart-line-info">
                  <strong>{product.name}</strong>
                  <span>${product.price.toLocaleString()}</span>
                  <div className="quantity-control">
                    <button type="button" onClick={() => changeQuantity(product.id, -1)} aria-label={`Remove one ${product.name}`}><Minus size={14} /></button>
                    <span>{cart[product.id]}</span>
                    <button type="button" onClick={() => changeQuantity(product.id, 1)} aria-label={`Add one ${product.name}`}><Plus size={14} /></button>
                  </div>
                </div>
                <strong className="line-total">${(product.price * cart[product.id]).toLocaleString()}</strong>
              </div>
            ))}
          </div>
          <form className="cart-summary checkout-form" onSubmit={handleSubmit(handleOrder)} noValidate>
            <p><span>Subtotal</span><strong>${cartTotal.toLocaleString()}</strong></p>
            <label>Shipping address
              <textarea
                aria-invalid={Boolean(errors.shippingAddress)}
                {...register("shippingAddress")}
                placeholder="Street, city, and postal code"
              />
              {errors.shippingAddress && <span className="field-error">{errors.shippingAddress.message}</span>}
            </label>
            {checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}
            <button type="submit" disabled={checkoutLoading || isSubmitting}>
              {checkoutLoading || isSubmitting ? "Placing order..." : "Place order"}
              {!checkoutLoading && !isSubmitting && <ArrowRight size={17} />}
            </button>
          </form>
        </> : (
          <div className="cart-empty">
            <span><ShoppingBag size={25} /></span>
            <h3>{checkoutMessage ? "Order placed." : "Your bag is taking a breather."}</h3>
            <p>{checkoutMessage || "Find something that makes your day a little better."}</p>
            <button type="button" onClick={() => setCartOpen(false)}>Keep browsing <ArrowRight size={16} /></button>
          </div>
        )}
      </aside>
    </div>
  );
}

export default CartPanel;
