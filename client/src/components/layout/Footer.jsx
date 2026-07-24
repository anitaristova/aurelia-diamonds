import ServiceBenefits from './ServiceBenefits.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <ServiceBenefits />
      <div className="footer__copyright">
        © {new Date().getFullYear()} Aurelia Diamonds. All rights reserved.
      </div>
    </footer>
  );
}
