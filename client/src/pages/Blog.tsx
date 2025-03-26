
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

const blogPosts = [
  {
    id: 1,
    title: "Understanding Prosthetic Options",
    category: "Education",
    date: "March 15, 2024",
    excerpt: "A comprehensive guide to modern prosthetic solutions and how to choose the right one for your needs.",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Latest Innovations in Orthotics",
    category: "Technology",
    date: "March 10, 2024",
    excerpt: "Exploring cutting-edge developments in orthotic technology and their impact on patient care.",
    image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b3e?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Living with a Prosthetic Limb",
    category: "Lifestyle",
    date: "March 5, 2024",
    excerpt: "Real stories and practical advice from individuals thriving with prosthetic limbs.",
    image: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=800&auto=format&fit=crop"
  }
];

export default function Blog() {
  return (
    <main>
      <div className="bg-gradient-to-r from-[#34bdf2] to-[#2193c9] py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white text-center">Our Blog</h1>
          <p className="text-xl text-white/90 mt-2 text-center">Latest News & Articles</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="h-48 relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-[#34bdf2]">{post.category}</span>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Button variant="outline" className="w-full">
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" variant="default">
            Load More Articles
          </Button>
        </div>
      </div>
    </main>
  );
}
