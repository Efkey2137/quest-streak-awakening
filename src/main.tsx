import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './service-worker-registration'

// Register service worker for offline capability
registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
