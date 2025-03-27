
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function NetworkError() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRetrying && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0) {
      window.location.reload();
    }
    return () => clearInterval(timer);
  }, [isRetrying, countdown]);

  const handleRetry = () => {
    setIsRetrying(true);
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <img 
          src="/NO_NETWORK_LIMBS_Orthopaedic.png"
          alt="Network Error"
          className="w-32 h-32 mx-auto mb-6"
        />
        <h2 className="text-xl font-semibold mb-4">Connection Lost</h2>
        <p className="text-gray-600 mb-6">
          Please check your internet connection and try again
        </p>
        {isRetrying ? (
          <p className="text-sm text-gray-500">
            Retrying in {countdown} seconds...
          </p>
        ) : (
          <Button
            onClick={handleRetry}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Retry Connection
          </Button>
        )}
      </div>
    </div>
  );
}
