import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import GradientText from "@/components/common/GradientText";
import { useLocation } from "wouter";


interface Appointment {
  id: string;
  service: string;
  date: string;
  time: string;
  status: string;
  createdAt: any;
}

interface TreatmentStage {
  id: string;
  stage: string;
  notes: string;
  date: any;
  doctor: string;
}

const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }).optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  medicalHistory: z.string().optional(),
  gender: z.enum(["male", "female", "other", ""]).optional(),
  dateOfBirth: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const PatientProfile: React.FC = () => {
  const { user, loading } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [treatmentStages, setTreatmentStages] = useState<TreatmentStage[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const { toast } = useToast();
  const [location, navigate] = useLocation();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      fetchUserData();
      fetchAppointments();
      fetchTreatmentStages();
    }
  }, [user, loading]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      emergencyContact: "",
      medicalHistory: "",
      gender: "",
      dateOfBirth: "",
    }
  });

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      const userDoc = await getDocs(query(
        collection(db, "patientProfiles"), 
        where("userId", "==", user.uid)
      ));
      
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        form.reset({
          fullName: user.displayName || "",
          phone: userData.phone || "",
          address: userData.address || "",
          emergencyContact: userData.emergencyContact || "",
          medicalHistory: userData.medicalHistory || "",
          gender: userData.gender || "",
          dateOfBirth: userData.dateOfBirth || "",
        });
      } else {
        form.reset({
          fullName: user.displayName || "",
          phone: "",
          address: "",
          emergencyContact: "",
          medicalHistory: "",
          gender: "",
          dateOfBirth: "",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    }
  };

  const fetchAppointments = async () => {
    if (!user) return;
    
    try {
      const appointmentsQuery = query(
        collection(db, "appointments"),
        where("userId", "==", user.uid)
      );
      
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      const appointmentsList: Appointment[] = [];
      
      appointmentsSnapshot.forEach((doc) => {
        const data = doc.data();
        appointmentsList.push({
          id: doc.id,
          service: data.service,
          date: data.date,
          time: data.time,
          status: data.status,
          createdAt: data.createdAt,
        });
      });
      
      // Sort by date, most recent first
      appointmentsList.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      setAppointments(appointmentsList);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Error",
        description: "Failed to load appointment data",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const fetchTreatmentStages = async () => {
    if (!user) return;
    
    try {
      const treatmentQuery = query(
        collection(db, "treatmentStages"),
        where("patientId", "==", user.uid)
      );
      
      const treatmentSnapshot = await getDocs(treatmentQuery);
      const treatmentList: TreatmentStage[] = [];
      
      treatmentSnapshot.forEach((doc) => {
        const data = doc.data();
        treatmentList.push({
          id: doc.id,
          stage: data.stage,
          notes: data.notes,
          date: data.date,
          doctor: data.doctorName,
        });
      });
      
      // Sort by date, most recent first
      treatmentList.sort((a, b) => {
        return b.date.toDate().getTime() - a.date.toDate().getTime();
      });
      
      setTreatmentStages(treatmentList);
    } catch (error) {
      console.error("Error fetching treatment stages:", error);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setUpdating(true);
    try {
      // Check if profile already exists
      const profileQuery = query(
        collection(db, "patientProfiles"),
        where("userId", "==", user.uid)
      );
      
      const profileSnapshot = await getDocs(profileQuery);
      
      if (profileSnapshot.empty) {
        // Create new profile
        await addDoc(collection(db, "patientProfiles"), {
          userId: user.uid,
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        // Update existing profile
        const profileDoc = profileSnapshot.docs[0];
        await updateDoc(doc(db, "patientProfiles", profileDoc.id), {
          ...data,
          updatedAt: serverTimestamp(),
        });
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const formatServiceName = (serviceId: string) => {
    const serviceMap: {[key: string]: string} = {
      prosthetic_limbs: "Prosthetic Limbs",
      orthotic_insoles: "Orthotic Insoles",
      orthopedic_footwear: "Orthopedic Footwear",
      corrective_shoes: "Corrective Shoes",
      diabetic_footwear: "Diabetic Footwear",
      custom_braces: "Custom Braces",
    };
    
    return serviceMap[serviceId] || serviceId;
  };

  const formatTime = (timeId: string) => {
    const timeMap: {[key: string]: string} = {
      morning: "Morning (8:00 AM - 12:00 PM)",
      afternoon: "Afternoon (12:00 PM - 4:00 PM)",
      evening: "Evening (4:00 PM - 6:00 PM)",
    };
    
    return timeMap[timeId] || timeId;
  };

  const formatStatus = (status: string) => {
    const statusClasses: {[key: string]: string} = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || ""}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading || !user) {
    return <div className="flex justify-center items-center h-screen">
      <p>Redirecting to login...</p>
    </div>;
  }

  return (
    <>
      {/* Page Header */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">
            <GradientText>Patient Profile</GradientText>
          </h1>
          <p className="text-xl text-gray-600 mt-2">Manage your personal information and view your appointments</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Personal Information</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="treatment">Treatment Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal information and medical details</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={updating} />
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
                              <Input {...field} disabled={updating} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              disabled={updating}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} disabled={updating} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={updating} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="emergencyContact"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Emergency Contact</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Name and phone number of emergency contact"
                                disabled={updating} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="medicalHistory"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Medical History</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Include any relevant medical conditions, allergies, medications, or previous surgeries"
                                className="min-h-[100px]"
                                disabled={updating}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        className="bg-[#34bdf2] hover:bg-[#2193c9]"
                        disabled={updating}
                      >
                        {updating ? (
                          <>
                            <span className="mr-2">
                              <i className="fas fa-spinner fa-spin"></i>
                            </span>
                            Updating...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Your Appointments</CardTitle>
                <CardDescription>View and manage your appointment history</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="flex justify-center items-center py-10">
                    <p>Loading appointments...</p>
                  </div>
                ) : appointments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell className="font-medium">{formatServiceName(appointment.service)}</TableCell>
                            <TableCell>{formatDate(appointment.date)}</TableCell>
                            <TableCell>{formatTime(appointment.time)}</TableCell>
                            <TableCell>{formatStatus(appointment.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">You don't have any appointments yet.</p>
                    <Button 
                      className="mt-4 bg-[#34bdf2] hover:bg-[#2193c9]"
                      onClick={() => navigate("/appointment")}
                    >
                      Book Your First Appointment
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  className="bg-[#34bdf2] hover:bg-[#2193c9]"
                  onClick={() => navigate("/appointment")}
                >
                  Book New Appointment
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="treatment">
            <Card>
              <CardHeader>
                <CardTitle>Treatment Progress</CardTitle>
                <CardDescription>Track your treatment stages and progress</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="flex justify-center items-center py-10">
                    <p>Loading treatment stages...</p>
                  </div>
                ) : treatmentStages.length > 0 ? (
                  <div className="relative">
                    <div className="absolute left-5 top-0 bottom-0 w-1 bg-[#34bdf2] opacity-30"></div>
                    
                    {treatmentStages.map((stage, index) => (
                      <div key={stage.id} className="relative mb-8 ml-10">
                        <div className="absolute -left-10 top-1 w-5 h-5 rounded-full bg-[#34bdf2] z-10"></div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-bold text-gray-800">{stage.stage}</h3>
                            <span className="text-sm text-gray-500">
                              {stage.date.toDate().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4">{stage.notes}</p>
                          <p className="text-sm text-gray-500">Doctor: {stage.doctor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No treatment stages recorded yet.</p>
                    <p className="text-gray-500 mt-2">
                      Your doctor will update this section as your treatment progresses.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default PatientProfile;
