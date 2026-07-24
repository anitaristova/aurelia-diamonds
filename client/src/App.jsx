import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Placeholder from './components/Placeholder.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ShopProvider } from './context/ShopContext.jsx';
import { LoginPromptProvider } from './context/LoginPrompt.jsx';
import Home from './pages/Home.jsx';
import Listing from './pages/Listing.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Favorites from './pages/Favorites.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AccountLayout from './pages/account/AccountLayout.jsx';
import AccountProfile from './pages/account/AccountProfile.jsx';
import AccountOrders from './pages/account/AccountOrders.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminProductForm from './pages/admin/AdminProductForm.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShopProvider>
          <LoginPromptProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="c/:department" element={<Listing />} />
                <Route path="c/:department/:subcategory" element={<Listing />} />
                <Route path="sale" element={<Listing />} />
                <Route path="search" element={<Listing />} />
                <Route path="product/:id" element={<ProductDetails />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="cart" element={<Cart />} />
                <Route
                  path="checkout"
                  element={
                    <RequireAuth>
                      <Checkout />
                    </RequireAuth>
                  }
                />
                <Route
                  path="order-confirmation/:id"
                  element={
                    <RequireAuth>
                      <OrderConfirmation />
                    </RequireAuth>
                  }
                />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route
                  path="account"
                  element={
                    <RequireAuth>
                      <AccountLayout />
                    </RequireAuth>
                  }
                >
                  <Route index element={<AccountProfile />} />
                  <Route path="orders" element={<AccountOrders />} />
                </Route>
                <Route
                  path="admin"
                  element={
                    <RequireAuth adminOnly>
                      <AdminLayout />
                    </RequireAuth>
                  }
                >
                  <Route index element={<AdminProducts />} />
                  <Route path="products/new" element={<AdminProductForm />} />
                  <Route path="products/:id/edit" element={<AdminProductForm />} />
                  <Route path="orders" element={<AdminOrders />} />
                </Route>
                <Route path="*" element={<Placeholder title="Page not found" message="The page you are looking for does not exist." />} />
              </Route>
            </Routes>
          </LoginPromptProvider>
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
