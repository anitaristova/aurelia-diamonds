import { BrowserRouter, Routes, Route, useParams, useSearchParams } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Placeholder from './components/Placeholder.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { LoginPromptProvider } from './context/LoginPrompt.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AccountLayout from './pages/account/AccountLayout.jsx';
import AccountProfile from './pages/account/AccountProfile.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminProductForm from './pages/admin/AdminProductForm.jsx';

function CategoryPlaceholder() {
  const { department, subcategory } = useParams();
  const title = (subcategory || department || '').replace(/-/g, ' ');
  return <Placeholder title={title || 'Collection'} message="Product listing coming soon." />;
}

function SearchPlaceholder() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  return (
    <Placeholder
      title="Search"
      message={q ? `Results for “${q}” coming soon.` : 'Search coming soon.'}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LoginPromptProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Placeholder title="Aurelia Diamonds" message="Home page coming soon." />} />
              <Route path="c/:department" element={<CategoryPlaceholder />} />
              <Route path="c/:department/:subcategory" element={<CategoryPlaceholder />} />
              <Route path="sale" element={<Placeholder title="Sale" message="Sale collection coming soon." />} />
              <Route path="search" element={<SearchPlaceholder />} />
              <Route path="product/:id" element={<Placeholder title="Product" message="Product details coming soon." />} />
              <Route path="favorites" element={<Placeholder title="My Favorites" message="Favorites coming soon." />} />
              <Route path="cart" element={<Placeholder title="Your Cart" message="Cart coming soon." />} />
              <Route path="checkout" element={<Placeholder title="Checkout" message="Checkout coming soon." />} />
              <Route path="order-confirmation" element={<Placeholder title="Thank you for your order!" />} />
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
                <Route path="orders" element={<Placeholder title="My Orders" message="Orders coming soon." />} />
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
                <Route path="orders" element={<Placeholder title="Orders" message="Order management coming soon." />} />
              </Route>
              <Route path="*" element={<Placeholder title="Page not found" message="The page you are looking for does not exist." />} />
            </Route>
          </Routes>
        </LoginPromptProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
