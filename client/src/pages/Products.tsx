
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GradientText from "@/components/common/GradientText";

const products = [
  {
    id: "wheelchairs",
    name: "Wheelchairs",
    description: "A wide range of wheelchairs suited for different age groups and mobility needs, from basic manual models to high-performance sports chairs.",
    image: "https://images.unsplash.com/photo-1611242320536-f12d3541249b?q=80&w=800&auto=format&fit=crop",
    price: 50000,
    salePrice: 45000,
    link: "/products/wheelchairs"
  },
  {
    id: "walking-frames",
    name: "Walking Frames",
    description: "Lightweight and stable frames that offer support and balance, ideal for patients recovering from surgery or experiencing limited mobility.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop",
    price: 15000,
    salePrice: 12000,
    link: "/products/walking-frames"
  },
  {
    id: "crutches",
    name: "Crutches",
    description: "Ergonomically designed crutches that help redistribute weight and support ambulation during recovery or long-term mobility challenges.",
    image: "https://images.unsplash.com/photo-1584515848543-f3b218b91448?q=80&w=800&auto=format&fit=crop",
    price: 8000,
    salePrice: 6500,
    link: "/products/crutches"
  },
  {
    id: "sticks-canes",
    name: "Sticks/Canes",
    description: "A variety of canes and walking sticks, each tailored to different grip styles and height requirements for optimal stability.",
    image: "https://images.unsplash.com/photo-1599056407101-7c557a4a0144?q=80&w=800&auto=format&fit=crop",
    price: 3000,
    salePrice: 2500,
    link: "/products/sticks-canes"
  },
  {
    id: "special-seats-cp",
    name: "Special Seats for Cerebral Palsy (C.P.)",
    description: "Custom seating systems that provide support, comfort, and correct posture for individuals with cerebral palsy or other conditions affecting trunk control.",
    image: "https://images.unsplash.com/photo-1535572290543-960a8046f5af?q=80&w=800&auto=format&fit=crop",
    price: 25000,
    salePrice: 22000,
    link: "/products/special-seats-cp"
  },
  {
    id: "diabetic-footwear",
    name: "Diabetic Footwear",
    description: "Specialized shoes designed to protect diabetic feet from ulcers, pressure points, and other complications, featuring breathable materials and supportive insoles.",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop",
    price: 18000,
    salePrice: 15000,
    link: "/products/diabetic-footwear"
  },
  {
    id: "standing-frames",
    name: "Standing Frames",
    description: "Assistive devices that enable users to maintain a standing position for improved circulation, bone density, and overall well-being.",
    image: "https://images.unsplash.com/photo-1584516150909-c43483ee7932?q=80&w=800&auto=format&fit=crop",
    price: 30000,
    salePrice: 28000,
    link: "/products/standing-frames"
  }
];

export default function Products() {
  const [, navigate] = useLocation();

  const handleWhatsApp = (productName: string, productLink: string) => {
    const message = encodeURIComponent(`Hello *LIMBS Orthopaedic*, I want to buy ${productName} ${window.location.origin}${productLink}`);
    window.open(`https://wa.me/254719628276?text=${message}`, '_blank');
  };

  return (
    <main>
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              <GradientText>Our Products</GradientText>
            </h1>
            <p className="text-xl text-gray-600 mt-2">Quality Mobility Solutions</p>
            <p className="text-gray-700 text-lg max-w-4xl mx-auto mt-4">
              Explore our comprehensive range of mobility aids and orthopedic solutions. Each product is carefully selected to provide maximum comfort, support, and independence.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col">
              <div className="h-48 sm:h-56 md:h-64 relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="mb-4 text-sm md:text-base flex-1">{product.description}</p>
                {product.price && (
                  <div className="mb-4">
                    <span className="text-lg font-semibold text-gray-900">
                      {product.salePrice && (
                        <span className="line-through text-gray-500 mr-2">
                          KES {product.price.toLocaleString()}
                        </span>
                      )}
                      {product.salePrice && `KES ${product.salePrice.toLocaleString()}`}
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-2 mt-auto">
                  <Button onClick={() => navigate(product.link)} className="w-full">
                    Know More <i className="fas fa-arrow-right ml-2"></i>
                  </Button>
                  <Button 
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white" 
                    onClick={() => handleWhatsApp(product.name, product.link)}
                  >
                    <i className="fab fa-whatsapp mr-2"></i>
                    Order on WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
