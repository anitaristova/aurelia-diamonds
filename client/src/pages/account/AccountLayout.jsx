import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Icon from '../../components/Icon.jsx';

export default function AccountLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="container account">
      <aside className="account__sidebar">
        <NavLink to="/account" end className="account__nav-link">
          <Icon name="account" size={18} />
          <span>My Account</span>
        </NavLink>
        <NavLink to="/account/orders" className="account__nav-link">
          <Icon name="cart" size={18} />
          <span>My Orders</span>
        </NavLink>
        <button type="button" className="account__nav-link account__logout" onClick={handleLogout}>
          <span>Logout</span>
        </button>
      </aside>
      <section className="account__content">
        <Outlet />
      </section>
    </div>
  );
}
