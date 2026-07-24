import Icon from '../Icon.jsx';
import { SERVICE_BENEFITS } from '../../constants/navigation.js';

const icons = ['truck', 'support', 'shield', 'gift'];

export default function ServiceBenefits() {
  return (
    <section className="benefits" aria-label="Store benefits">
      <div className="benefits__inner">
        {SERVICE_BENEFITS.map((benefit, i) => (
          <div key={benefit.title} className="benefits__item">
            <Icon name={icons[i]} size={26} strokeWidth={1.2} />
            <div>
              <p className="benefits__title">{benefit.title}</p>
              <p className="benefits__subtitle">{benefit.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
