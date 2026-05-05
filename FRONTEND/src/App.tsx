import { AppProviders } from './app/providers/AppProviders';
import { AppRouter } from './app/router/AppRouter';
import './shared/styles/variables.css';
import './shared/styles/reset.css';
import './shared/styles/forms.css';
import './shared/styles/tables.css';
import './index.css';

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;
