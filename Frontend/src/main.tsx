import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey='pk_test_cHJvdWQtc2FsbW9uLTkzLmNsZXJrLmFjY291bnRzLmRldiQ' afterSignOutUrl="/">
      <Router>    
        <App />
      </Router>
    </ClerkProvider>
  </StrictMode>,
);