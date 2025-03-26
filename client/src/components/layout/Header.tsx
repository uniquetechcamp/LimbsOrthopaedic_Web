import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Products", href: "/products" },
    { name: "Contact", href: "/contact" },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const showLoginModal = () => {
    setLoginModalOpen(true);
    setRegisterModalOpen(false);
    setMobileMenuOpen(false);
  };

  const showRegisterModal = () => {
    setRegisterModalOpen(true);
    setLoginModalOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3">
                <img 
                  src="https://i.imgur.com/nYMdNhO.jpg" 
                  alt="LIMBS Orthopaedic Logo" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#34bdf2] shadow-sm"
                />
                <div>
                  <span className="text-xl font-bold text-primary">LIMBS</span>
                  <span className="text-xl font-medium">Orthopaedic</span>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 items-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  to={link.href}
                  className={`text-gray-800 hover:text-[#34bdf2] font-medium transition ${location === link.href ? 'text-[#34bdf2]' : ''}`}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/appointment"
                className="px-4 py-2 bg-[#34bdf2] text-white rounded-md hover:bg-[#2193c9] transition"
              >
                Book Appointment
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                        <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user.role === "patient" && (
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="w-full">
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {(user.role === "doctor" || user.role === "owner") && (
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="w-full">
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="outline" 
                  className="ml-2 px-4 py-2 border border-[#34bdf2] text-[#34bdf2] rounded-md hover:bg-[#34bdf2] hover:text-white transition"
                  onClick={showLoginModal}
                >
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-500 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden pb-4 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  to={link.href}
                  className={`text-gray-800 hover:text-[#34bdf2] font-medium transition py-2 ${location === link.href ? 'text-[#34bdf2]' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/appointment"
                className="px-4 py-2 bg-[#34bdf2] text-white rounded-md hover:bg-[#2193c9] transition inline-block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Appointment
              </Link>

              {user ? (
                <>
                  {user.role === "patient" && (
                    <Link 
                      to="/profile"
                      className="px-4 py-2 text-gray-800 hover:text-[#34bdf2] transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                  )}
                  {(user.role === "doctor" || user.role === "owner") && (
                    <Link 
                      to="/dashboard"
                      className="px-4 py-2 text-gray-800 hover:text-[#34bdf2] transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button 
                    className="px-4 py-2 text-gray-800 hover:text-[#34bdf2] transition text-left"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  className="mt-2 px-4 py-2 border border-[#34bdf2] text-[#34bdf2] rounded-md hover:bg-[#34bdf2] hover:text-white transition"
                  onClick={showLoginModal}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <LoginModal onRegisterClick={showRegisterModal} />
      </Dialog>

      <Dialog open={registerModalOpen} onOpenChange={setRegisterModalOpen}>
        <RegisterModal onLoginClick={showLoginModal} />
      </Dialog>
    </>
  );
};

export default Header;