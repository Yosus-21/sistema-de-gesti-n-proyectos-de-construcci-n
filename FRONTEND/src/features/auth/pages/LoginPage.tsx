import { LoginForm } from '../components/LoginForm';
import suarqLogo from '../../../assets/logos/suarq-logo.png';
import '../styles/auth.css';

export const LoginPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="login-logo">
          <img
            src={suarqLogo}
            alt="SuArq"
            className="login-logo-image"
          />
        </div>
        <p>Sistema de Gestión de Proyectos de Construcción</p>
      </div>
      <LoginForm />
    </div>
  );
};
