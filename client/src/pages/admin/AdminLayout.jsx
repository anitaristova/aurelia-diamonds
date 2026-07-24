import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="container admin">
      <div className="admin__head">
        <h1 className="admin__title">Admin</h1>
        <nav className="admin__nav">
          <NavLink to="/admin" end className="admin__nav-link">
            Products
          </NavLink>
          <NavLink to="/admin/orders" className="admin__nav-link">
            Orders
          </NavLink>
        </nav>
      </div>
      <Outlet />
    </div>
  );
}
