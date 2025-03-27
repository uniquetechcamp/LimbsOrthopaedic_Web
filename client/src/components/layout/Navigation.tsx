
import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const { user, role } = useAuth();

  return (
    <nav className="hidden md:flex space-x-8">
      <Link href="/">
        <span className="nav-link">Home</span>
      </Link>
      <Link href="/about">
        <span className="nav-link">About</span>
      </Link>
      <Link href="/services">
        <span className="nav-link">Services</span>
      </Link>
      <Link href="/products">
        <span className="nav-link">Products</span>
      </Link>
      <Link href="/blog">
        <span className="nav-link">Blog</span>
      </Link>
      <Link href="/testimonials">
        <span className="nav-link">Testimonials</span>
      </Link>
      <Link href="/contact">
        <span className="nav-link">Contact</span>
      </Link>
      {!user ? (
        <>
          <Link href="/login">
            <span className="nav-link">Login</span>
          </Link>
          <Link href="/register">
            <span className="nav-link">Register</span>
          </Link>
        </>
      ) : (
        <>
          <Link href="/profile">
            <span className="nav-link">Profile</span>
          </Link>
          {(role === 'doctor' || role === 'owner') && (
            <Link href="/dashboard">
              <span className="nav-link">Dashboard</span>
            </Link>
          )}
        </>
      )}
    </nav>
  );
};

export default Navigation;
