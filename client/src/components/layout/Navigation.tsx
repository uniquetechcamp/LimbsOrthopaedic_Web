
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const { user } = useAuth();

  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/products', label: 'Products' },
    { href: '/blog', label: 'Blog' },
    { href: '/testimonials', label: 'Testimonials' },
    { href: '/contact', label: 'Contact' },
  ];

  const authLinks = user ? [
    { href: '/profile', label: 'Profile' },
    { href: '/appointment', label: 'Book Appointment' },
    ...(user.role === 'doctor' ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
    ...(user.role === 'owner' ? [{ href: '/dashboard/doctors', label: 'Manage Doctors' }] : []),
  ] : [
    { href: '/login', label: 'Login' },
    { href: '/register', label: 'Register' },
  ];

  return (
    <nav className="hidden md:flex space-x-6">
      {navigationLinks.map((link) => (
        <Link 
          key={link.href} 
          href={link.href}
          className="text-gray-600 hover:text-primary transition-colors"
        >
          {link.label}
        </Link>
      ))}
      
      {authLinks.map((link) => (
        <Link 
          key={link.href} 
          href={link.href}
          className="text-gray-600 hover:text-primary transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
