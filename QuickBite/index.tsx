
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global error handling to capture any startup issues
window.addEventListener('error', (event) => {
  console.error('Captured Global Error:', event.error);
});

const startApp = () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error("Critical: Could not find root element to mount to");
      return;
    }

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Critical Error during App Start:", err);
    // Display a basic UI if the app crashes instantly
    document.body.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: sans-serif;">
        <h1 style="color: #f97316;">QuickBite Chef Error</h1>
        <p>Something went wrong during startup. Please refresh or check your internet.</p>
        <pre style="font-size: 10px; color: #666; overflow-x: auto;">${err}</pre>
      </div>
    `;
  }
};

// Ensure app starts after the environment is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
