
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 flex flex-col items-center">
          <img 
            src="https://i.imgur.com/MoQBpLt.png" 
            alt="404 Error" 
            className="w-full h-auto max-w-[300px] md:max-w-[400px] mb-6"
          />
          
          <Link 
            to="/" 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            Go Back to Home Page <ChevronLeft className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
