import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';

// Super admin authentication schema
const authSchema = z.object({
  secretKey: z.string().min(1, { message: "Secret key is required" }),
});

type AuthFormValues = z.infer<typeof authSchema>;

const AdminAuth: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      secretKey: '',
    },
  });

  const onSubmit = async (data: AuthFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simple validation with a hardcoded secret key
      const correctKey = "LIMBS-ORTHO-ADMIN-2024";
      
      if (data.secretKey === correctKey) {
        // Set local storage flag for temporary access
        localStorage.setItem('adminAccess', 'granted');
        
        toast({
          title: "Access Granted",
          description: "You now have temporary access to admin functions",
        });
        
        // Redirect to the superuser creation page
        navigate('/admin/superusers');
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid secret key",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Authentication Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Authentication</CardTitle>
          <CardDescription>
            This area is restricted to system administrators only.
            Enter the secret key to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="secretKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret Key</FormLabel>
                    <FormControl>
                      <PasswordInput 
                        placeholder="Enter the administrator secret key" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">
                      <i className="fas fa-spinner fa-spin"></i>
                    </span>
                    Authenticating...
                  </>
                ) : (
                  "Authenticate"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
          >
            Return to Homepage
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminAuth;