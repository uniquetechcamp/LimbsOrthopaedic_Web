import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useAuth as useAuthContext } from "@/contexts/AuthContext";

export type Role = "patient" | "doctor" | "owner";

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: Role;
}

export function useAuth() {
  const context = useAuthContext();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return {
    ...context,
    user: context.user,
    logout: handleLogout,
  };
}
