import { Link } from "wouter";
import NeumorphicButton from "@/components/common/NeumorphicButton";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://i.imgur.com/V6XTdBi.jpg" 
                alt="LIMBS Orthopaedic Logo" 
                className="w-12 h-12 rounded-full object-cover border-2 border-[#34bdf2] shadow-sm"
              />
              <h3 className="text-xl font-bold">LIMBS Orthopaedic</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Improving mobility and quality of life through innovative prosthetic and orthotic solutions.
            </p>
            <div className="flex space-x-4 mb-4">
              <a href="https://facebook.com/LimbsOrthopaedic" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com/LimbsOrthopaedic" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com/LimbsOrthopaedic" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com/company/LimbsOrthopaedic" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <a 
              href="https://wa.me/254719628276" 
              target="_blank" 
              rel="noreferrer" 
              className="px-4 py-2 bg-[#25D366] text-white rounded-md hover:bg-opacity-90 transition inline-flex items-center gap-2"
            >
              <i className="fab fa-whatsapp"></i>
              WhatsApp Us
            </a>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white transition">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-400 hover:text-white transition">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-gray-400 hover:text-white transition">Services</a>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <a className="text-gray-400 hover:text-white transition">Products</a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="text-gray-400 hover:text-white transition">Blog</a>
                </Link>
              </li>
              <li>
                <Link href="/testimonials">
                  <a className="text-gray-400 hover:text-white transition">Testimonials</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-400 hover:text-white transition">Contact</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Products & Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products">
                  <a className="text-gray-400 hover:text-white transition">All Products</a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-gray-400 hover:text-white transition">Prosthetic Limbs</a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-gray-400 hover:text-white transition">Orthotic Insoles</a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-gray-400 hover:text-white transition">Orthopedic Footwear</a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-gray-400 hover:text-white transition">Corrective Shoes</a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-gray-400 hover:text-white transition">Diabetic Footwear</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-[#34bdf2]"></i>
                <span className="text-gray-400">Kasarani, Nairobi, Kenya</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone mt-1 mr-3 text-[#34bdf2]"></i>
                <span className="text-gray-400">+254 719 628 276</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-3 text-[#34bdf2]"></i>
                <span className="text-gray-400">info@limbsorthopaedic.com</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-clock mt-1 mr-3 text-[#34bdf2]"></i>
                <span className="text-gray-400">Mon-Fri: 8am - 6pm<br/>Sat: 9am - 2pm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; {currentYear} LIMBS Orthopaedic. All rights reserved.
            </p>
            <div className="flex flex-wrap space-x-4 md:space-x-6">
              <Link href="/privacy-policy">
                <a className="text-gray-400 hover:text-white transition">Privacy Policy</a>
              </Link>
              <Link href="/terms-of-service">
                <a className="text-gray-400 hover:text-white transition">Terms of Service</a>
              </Link>
              <Link href="/faq">
                <a className="text-gray-400 hover:text-white transition">FAQ</a>
              </Link>
              <Link href="/careers">
                <a className="text-gray-400 hover:text-white transition">Careers</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;