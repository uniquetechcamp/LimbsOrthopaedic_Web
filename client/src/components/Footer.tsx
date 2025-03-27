import React from 'react';

function Footer({ links }) {
  return (
    <footer className="bg-gray-100 p-4">
      <nav className="flex justify-center space-x-4">
        {links.map((link) => (
          <span key={link.href} className="hover:underline cursor-pointer">
            {link.label}
          </span>
        ))}
      </nav>
    </footer>
  );
}

export default Footer;