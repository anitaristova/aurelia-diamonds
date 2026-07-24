import { BrowserRouter, Routes, Route, useParams, useSearchParams } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Placeholder from './components/Placeholder.jsx';

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
          <Route path="login" element={<Placeholder title="Login" message="Login coming soon." />} />
          <Route path="register" element={<Placeholder title="Create Account" message="Registration coming soon." />} />
          <Route path="account" element={<Placeholder title="My Account" message="Account coming soon." />} />
          <Route path="account/orders" element={<Placeholder title="My Orders" message="Orders coming soon." />} />
          <Route path="admin/*" element={<Placeholder title="Admin" message="Admin area coming soon." />} />
          <Route path="*" element={<Placeholder title="Page not found" message="The page you are looking for does not exist." />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
