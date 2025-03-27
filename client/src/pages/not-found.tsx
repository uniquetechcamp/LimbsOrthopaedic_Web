
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="w-full flex items-center justify-center bg-gray-50 py-12">
      <Card className="w-full max-w-md mx-4 my-8">
        <CardContent className="py-8 flex flex-col items-center">
          <img 
            src="https://i.imgur.com/MoQBpLt.png" 
            alt="404 Error" 
            className="w-full h-auto max-w-[300px] md:max-w-[400px] mb-6"
          />
          
          <Link 
            href="/" 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            Go Back to Home Page <ChevronLeft className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
