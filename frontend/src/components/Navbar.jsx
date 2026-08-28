import React from 'react';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'predict', label: 'Predict Price' },
    { id: 'explain', label: 'Local Explanation' },
    { id: 'model', label: 'Model Metrics' },
    { id: 'about', label: 'About Project' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        House Price Prediction XAI
      </div>
      <ul className="navbar-nav">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => setCurrentPage(item.id)}
              className={`navbar-link ${currentPage === item.id ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', font: 'inherit', padding: 0 }}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
