import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import GradientText from "@/components/common/GradientText";
import { useLocation } from "wouter";

const appointmentSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  service: z.string().min(1, { message: "Please select a service" }),
  date: z.string().min(1, { message: "Please select a date" }),
  time: z.string().min(1, { message: "Please select a time" }),
  message: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

const AppointmentBooking: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [location, navigate] = useLocation();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      fullName: user?.displayName || "",
      email: user?.email || "",
      phone: "",
      service: "",
      date: "",
      time: "",
      message: "",
    }
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    setIsSubmitting(true);
    try {
      // Add appointment to Firestore
      await addDoc(collection(db, "appointments"), {
        ...data,
        userId: user?.uid || null,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      
      toast({
        title: "Appointment Booked",
        description: "Your appointment request has been submitted. We will contact you shortly to confirm.",
      });
      
      // Reset form
      form.reset();
      
      // Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Error",
        description: "There was a problem booking your appointment. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      {/* Page Header */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">
            <GradientText>Book an Appointment</GradientText>
          </h1>
          <p className="text-xl text-gray-600 mt-2">Schedule a Consultation with Our Specialists</p>
        </div>
      </div>

      {/* Appointment Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Your Appointment</h2>
              <p className="text-gray-700 mb-6">
                Fill out the form below to schedule a consultation with our specialists. We'll contact you to confirm your appointment time.
              </p>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Why Choose LIMBS Orthopaedic?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <i className="fas fa-check-circle mt-1 mr-3 text-[#34bdf2]"></i>
                    <span>Personalized care tailored to your specific needs</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle mt-1 mr-3 text-[#34bdf2]"></i>
                    <span>State-of-the-art technology and materials</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle mt-1 mr-3 text-[#34bdf2]"></i>
                    <span>Expert team of orthopaedic specialists</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle mt-1 mr-3 text-[#34bdf2]"></i>
                    <span>Comprehensive follow-up and adjustment services</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle mt-1 mr-3 text-[#34bdf2]"></i>
                    <span>Convenient location in Kasarani, Nairobi</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Operating Hours</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Monday - Friday</p>
                    <p className="text-gray-600">8:00 AM - 6:00 PM</p>
                  </div>
                  <div>
                    <p className="font-medium">Saturday</p>
                    <p className="text-gray-600">9:00 AM - 2:00 PM</p>
                  </div>
                  <div>
                    <p className="font-medium">Sunday</p>
                    <p className="text-gray-600">Closed</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your full name" 
                            {...field} 
                            disabled={isSubmitting}
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
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your phone number" 
                            type="tel"
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Required</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="prosthetic_limbs">Prosthetic Limbs</SelectItem>
                            <SelectItem value="orthotic_insoles">Orthotic Insoles for Flat Feet</SelectItem>
                            <SelectItem value="orthopedic_footwear">Orthopedic Footwear</SelectItem>
                            <SelectItem value="corrective_shoes">Corrective Shoes</SelectItem>
                            <SelectItem value="diabetic_footwear">Diabetic Footwear</SelectItem>
                            <SelectItem value="custom_braces">Custom Braces</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            min={today}
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Time</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="morning">Morning (8:00 AM - 12:00 PM)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (12:00 PM - 4:00 PM)</SelectItem>
                            <SelectItem value="evening">Evening (4:00 PM - 6:00 PM)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please provide any details that will help us prepare for your appointment" 
                            className="resize-none"
                            rows={3}
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
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
                        Processing...
                      </>
                    ) : (
                      "Book Appointment"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AppointmentBooking;
