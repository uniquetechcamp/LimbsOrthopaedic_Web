
import { Link } from "wouter";
import GradientText from "@/components/common/GradientText";

const Footer = () => {
  const footerLinks = {
    Services: [
      { href: '/services#checkup', label: 'Regular Checkup' },
      { href: '/services#therapy', label: 'Physical Therapy' },
      { href: '/services#consultation', label: 'Online Consultation' },
      { href: '/services#emergency', label: 'Emergency Care' },
    ],
    Resources: [
      { href: '/blog', label: 'Blog' },
      { href: '/testimonials', label: 'Testimonials' },
      { href: '/faqs', label: 'FAQs' },
      { href: '/contact', label: 'Contact' },
    ],
    Company: [
      { href: '/about', label: 'About Us' },
      { href: '/team', label: 'Our Team' },
      { href: '/careers', label: 'Careers' },
      { href: '/privacy', label: 'Privacy Policy' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              <GradientText>LIMBS</GradientText>
            </h2>
            <p className="text-gray-400">
              Providing quality orthopaedic care and helping you maintain optimal bone and joint health.
            </p>
          </div>
          
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-lg font-semibold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} LIMBS Orthopaedic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
