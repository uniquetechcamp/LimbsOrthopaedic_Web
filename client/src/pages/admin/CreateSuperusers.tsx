import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Role } from '@/hooks/useAuth';
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
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { PasswordInput } from '@/components/ui/password-input';
import { CheckCircle2, AlertCircle } from 'lucide-react';

// Validation schema for admin creation form
const adminSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type AdminFormValues = z.infer<typeof adminSchema>;

// Predefined owners
const predefinedOwners = [
  {
    name: 'Lawrence Otieno',
    email: 'cybertechocean@gmail.com',
    password: 'L@HhZ5LGZYkr1d.KtzFxXUmP'
  },
  {
    name: 'Collins Otieno',
    email: 'collinsokoth71@gmail.com',
    password: 'Col!Rtpz7L@HKt3Ts'
  }
];

const CreateSuperusers: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingPredefined, setIsCreatingPredefined] = useState(false);
  const [createdUsers, setCreatedUsers] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    // Check for authorization first (this is a simple check)
    const adminAccess = localStorage.getItem('adminAccess');
    if (adminAccess !== 'granted') {
      navigate('/admin/auth');
    }
  }, []);

  const onSubmit = async (data: AdminFormValues) => {
    setIsSubmitting(true);
    try {
      // Create the user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, {
        displayName: data.fullName,
      });
      
      // Save additional user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: data.fullName,
        role: 'owner' as Role,
        createdAt: new Date(),
      });
      
      toast({
        title: "Admin Account Created",
        description: `Successfully created admin account for ${data.fullName}`,
      });
      
      // Reset form
      form.reset();
      
    } catch (error: any) {
      console.error("Error creating admin:", error);
      toast({
        title: "Error Creating Admin",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const createPredefinedOwners = async () => {
    setIsCreatingPredefined(true);
    setCreatedUsers([]);
    setErrors([]);
    
    for (const owner of predefinedOwners) {
      try {
        // Create the user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          owner.email,
          owner.password
        );
        
        const user = userCredential.user;
        
        // Update profile with display name
        await updateProfile(user, {
          displayName: owner.name,
        });
        
        // Save additional user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: owner.name,
          role: 'owner' as Role,
          createdAt: new Date(),
        });
        
        setCreatedUsers(prev => [...prev, owner.email]);
        
      } catch (error: any) {
        console.error(`Error creating admin ${owner.email}:`, error);
        if (error.code === 'auth/email-already-in-use') {
          setCreatedUsers(prev => [...prev, owner.email + " (already exists)"]);
        } else {
          setErrors(prev => [...prev, `${owner.email}: ${error.message}`]);
        }
      }
    }
    
    toast({
      title: "Process Complete",
      description: `Created ${createdUsers.length} out of ${predefinedOwners.length} admin accounts`,
    });
    
    setIsCreatingPredefined(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Account Setup</h1>
        <p className="text-gray-600">Create superuser/owner accounts for the LIMBS Orthopaedic system</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Predefined Owners Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create Predefined Owners</CardTitle>
            <CardDescription>
              Create the two predefined owner accounts for system administrators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {predefinedOwners.map((owner, index) => (
                <li key={index} className="flex items-start space-x-2 p-2 rounded bg-gray-50">
                  <div className="mt-1 text-gray-600">
                    {createdUsers.some(email => email.includes(owner.email)) ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-gray-300"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{owner.name}</p>
                    <p className="text-sm text-gray-600">{owner.email}</p>
                  </div>
                </li>
              ))}
            </ul>
            
            {errors.length > 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Errors</AlertTitle>
                <AlertDescription>
                  <ul className="text-sm list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={createPredefinedOwners} 
              className="w-full"
              disabled={isCreatingPredefined}
            >
              {isCreatingPredefined ? (
                <>
                  <span className="mr-2">
                    <i className="fas fa-spinner fa-spin"></i>
                  </span>
                  Creating Accounts...
                </>
              ) : (
                "Create Predefined Owners"
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Custom Admin Creation Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create Custom Admin</CardTitle>
            <CardDescription>
              Create a custom administrator account with owner privileges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter admin full name" {...field} />
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
                          placeholder="Enter admin email" 
                          type="email" 
                          {...field} 
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
                        <PasswordInput
                          placeholder="Create a strong password"
                          {...field}
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
                        <PasswordInput
                          placeholder="Confirm password"
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
                      Creating Account...
                    </>
                  ) : (
                    "Create Admin Account"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 text-center">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
        >
          Return to Homepage
        </Button>
      </div>
    </div>
  );
};

export default CreateSuperusers;