import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
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

interface ForgotPasswordModalProps {
  onBackToLogin: () => void;
}

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onBackToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password",
      });
      
      onBackToLogin();
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: "There was a problem sending the password reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-gray-800">Reset Password</DialogTitle>
        <DialogDescription>
          Enter your email address and we'll send you a link to reset your password.
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
          
          <Button 
            type="submit" 
            className="w-full bg-[#34bdf2] hover:bg-[#2193c9]"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </Form>
      
      <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
        <span className="text-center text-gray-600">
          Remember your password?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto text-[#34bdf2] hover:text-[#2193c9]"
            onClick={onBackToLogin}
            disabled={isLoading}
          >
            Back to Login
          </Button>
        </span>
      </DialogFooter>
    </DialogContent>
  );
};

export default ForgotPasswordModal;
