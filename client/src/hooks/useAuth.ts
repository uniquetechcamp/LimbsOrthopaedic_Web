import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { User, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useToast } from "@/hooks/use-toast";

export type Role = "patient" | "doctor" | "owner";

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: Role;
}

export function useAuth() {
  const context = useContext(AuthContext);
  const { toast } = useToast();
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
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
