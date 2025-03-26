import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Artificial Limbs (Lower & Upper Limbs)",
      description: "We provide custom prosthetic solutions for individuals with limb differences, focusing on functionality, comfort, and an improved quality of life. Our prostheses are designed using advanced materials to ensure durability and ease of use.",
      id: "artificial-limbs"
    },
    {
      title: "Rickets",
      description: "Our specialists diagnose and manage rickets, a condition often caused by vitamin D deficiency. We offer corrective procedures, nutritional guidance, and orthotic solutions to support proper bone growth.",
      id: "rickets"
    },
    {
      title: "Prosthetic Limbs",
      description: "Our custom-made artificial legs and hands are designed to restore functionality and independence. We tailor each prosthetic to match the unique requirements of our patients.",
      id: "prosthetic-limbs"
    },
    {
      title: "Orthotic Insoles for Flat Feet",
      description: "Specialized insoles that provide support and correct flat foot conditions, ensuring comfort and proper alignment throughout your day.",
      id: "orthotics-flat-feet"
    },
    {
      title: "Orthopedic Footwear",
      description: "Customized shoes designed to address various foot-related issues, delivering optimal support and lasting comfort.",
      id: "orthopedic-footwear"
    },
    {
      title: "Corrective Shoes",
      description: "Tailored footwear solutions that help correct specific foot deformities or conditions, enhancing mobility and reducing pain.",
      id: "corrective-shoes"
    },
    {
      title: "Diabetic Footwear",
      description: "Specialized shoes crafted to protect diabetic patients' feet, minimizing the risk of ulcers and other complications.",
      id: "diabetic-footwear"
    },
    {
      title: "Custom Braces",
      description: "Supportive braces designed for specific joint conditions, helping to stabilize areas of weakness and promote proper healing.",
      id: "custom-braces"
    }
  ];

  const handleWhatsApp = (service: any) => {
    const message = `Hello *LIMBS Orthopaedic*, I want ${service.title} ${window.location.href}#${service.id}`;
    window.open(`https://wa.me/254719628276?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Our Services</h1>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Treatment for Various Conditions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="p-6" id={service.id}>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex gap-3">
                <Button 
                  onClick={() => navigate('/appointment')}
                  className="bg-[#34bdf2] hover:bg-[#2193c9]"
                >
                  Book a Consultation →
                </Button>
                <Button 
                  onClick={() => handleWhatsApp(service)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <i className="fab fa-whatsapp" /> Order on WhatsApp
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Home-Based Care Services</h2>
        <Card className="p-6">
          <p className="text-gray-600 mb-4">
            Our team extends its expertise to the comfort of your home. We provide professional care services—such as physical therapy, orthotic fittings, and follow-up consultations—right at your doorstep, ensuring convenience and personalized attention.
          </p>
          <Button 
            onClick={() => window.location.href = 'tel:+254719628276'}
            className="bg-[#34bdf2] hover:bg-[#2193c9]"
          >
            Call Us +254719628276
          </Button>
        </Card>
      </section>
    </div>
  );
};

export default Services;