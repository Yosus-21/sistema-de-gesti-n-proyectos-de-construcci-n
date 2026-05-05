import { NavLink } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { getSidebarConfig } from '../../shared/utils/permissions';
import suarqLogo from '../../assets/logos/suarq-logo.png';
import './layout.css';

export const Sidebar = () => {
  const { user } = useAuth();
  const sidebarConfig = getSidebarConfig(user?.rol);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="admin-logo">
          <img
            src={suarqLogo}
            alt="SuArq"
            className="admin-logo-image"
          />
        </div>
      </div>
      <nav className="sidebar-nav">
        {sidebarConfig.map((group, groupIdx) => (
          <div key={groupIdx} className="nav-group">
            <h3>{group.title}</h3>
            {group.items.map((item, itemIdx) => (
              <NavLink 
                key={itemIdx} 
                to={item.to} 
                className={({isActive}) => isActive ? "active" : ""}
                end={item.to === '/dashboard'}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};
