import { StrictMode } from 'react';  // StrictMode is used to highlight potential problems in your app during development.
import { createRoot } from 'react-dom/client';  // createRoot is used for rendering the root of the React app.
import App from './App.tsx';  // Import the App component from the 'App.tsx' file.
import './index.css';  // Import the global CSS styles for the app.

createRoot(document.getElementById('root')!).render(  // Find the 'root' element in the HTML and render the app inside it.
  <StrictMode>
    <App />  // The root component of the application, rendering the App component.
  </StrictMode>
);
