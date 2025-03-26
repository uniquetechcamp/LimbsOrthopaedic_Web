import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


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

export default function Services() {
  const [, navigate] = useLocation();

  const handleBooking = () => {
    navigate("/appointment");
  };

  const handleWhatsApp = (service: string) => {
    const message = encodeURIComponent(`Hello *LIMBS Orthopaedic*, I want ${service} ${window.location.href}`);
    window.open(`https://wa.me/254719628276?text=${message}`, '_blank');
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Our Services</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{service.description}</p>
              <div className="flex gap-2">
                <Button onClick={handleBooking}>
                  Book a Consultation <i className="fas fa-arrow-right ml-2"></i>
                </Button>
                <Button variant="outline" onClick={() => handleWhatsApp(service.title)}>
                  <i className="fas fa-whatsapp mr-2"></i>
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Home-Based Care Services</h2>
        <Card>
          <CardContent className="pt-6">
            <p>Our team extends its expertise to the comfort of your home. We provide professional care services—such as physical therapy, orthotic fittings, and follow-up consultations—right at your doorstep, ensuring convenience and personalized attention.</p>
            <Button className="mt-4" asChild>
              <a href="tel:+254719628276">Call Us +254719628276</a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}