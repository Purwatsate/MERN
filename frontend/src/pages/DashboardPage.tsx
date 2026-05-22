import { Link } from 'react-router-dom';
import { DASHBOARD } from '../constants/my';

const cards = [
  { to: '/people', title: DASHBOARD.people, desc: 'သံသယရှိသူ၊ တရားခံ၊ သက်သေ မှတ်တမ်းများ', icon: '👤' },
  { to: '/incidents', title: DASHBOARD.incidents, desc: 'အမှုတွဲ နှင့် အခြေအနေ စီမံခန့်ခွဲမှု', icon: '📋' },
  { to: '/records', title: DASHBOARD.records, desc: 'လူပုဂ္ဂိုလ် နှင့် အမှုချိတ်ဆက်မှု', icon: '🔗' },
  { to: '/vehicles', title: DASHBOARD.vehicles, desc: 'ယာဉ် နှင့် ပိုင်ရှင် အချက်အလက်', icon: '🚗' },
];

export function DashboardPage() {
  return (
    <div className="page">
      <header className="page-header">
        <h2>{DASHBOARD.title}</h2>
        <p>{DASHBOARD.subtitle}</p>
      </header>
      <div className="dashboard-grid">
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className="dashboard-card">
            <span className="card-icon">{card.icon}</span>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            <span className="card-link">ဆက်လက်ကြည့်ရန် →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
