import React, { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Role } from "@/hooks/useAuth";

interface RegisterModalProps {
  onLoginClick: () => void;
}

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  role: z.enum(["patient", "doctor", "owner"] as const),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterModal: React.FC<RegisterModalProps> = ({ onLoginClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "patient",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      
      const user = userCredential.user;
      
      // Save additional user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: data.name,
        role: data.role as Role,
        createdAt: new Date(),
      });
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully!",
      });
      
      // Redirect based on role
      if (data.role === "patient") {
        navigate("/profile");
      } else {
        navigate("/dashboard");
      }
      
    } catch (error: any) {
      console.error("Registration error:", error);
      
      let errorMessage = "Registration failed. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please use a different email or login.";
      }
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: "patient" as Role, // Default role for Google sign-up
        createdAt: new Date(),
      });
      
      toast({
        title: "Registration successful",
        description: "Your account has been created with Google!",
      });
      
      navigate("/profile");
      
    } catch (error) {
      console.error("Google registration error:", error);
      toast({
        title: "Registration failed",
        description: "There was an error signing up with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-gray-800">Create Account</DialogTitle>
        <DialogDescription>
          Fill in your details to create a new account
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your full name" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your email address" 
                    type="email"
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Create a strong password" 
                    type="password" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Confirm your password" 
                    type="password" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Register As</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="owner">Admin/Owner</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-[#34bdf2] hover:bg-[#2193c9]"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </Form>
      
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-gray-300 flex-grow"></div>
        <div className="mx-4 text-gray-500 text-sm">OR</div>
        <div className="border-t border-gray-300 flex-grow"></div>
      </div>
      
      <Button 
        type="button"
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
        onClick={handleGoogleRegister}
        disabled={isLoading}
      >
        <i className="fab fa-google text-red-500"></i> Sign up with Google
      </Button>
      
      <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
        <span className="text-center text-gray-600">
          Already have an account?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto text-[#34bdf2] hover:text-[#2193c9]"
            onClick={onLoginClick}
            disabled={isLoading}
          >
            Login
          </Button>
        </span>
      </DialogFooter>
    </DialogContent>
  );
};

export default RegisterModal;
