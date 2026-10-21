import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminDashboardPage from "./components/pages/AdminDashboardPage";
import EditUserPage from "./components/pages/EditUserPage";
import LoginPage from "./components/pages/LoginPage";
import NotFoundPage from "./components/pages/NotFoundPage";
import ProductDetailsPage from "./components/pages/ProductDetailsPage";
import ShopPage from "./components/pages/ShopPage";
import SignupPage from "./components/pages/SignupPage";
import SellerWorkspacePage from "./components/pages/SellerWorkspacePage";
import UsersPage from "./components/pages/UsersPage";
import "./components/pages/Pages.css";

function getSession() {
  try {
    return JSON.parse(localStorage.getItem("kimo-session") || "null");
  } catch {
    return null;
  }
}

function hasSession() {
  return Boolean(getSession()?.token);
}

function RequireLogin({ children }) {
  return hasSession() ? children : <Navigate to="/login" replace />;
}

function RequireAdmin({ children }) {
  const session = getSession();
  if (!session?.token) {
    return <Navigate to="/login" replace />;
  }
  return session.user?.role === "admin" ? children : <Navigate to="/shop" replace />;
}

function RequireSeller({ children }) {
  const session = getSession();
  if (!session?.token) {
    return <Navigate to="/login" replace />;
  }
  return session.user?.role === "seller" ? children : <Navigate to="/shop" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/shop" replace />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/products/:productId" element={<ProductDetailsPage />} />
        <Route path="/users" element={<RequireLogin><UsersPage /></RequireLogin>} />
        <Route path="/users/edit" element={<RequireLogin><EditUserPage /></RequireLogin>} />
        <Route path="/admin" element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>} />
        <Route path="/seller" element={<RequireSeller><SellerWorkspacePage /></RequireSeller>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
