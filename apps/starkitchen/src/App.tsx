import './App.css';
import { FreechApp } from './components/FreechApp';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { StarknetProvider } from './providers/StarknetProvider';

const App = () => (
  <ErrorBoundary>
    <StarknetProvider>
      <FreechApp />
    </StarknetProvider>
  </ErrorBoundary>
);

export default App;
