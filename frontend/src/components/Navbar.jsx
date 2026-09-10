import React from 'react';
import { Home, Sparkles, Sliders, BarChart2, Info } from 'lucide-react';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'home', label: 'Overview', icon: Home },
    { id: 'predict', label: 'Valuation Tool', icon: Sparkles },
    { id: 'explain', label: 'Price Breakdown', icon: Sliders },
    { id: 'model', label: 'Market Insights', icon: BarChart2 },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="navbar-brand-icon">
          <Home size={20} />
        </div>
        <span>HomeValuer</span>
      </div>
      
      <ul className="navbar-nav">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => setCurrentPage(item.id)}
                className={`navbar-link ${isActive ? 'active' : ''}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'none',
                  border: 'none'
                }}
              >
                <IconComponent size={16} />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
