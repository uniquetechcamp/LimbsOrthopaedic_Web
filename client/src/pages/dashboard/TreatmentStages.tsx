import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, query, where, orderBy, getDocs, serverTimestamp, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon, EditIcon, TrashIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface TreatmentStage {
  id: string;
  stage: string;
  notes: string;
  date: any;
  doctorId: string;
  doctorName: string;
  patientId: string;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  medicalHistory?: string;
}

interface StageFormValues {
  stage: string;
  notes: string;
}

const stageSchema = z.object({
  stage: z.string().min(1, { message: "Please select a treatment stage" }),
  notes: z.string().min(10, { message: "Please provide detailed notes (minimum 10 characters)" }),
});

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
    window.scrollTo(0, 0);

    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (params.patientId) {
      fetchPatientDetails(params.patientId);
      fetchTreatmentStages(params.patientId);
    }
  }, [params.patientId, user, loading]);

  const fetchPatientDetails = async (patientId: string) => {
    try {
      const patientDoc = await getDocs(
        query(collection(db, "patients"), where("id", "==", patientId))
      );

      if (!patientDoc.empty) {
        const patientData = patientDoc.docs[0].data();
        setPatientDetails(patientData);
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
      toast({
        title: "Error",
        description: "Failed to load patient details",
        variant: "destructive",
      });
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

  const handleAddStage = async (data: StageFormValues) => {
    try {
      if (!user || !patientDetails) return;

      const newStage = {
        patientId: params.patientId,
        stage: data.stage,
        notes: data.notes,
        date: serverTimestamp(),
        doctorId: user.uid,
        doctorName: user.displayName || 'Doctor',
      };

      await addDoc(collection(db, "treatmentStages"), newStage);
      fetchTreatmentStages(params.patientId);
      setShowAddStage(false);
      form.reset();

      toast({
        title: "Success",
        description: "Treatment stage added successfully",
      });
    } catch (error) {
      console.error("Error adding treatment stage:", error);
      toast({
        title: "Error",
        description: "Failed to add treatment stage",
        variant: "destructive",
      });
    }
  };

  const handleEditStage = async (data: StageFormValues) => {
    try {
      if (!currentStage) return;

      await updateDoc(doc(db, "treatmentStages", currentStage.id), {
        stage: data.stage,
        notes: data.notes,
      });

      fetchTreatmentStages(params.patientId);
      setShowEditStage(false);
      editForm.reset();

      toast({
        title: "Success",
        description: "Treatment stage updated successfully",
      });
    } catch (error) {
      console.error("Error updating treatment stage:", error);
      toast({
        title: "Error",
        description: "Failed to update treatment stage",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStage = async () => {
    try {
      if (!currentStage) return;

      await deleteDoc(doc(db, "treatmentStages", currentStage.id));
      fetchTreatmentStages(params.patientId);
      setShowDeleteStage(false);

      toast({
        title: "Success",
        description: "Treatment stage deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting treatment stage:", error);
      toast({
        title: "Error",
        description: "Failed to delete treatment stage",
        variant: "destructive",
      });
    }
  };

  if (loading || loadingData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Patient Details</CardTitle>
          <CardDescription>
            View and manage treatment stages for {patientDetails?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patientDetails && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Medical History</h3>
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
            onClick={() => setShowAddStage(true)}
          >
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Treatment Stage
          </Button>
        </CardFooter>
      </Card>

      <Card className="mt-8">
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
                  <div className="absolute -left-[2.19rem] w-4 h-4 bg-[#34bdf2] rounded-full"></div>
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{stage.stage}</h3>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCurrentStage(stage);
                            editForm.setValue("stage", stage.stage);
                            editForm.setValue("notes", stage.notes);
                            setShowEditStage(true);
                          }}
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCurrentStage(stage);
                            setShowDeleteStage(true);
                          }}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{stage.notes}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Dr. {stage.doctorName}</span>
                      <span>
                        {stage.date?.toDate().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No treatment stages recorded yet.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowAddStage(true)}
              >
                <PlusCircleIcon className="mr-2 h-4 w-4" /> Add First Stage
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Stage Dialog */}
      <Dialog open={showAddStage} onOpenChange={setShowAddStage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Treatment Stage</DialogTitle>
            <DialogDescription>
              Record a new treatment stage for the patient
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddStage)} className="space-y-4">
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {treatmentStageOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
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
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Add Stage</Button>
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
              Update the treatment stage details
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditStage)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {treatmentStageOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
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
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update Stage</Button>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteStage(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStage}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TreatmentStages;