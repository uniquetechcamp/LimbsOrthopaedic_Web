import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, where, orderBy, doc, updateDoc, addDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface Doctor {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  specialization?: string;
  availability?: string;
  bio?: string;
  photoURL?: string;
  createdAt?: any;
}

const doctorSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).optional(),
  phone: z.string().optional(),
  specialization: z.string().min(2, { message: "Please specify specialization" }),
  availability: z.string().optional(),
  bio: z.string().optional(),
});

type DoctorFormValues = z.infer<typeof doctorSchema>;

const DoctorManagement: React.FC = () => {
  const { user, loading } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showEditDoctor, setShowEditDoctor] = useState(false);
  const [showDeleteDoctor, setShowDeleteDoctor] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [location, navigate] = useLocation();

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      phone: "",
      specialization: "",
      availability: "",
      bio: "",
    }
  });

  const editForm = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema.omit({ password: true })),
    defaultValues: {
      displayName: "",
      email: "",
      phone: "",
      specialization: "",
      availability: "",
      bio: "",
    }
  });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (!loading && user && user.role !== "owner") {
      navigate("/");
      return;
    }

    if (user) {
      fetchDoctors();
    }
  }, [user, loading]);

  useEffect(() => {
    if (doctors.length > 0) {
      filterDoctors();
    }
  }, [searchTerm, doctors]);

  useEffect(() => {
    if (currentDoctor && showEditDoctor) {
      editForm.reset({
        displayName: currentDoctor.displayName,
        email: currentDoctor.email,
        phone: currentDoctor.phone || "",
        specialization: currentDoctor.specialization || "",
        availability: currentDoctor.availability || "",
        bio: currentDoctor.bio || "",
      });
    }
  }, [currentDoctor, showEditDoctor]);

  const fetchDoctors = async () => {
    try {
      setLoadingData(true);
      const doctorsQuery = query(
        collection(db, "users"),
        where("role", "==", "doctor"),
        orderBy("displayName", "asc")
      );
      
      const doctorsSnapshot = await getDocs(doctorsQuery);
      const doctorsList: Doctor[] = [];
      
      for (const doctorDoc of doctorsSnapshot.docs) {
        const doctorData = doctorDoc.data();
        
        // Get doctor profile details if exists
        const profileQuery = query(
          collection(db, "doctorProfiles"),
          where("userId", "==", doctorData.uid)
        );
        
        const profileSnapshot = await getDocs(profileQuery);
        let profileData = {};
        
        if (!profileSnapshot.empty) {
          profileData = profileSnapshot.docs[0].data();
        }
        
        doctorsList.push({
          id: doctorDoc.id,
          uid: doctorData.uid,
          displayName: doctorData.displayName || "No Name",
          email: doctorData.email || "No Email",
          photoURL: doctorData.photoURL,
          createdAt: doctorData.createdAt,
          ...profileData,
        });
      }
      
      setDoctors(doctorsList);
      setFilteredDoctors(doctorsList);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast({
        title: "Error",
        description: "Failed to load doctors",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const filterDoctors = () => {
    if (!searchTerm.trim()) {
      setFilteredDoctors(doctors);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = doctors.filter(
      doctor => 
        doctor.displayName.toLowerCase().includes(term) ||
        doctor.email.toLowerCase().includes(term) ||
        (doctor.specialization && doctor.specialization.toLowerCase().includes(term))
    );
    
    setFilteredDoctors(filtered);
  };

  const handleAddDoctor = () => {
    form.reset({
      displayName: "",
      email: "",
      password: "",
      phone: "",
      specialization: "",
      availability: "",
      bio: "",
    });
    setShowAddDoctor(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setCurrentDoctor(doctor);
    setShowEditDoctor(true);
  };

  const handleDeleteDoctor = (doctor: Doctor) => {
    setCurrentDoctor(doctor);
    setShowDeleteDoctor(true);
  };

  const onSubmitAdd = async (data: DoctorFormValues) => {
    if (!data.password) {
      toast({
        title: "Error",
        description: "Password is required when adding a new doctor",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      
      const newUser = userCredential.user;
      
      // Add to Firestore users collection
      await setDoc(doc(db, "users", newUser.uid), {
        uid: newUser.uid,
        email: newUser.email,
        displayName: data.displayName,
        role: "doctor",
        createdAt: serverTimestamp(),
      });
      
      // Add detailed profile
      await addDoc(collection(db, "doctorProfiles"), {
        userId: newUser.uid,
        phone: data.phone,
        specialization: data.specialization,
        availability: data.availability,
        bio: data.bio,
        createdAt: serverTimestamp(),
      });
      
      toast({
        title: "Doctor Added",
        description: "New doctor has been added successfully",
      });
      
      setShowAddDoctor(false);
      fetchDoctors();
    } catch (error: any) {
      console.error("Error adding doctor:", error);
      
      let errorMessage = "Failed to add doctor";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please use a different email.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitEdit = async (data: DoctorFormValues) => {
    if (!currentDoctor) return;
    
    setIsSubmitting(true);
    try {
      // Update user display name
      await updateDoc(doc(db, "users", currentDoctor.id), {
        displayName: data.displayName,
      });
      
      // Update or create profile
      const profileQuery = query(
        collection(db, "doctorProfiles"),
        where("userId", "==", currentDoctor.uid)
      );
      
      const profileSnapshot = await getDocs(profileQuery);
      
      if (profileSnapshot.empty) {
        // Create new profile
        await addDoc(collection(db, "doctorProfiles"), {
          userId: currentDoctor.uid,
          phone: data.phone,
          specialization: data.specialization,
          availability: data.availability,
          bio: data.bio,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Update existing profile
        await updateDoc(doc(db, "doctorProfiles", profileSnapshot.docs[0].id), {
          phone: data.phone,
          specialization: data.specialization,
          availability: data.availability,
          bio: data.bio,
          updatedAt: serverTimestamp(),
        });
      }
      
      toast({
        title: "Doctor Updated",
        description: "Doctor information has been updated successfully",
      });
      
      setShowEditDoctor(false);
      fetchDoctors();
    } catch (error) {
      console.error("Error updating doctor:", error);
      toast({
        title: "Error",
        description: "Failed to update doctor information",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentDoctor) return;
    
    setIsSubmitting(true);
    try {
      // We don't delete the auth user for safety, but remove from our collections
      // Mark as inactive in Firestore
      await updateDoc(doc(db, "users", currentDoctor.id), {
        isActive: false,
        deactivatedAt: serverTimestamp(),
      });
      
      // Get profile doc
      const profileQuery = query(
        collection(db, "doctorProfiles"),
        where("userId", "==", currentDoctor.uid)
      );
      
      const profileSnapshot = await getDocs(profileQuery);
      
      if (!profileSnapshot.empty) {
        await updateDoc(doc(db, "doctorProfiles", profileSnapshot.docs[0].id), {
          isActive: false,
          deactivatedAt: serverTimestamp(),
        });
      }
      
      toast({
        title: "Doctor Removed",
        description: "Doctor has been removed successfully",
      });
      
      setShowDeleteDoctor(false);
      fetchDoctors();
    } catch (error) {
      console.error("Error removing doctor:", error);
      toast({
        title: "Error",
        description: "Failed to remove doctor",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown";
    
    try {
      const date = timestamp.toDate();
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return "Unknown";
    }
  };

  if (loading || !user) {
    return <div className="flex justify-center items-center h-screen">
      <p>Redirecting to login...</p>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Doctor Management</h1>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i className="fas fa-search"></i>
            </div>
          </div>
          
          <Button 
            className="bg-[#34bdf2] hover:bg-[#2193c9]"
            onClick={handleAddDoctor}
          >
            <i className="fas fa-plus mr-2"></i> Add Doctor
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Doctors Directory</CardTitle>
          <CardDescription>
            Manage doctors and their information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingData ? (
            <div className="flex justify-center items-center py-20">
              <p>Loading doctors...</p>
            </div>
          ) : filteredDoctors.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {doctor.photoURL ? (
                          <img 
                            src={doctor.photoURL} 
                            alt={doctor.displayName} 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#34bdf2] text-white flex items-center justify-center">
                            {doctor.displayName.charAt(0)}
                          </div>
                        )}
                        {doctor.displayName}
                      </TableCell>
                      <TableCell>{doctor.email}</TableCell>
                      <TableCell>{doctor.specialization || "Not specified"}</TableCell>
                      <TableCell>{doctor.availability || "Not specified"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <i className="fas fa-ellipsis-h"></i>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditDoctor(doctor)}>
                              <i className="fas fa-edit mr-2"></i> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteDoctor(doctor)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <i className="fas fa-trash mr-2"></i> Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No doctors found</p>
              {searchTerm && (
                <p className="text-gray-500 mt-2">
                  Try adjusting your search terms
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Doctor Dialog */}
      <Dialog open={showAddDoctor} onOpenChange={setShowAddDoctor}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Doctor</DialogTitle>
            <DialogDescription>
              Add a new doctor to the system
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAdd)} className="space-y-4">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter doctor's full name" {...field} disabled={isSubmitting} />
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
                        placeholder="Enter email address" 
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Create a password" 
                        type="password" 
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
                      <Input placeholder="Enter phone number" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter specialization" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Mon-Fri, 9AM-5PM" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description or biography" 
                        className="min-h-[100px]"
                        {...field} 
                        disabled={isSubmitting} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDoctor(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#34bdf2] hover:bg-[#2193c9]" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">
                        <i className="fas fa-spinner fa-spin"></i>
                      </span>
                      Adding...
                    </>
                  ) : (
                    "Add Doctor"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Doctor Dialog */}
      <Dialog open={showEditDoctor} onOpenChange={setShowEditDoctor}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Doctor</DialogTitle>
            <DialogDescription>
              Update doctor's information
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter doctor's full name" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter email address" 
                        type="email" 
                        {...field} 
                        disabled={true} // Email cannot be changed
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter specialization" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Mon-Fri, 9AM-5PM" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description or biography" 
                        className="min-h-[100px]"
                        {...field} 
                        disabled={isSubmitting} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDoctor(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#34bdf2] hover:bg-[#2193c9]" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">
                        <i className="fas fa-spinner fa-spin"></i>
                      </span>
                      Updating...
                    </>
                  ) : (
                    "Update Doctor"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Doctor Dialog */}
      <Dialog open={showDeleteDoctor} onOpenChange={setShowDeleteDoctor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Doctor</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this doctor? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentDoctor && (
            <div className="flex items-center gap-3 mb-4">
              {currentDoctor.photoURL ? (
                <img 
                  src={currentDoctor.photoURL} 
                  alt={currentDoctor.displayName} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#34bdf2] text-white flex items-center justify-center text-xl">
                  {currentDoctor.displayName.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-bold">{currentDoctor.displayName}</h3>
                <p className="text-sm text-gray-500">{currentDoctor.email}</p>
              </div>
            </div>
          )}
          
          <Alert variant="destructive">
            <AlertDescription>
              This will remove the doctor from the system. Any active treatments or appointments may be affected.
            </AlertDescription>
          </Alert>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDoctor(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">
                    <i className="fas fa-spinner fa-spin"></i>
                  </span>
                  Removing...
                </>
              ) : (
                "Remove Doctor"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorManagement;
