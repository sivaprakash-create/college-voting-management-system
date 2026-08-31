import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'primary', subtitle }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        {Icon && <Icon size={28} />}
      </div>
      <div>
        <h6 className="text-secondary fw-semibold mb-1 text-uppercase fs-xs tracking-wider">
          {title}
        </h6>
        <h3 className="fw-extrabold mb-0">{value}</h3>
        {subtitle && <p className="text-muted fs-xs mb-0 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;
