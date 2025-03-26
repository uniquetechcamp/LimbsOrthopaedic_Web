import React, { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Role } from "@/hooks/useAuth";

interface LoginModalProps {
  onRegisterClick: () => void;
}

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["patient", "doctor", "owner"] as const),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginModal: React.FC<LoginModalProps> = ({ onRegisterClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "patient",
    },
  });

  const handleForgotPassword = () => {
    toast({
      title: "Password Reset",
      description: "Please use the Register modal and click on 'Forgot Password'",
    });
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      // Verify user role
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role !== data.role) {
          toast({
            title: "Invalid role",
            description: `You're not registered as a ${data.role}. Please select the correct role.`,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back to LIMBS Orthopaedic!",
      });
      
      // Redirect based on role
      if (data.role === "patient") {
        navigate("/profile");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        // Set default role to patient if first time login
        const role: Role = "patient";
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: role,
          createdAt: new Date(),
        });
        
        toast({
          title: "Account created successfully",
          description: "Welcome to LIMBS Orthopaedic!",
        });
        
        navigate("/profile");
      } else {
        // User exists, get their role and redirect
        const userData = userDoc.data();
        
        toast({
          title: "Login successful",
          description: "Welcome back to LIMBS Orthopaedic!",
        });
        
        if (userData.role === "patient") {
          navigate("/profile");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: "Login failed",
        description: "There was an error signing in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-gray-800">Login</DialogTitle>
        <DialogDescription>
          Enter your credentials to access your account
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <FormLabel>Password</FormLabel>
              <Button 
                variant="link" 
                type="button" 
                className="p-0 h-auto text-[#34bdf2] text-sm hover:text-[#2193c9]"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </Button>
            </div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Enter your password" 
                      type="password" 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Login As</FormLabel>
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
            {isLoading ? "Logging in..." : "Login"}
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
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <i className="fab fa-google text-red-500"></i> Continue with Google
      </Button>
      
      <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
        <span className="text-center text-gray-600">
          Don't have an account?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto text-[#34bdf2] hover:text-[#2193c9]"
            onClick={onRegisterClick}
            disabled={isLoading}
          >
            Register now
          </Button>
        </span>
      </DialogFooter>
    </DialogContent>
  );
};

export default LoginModal;
