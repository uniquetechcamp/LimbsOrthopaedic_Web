import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@/hooks/useAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GradientText from "@/components/common/GradientText";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["patient", "doctor", "owner"] as const),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const Login: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordSubmitting, setForgotPasswordSubmitting] = useState(false);
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "patient",
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
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
          setIsSubmitting(false);
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
    } catch (error: any) {
      console.error("Login error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      toast({
        title: "Login failed",
        description: `Error: ${error.message || "Invalid email or password. Please try again."}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
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
    } catch (error: any) {
      console.error("Google login error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      toast({
        title: "Login failed",
        description: `Error: ${error.message || "There was an error signing in with Google"}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordFormValues) => {
    setForgotPasswordSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast({
        title: "Password reset email sent",
        description: "Check your email for instructions to reset your password.",
      });
      setShowForgotPassword(false);
    } catch (error: any) {
      console.error("Password reset error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      toast({
        title: "Password Reset Error",
        description: `Error: ${error.message || "There was a problem sending the password reset email"}`,
        variant: "destructive",
      });
    } finally {
      setForgotPasswordSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              <GradientText>Login to Your Account</GradientText>
            </h1>
            <p className="mt-2 text-gray-600">Enter your credentials to access your account</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-8">
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
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Button 
                    variant="link" 
                    type="button" 
                    className="p-0 h-auto text-[#34bdf2] text-sm hover:text-[#2193c9]"
                    onClick={() => setShowForgotPassword(true)}
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
                          disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">
                      <i className="fas fa-spinner fa-spin"></i>
                    </span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
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
            disabled={isSubmitting}
          >
            <i className="fab fa-google text-red-500"></i> Continue with Google
          </Button>
          
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#34bdf2] hover:text-[#2193c9] font-medium">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...forgotPasswordForm}>
            <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
              <FormField
                control={forgotPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email address" 
                        type="email"
                        {...field} 
                        disabled={forgotPasswordSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForgotPassword(false)}
                  disabled={forgotPasswordSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#34bdf2] hover:bg-[#2193c9]"
                  disabled={forgotPasswordSubmitting}
                >
                  {forgotPasswordSubmitting ? (
                    <>
                      <span className="mr-2">
                        <i className="fas fa-spinner fa-spin"></i>
                      </span>
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Login;
