import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, where, orderBy, doc, updateDoc, addDoc, deleteDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useParams } from "wouter";
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
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { DeleteIcon, EditIcon, PlusCircleIcon } from "lucide-react";


interface Patient {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
}

interface TreatmentStage {
  id: string;
  stage: string;
  notes: string;
  date: any;
  doctorId: string;
  doctorName: string;
  patientId: string;
}

const stageSchema = z.object({
  stage: z.string().min(1, { message: "Please select a treatment stage" }),
  notes: z.string().min(10, { message: "Please provide detailed notes (minimum 10 characters)" }),
});

type StageFormValues = z.infer<typeof stageSchema>;

const TreatmentStages: React.FC = () => {
  const { user, loading } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [treatmentStages, setTreatmentStages] = useState<TreatmentStage[]>([]);
  const [showAddStage, setShowAddStage] = useState(false);
  const [showEditStage, setShowEditStage] = useState(false);
  const [showDeleteStage, setShowDeleteStage] = useState(false);
  const [currentStage, setCurrentStage] = useState<TreatmentStage | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [patientDetails, setPatientDetails] = useState<any>(null);
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const params = useParams();

  const form = useForm<StageFormValues>({
    resolver: zodResolver(stageSchema),
    defaultValues: {
      stage: "",
      notes: "",
    }
  });

  const editForm = useForm<StageFormValues>({
    resolver: zodResolver(stageSchema),
    defaultValues: {
      stage: "",
      notes: "",
    }
  });

  // Available treatment stage options
  const treatmentStageOptions = [
    "Initial Consultation",
    "Assessment",
    "Measurement",
    "Design",
    "Fabrication",
    "Fitting",
    "Adjustment",
    "Follow-up",
    "Final Assessment",
    "Completed",
  ];

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (!loading && user && user.role !== "doctor" && user.role !== "owner") {
      navigate("/");
      return;
    }

    if (user) {
      fetchPatients();
    }
  }, [user, loading]);

  useEffect(() => {
    // Check if we have a patientId in the URL
    if (params.patientId && patients.length > 0) {
      const patient = patients.find(p => p.uid === params.patientId);
      if (patient) {
        setSelectedPatient(patient);
        fetchTreatmentStages(patient.uid);
        fetchPatientDetails(patient.uid);
      }
    }
  }, [params.patientId, patients]);

  useEffect(() => {
    if (currentStage && showEditStage) {
      editForm.reset({
        stage: currentStage.stage,
        notes: currentStage.notes,
      });
    }
  }, [currentStage, showEditStage]);

  const fetchPatients = async () => {
    try {
      setLoadingData(true);
      const patientsQuery = query(
        collection(db, "users"),
        where("role", "==", "patient"),
        orderBy("displayName", "asc")
      );
      
      const patientsSnapshot = await getDocs(patientsQuery);
      const patientsList: Patient[] = [];
      
      patientsSnapshot.forEach((patientDoc) => {
        const patientData = patientDoc.data();
        patientsList.push({
          id: patientDoc.id,
          uid: patientData.uid,
          displayName: patientData.displayName || "No Name",
          email: patientData.email || "No Email",
          photoURL: patientData.photoURL || null,
        });
      });
      
      setPatients(patientsList);
      
      // If no patient is selected but we have patients, select the first one
      if (!selectedPatient && patientsList.length > 0 && !params.patientId) {
        setSelectedPatient(patientsList[0]);
        fetchTreatmentStages(patientsList[0].uid);
        fetchPatientDetails(patientsList[0].uid);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const fetchTreatmentStages = async (patientId: string) => {
    try {
      setLoadingData(true);
      const stagesQuery = query(
        collection(db, "treatmentStages"),
        where("patientId", "==", patientId),
        orderBy("date", "desc")
      );
      
      const stagesSnapshot = await getDocs(stagesQuery);
      const stagesList: TreatmentStage[] = [];
      
      stagesSnapshot.forEach((stageDoc) => {
        const stageData = stageDoc.data();
        stagesList.push({
          id: stageDoc.id,
          stage: stageData.stage,
          notes: stageData.notes,
          date: stageData.date,
          doctorId: stageData.doctorId,
          doctorName: stageData.doctorName,
          patientId: stageData.patientId,
        });
      });
      
      setTreatmentStages(stagesList);
    } catch (error) {
      console.error("Error fetching treatment stages:", error);
      toast({
        title: "Error",
        description: "Failed to load treatment stages",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const fetchPatientDetails = async (patientId: string) => {
    try {
      // Get patient profile details
      const profileQuery = query(
        collection(db, "patientProfiles"),
        where("userId", "==", patientId)
      );
      
      const profileSnapshot = await getDocs(profileQuery);
      
      if (!profileSnapshot.empty) {
        setPatientDetails(profileSnapshot.docs[0].data());
      } else {
        setPatientDetails(null);
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  };

  const handlePatientChange = (patientId: string) => {
    const patient = patients.find(p => p.uid === patientId);
    if (patient) {
      setSelectedPatient(patient);
      fetchTreatmentStages(patient.uid);
      fetchPatientDetails(patient.uid);
      navigate(`/dashboard/treatment/${patient.uid}`);
    }
  };

  const handleAddStage = () => {
    form.reset({
      stage: "",
      notes: "",
    });
    setShowAddStage(true);
  };

  const handleEditStage = (stage: TreatmentStage) => {
    setCurrentStage(stage);
    setShowEditStage(true);
  };

  const handleDeleteStage = (stage: TreatmentStage) => {
    setCurrentStage(stage);
    setShowDeleteStage(true);
  };

  const onSubmitAdd = async (data: StageFormValues) => {
    if (!selectedPatient || !user) return;
    
    try {
      await addDoc(collection(db, "treatmentStages"), {
        patientId: selectedPatient.uid,
        stage: data.stage,
        notes: data.notes,
        date: serverTimestamp(),
        doctorId: user.uid,
        doctorName: user.displayName || user.email,
      });
      
      toast({
        title: "Stage Added",
        description: "Treatment stage has been added successfully",
      });
      
      setShowAddStage(false);
      fetchTreatmentStages(selectedPatient.uid);
    } catch (error) {
      console.error("Error adding treatment stage:", error);
      toast({
        title: "Error",
        description: "Failed to add treatment stage",
        variant: "destructive",
      });
    }
  };

  const onSubmitEdit = async (data: StageFormValues) => {
    if (!currentStage) return;
    
    try {
      await updateDoc(doc(db, "treatmentStages", currentStage.id), {
        stage: data.stage,
        notes: data.notes,
      });
      
      toast({
        title: "Stage Updated",
        description: "Treatment stage has been updated successfully",
      });
      
      setShowEditStage(false);
      if (selectedPatient) {
        fetchTreatmentStages(selectedPatient.uid);
      }
    } catch (error) {
      console.error("Error updating treatment stage:", error);
      toast({
        title: "Error",
        description: "Failed to update treatment stage",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentStage) return;
    
    try {
      await deleteDoc(doc(db, "treatmentStages", currentStage.id));
      
      toast({
        title: "Stage Deleted",
        description: "Treatment stage has been deleted successfully",
      });
      
      setShowDeleteStage(false);
      if (selectedPatient) {
        fetchTreatmentStages(selectedPatient.uid);
      }
    } catch (error) {
      console.error("Error deleting treatment stage:", error);
      toast({
        title: "Error",
        description: "Failed to delete treatment stage",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown";
    
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading || !user) {
    return <div className="flex justify-center items-center h-screen">
      <p>Redirecting to login...</p>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Treatment Stages</h1>
        
        <div className="w-full md:w-64">
          <Select value={selectedPatient?.uid || ""} onValueChange={handlePatientChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.uid} value={patient.uid}>
                  {patient.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loadingData ? (
        <div className="flex justify-center items-center py-20">
          <p>Loading treatment data...</p>
        </div>
      ) : selectedPatient ? (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {selectedPatient.photoURL ? (
                  <img 
                    src={selectedPatient.photoURL} 
                    alt={selectedPatient.displayName} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#34bdf2] text-white flex items-center justify-center">
                    {selectedPatient.displayName.charAt(0)}
                  </div>
                )}
                {selectedPatient.displayName}
              </CardTitle>
              <CardDescription>
                {selectedPatient.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Patient Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span>{patientDetails?.phone || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gender:</span>
                      <span>{patientDetails?.gender || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date of Birth:</span>
                      <span>{patientDetails?.dateOfBirth || "Not provided"}</span>
                    </div>
                  </div>
                </div>
                
                {patientDetails?.medicalHistory && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Medical History</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {patientDetails.medicalHistory}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => navigate("/dashboard/patients")}
              >
                <i className="fas fa-arrow-left mr-2"></i> Back to Patients
              </Button>
              <Button 
                className="bg-[#34bdf2] hover:bg-[#2193c9]"
                onClick={handleAddStage}
              >
                <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Treatment Stage
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Treatment Progress Timeline</CardTitle>
              <CardDescription>
                Track and manage the patient's treatment stages
              </CardDescription>
            </CardHeader>
            <CardContent>
              {treatmentStages.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-1 bg-[#34bdf2] opacity-30"></div>
                  
                  {treatmentStages.map((stage, index) => (
                    <div key={stage.id} className="relative mb-8 ml-10">
                      <div className="absolute -left-10 top-1 w-5 h-5 rounded-full bg-[#34bdf2] z-10"></div>
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold text-gray-800">{stage.stage}</h3>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditStage(stage)}
                              className="h-8 w-8 p-0"
                            >
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteStage(stage)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <DeleteIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{stage.notes}</p>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Dr. {stage.doctorName}</span>
                          <span>{formatDate(stage.date)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No treatment stages recorded yet.</p>
                  <Button 
                    className="mt-4 bg-[#34bdf2] hover:bg-[#2193c9]"
                    onClick={handleAddStage}
                  >
                    <PlusCircleIcon className="mr-2 h-4 w-4" /> Add First Treatment Stage
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500">No patients found. Please add patients first.</p>
          <Button 
            className="mt-4 bg-[#34bdf2] hover:bg-[#2193c9]"
            onClick={() => navigate("/dashboard/patients")}
          >
            View Patients
          </Button>
        </div>
      )}
      
      {/* Add Stage Dialog */}
      <Dialog open={showAddStage} onOpenChange={setShowAddStage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Treatment Stage</DialogTitle>
            <DialogDescription>
              Record a new treatment stage for {selectedPatient?.displayName}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAdd)} className="space-y-4">
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatment Stage</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {treatmentStageOptions.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter detailed notes about this treatment stage" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddStage(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#34bdf2] hover:bg-[#2193c9]">
                  Add Stage
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Stage Dialog */}
      <Dialog open={showEditStage} onOpenChange={setShowEditStage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Treatment Stage</DialogTitle>
            <DialogDescription>
              Update the treatment stage information
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatment Stage</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {treatmentStageOptions.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter detailed notes about this treatment stage" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditStage(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#34bdf2] hover:bg-[#2193c9]">
                  Update Stage
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Stage Dialog */}
      <Dialog open={showDeleteStage} onOpenChange={setShowDeleteStage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Treatment Stage</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this treatment stage? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <Alert variant="destructive">
            <AlertDescription>
              You are about to delete the "{currentStage?.stage}" stage recorded on {currentStage?.date && formatDate(currentStage.date)}.
            </AlertDescription>
          </Alert>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteStage(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TreatmentStages;
