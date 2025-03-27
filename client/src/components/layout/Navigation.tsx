import React from 'react';
import { AuthProvider } from './context/AuthContext'; // Assuming this context exists
import Router from './components/Router'; // Assuming this router component exists

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;

// Example of how the navigation component might look after changes

import Link from 'next/link'; // Or your preferred routing library

const Navigation = ({ links }) => {
  return (
    <nav>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-primary">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;