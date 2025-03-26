import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, where, orderBy, doc, updateDoc, getDoc } from "firebase/firestore";
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
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";


interface Patient {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt: any;
  appointmentsCount: number;
  lastAppointment: Date | null;
  currentStage: string;
}

const PatientRecords: React.FC = () => {
  const { user, loading } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [patientProfile, setPatientProfile] = useState<any>(null);
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

    if (!loading && user && user.role !== "doctor" && user.role !== "owner") {
      navigate("/");
      return;
    }

    if (user) {
      fetchPatients();
    }
  }, [user, loading]);

  useEffect(() => {
    if (patients.length > 0) {
      filterPatients();
    }
  }, [searchTerm, patients]);

  const fetchPatients = async () => {
    try {
      setLoadingData(true);
      const patientsQuery = query(
        collection(db, "users"),
        where("role", "==", "patient"),
        orderBy("createdAt", "desc")
      );
      
      const patientsSnapshot = await getDocs(patientsQuery);
      const patientsList: Patient[] = [];
      
      for (const patientDoc of patientsSnapshot.docs) {
        const patientData = patientDoc.data();
        
        // Get appointments count
        const appointmentsQuery = query(
          collection(db, "appointments"),
          where("userId", "==", patientData.uid)
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        
        // Get the most recent appointment
        let lastAppointment = null;
        let lastAppointmentDate = null;
        
        appointmentsSnapshot.forEach((appDoc) => {
          const appData = appDoc.data();
          const appDate = new Date(appData.date);
          
          if (!lastAppointmentDate || appDate > lastAppointmentDate) {
            lastAppointmentDate = appDate;
            lastAppointment = appData;
          }
        });
        
        // Get current treatment stage
        const treatmentQuery = query(
          collection(db, "treatmentStages"),
          where("patientId", "==", patientData.uid),
          orderBy("date", "desc"),
          where("stage", "!=", "Completed")
        );
        const treatmentSnapshot = await getDocs(treatmentQuery);
        let currentStage = "Not Started";
        
        if (!treatmentSnapshot.empty) {
          currentStage = treatmentSnapshot.docs[0].data().stage;
        }
        
        patientsList.push({
          id: patientDoc.id,
          uid: patientData.uid,
          displayName: patientData.displayName || "No Name",
          email: patientData.email || "No Email",
          photoURL: patientData.photoURL || null,
          createdAt: patientData.createdAt,
          appointmentsCount: appointmentsSnapshot.size,
          lastAppointment: lastAppointmentDate,
          currentStage: currentStage,
        });
      }
      
      setPatients(patientsList);
      setFilteredPatients(patientsList);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast({
        title: "Error",
        description: "Failed to load patient records",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const filterPatients = () => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = patients.filter(
      patient => 
        patient.displayName.toLowerCase().includes(term) ||
        patient.email.toLowerCase().includes(term)
    );
    
    setFilteredPatients(filtered);
  };

  const handleViewDetails = async (patient: Patient) => {
    setSelectedPatient(patient);
    
    try {
      // Get patient profile details
      const profileQuery = query(
        collection(db, "patientProfiles"),
        where("userId", "==", patient.uid)
      );
      
      const profileSnapshot = await getDocs(profileQuery);
      
      if (!profileSnapshot.empty) {
        setPatientProfile(profileSnapshot.docs[0].data());
      } else {
        setPatientProfile(null);
      }
      
      setShowPatientDetails(true);
    } catch (error) {
      console.error("Error fetching patient details:", error);
      toast({
        title: "Error",
        description: "Failed to load patient details",
        variant: "destructive",
      });
    }
  };

  const handleViewTreatment = (patientId: string) => {
    navigate(`/dashboard/treatment/${patientId}`);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
        <h1 className="text-3xl font-bold">Patient Records</h1>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Input
              type="text"
              placeholder="Search patients..."
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
            onClick={() => navigate("/appointment")}
          >
            <i className="fas fa-plus mr-2"></i> New Patient
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Patients</CardTitle>
          <CardDescription>
            Manage patient records and view treatment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingData ? (
            <div className="flex justify-center items-center py-20">
              <p>Loading patient records...</p>
            </div>
          ) : filteredPatients.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Last Appointment</TableHead>
                    <TableHead>Current Stage</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {patient.photoURL ? (
                          <img 
                            src={patient.photoURL} 
                            alt={patient.displayName} 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#34bdf2] text-white flex items-center justify-center">
                            {patient.displayName.charAt(0)}
                          </div>
                        )}
                        {patient.displayName}
                      </TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{formatDate(patient.lastAppointment)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          patient.currentStage === "Not Started" 
                            ? "bg-gray-100 text-gray-800" 
                            : patient.currentStage === "Completed" 
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {patient.currentStage}
                        </span>
                      </TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewDetails(patient)}>
                              <i className="fas fa-user-circle mr-2"></i> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewTreatment(patient.uid)}>
                              <i className="fas fa-clipboard-list mr-2"></i> Treatment Stages
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
              <p className="text-gray-500">No patients found</p>
              {searchTerm && (
                <p className="text-gray-500 mt-2">
                  Try adjusting your search terms
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Patient Details Dialog */}
      <Dialog open={showPatientDetails} onOpenChange={setShowPatientDetails}>
        <DialogContent className="max-w-3xl">
          {selectedPatient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
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
                </DialogTitle>
                <DialogDescription>
                  Patient details and information
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span>{selectedPatient.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Patient Since:</span>
                      <span>
                        {selectedPatient.createdAt?.toDate().toLocaleDateString() || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Appointments:</span>
                      <span>{selectedPatient.appointmentsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Appointment:</span>
                      <span>{formatDate(selectedPatient.lastAppointment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current Stage:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedPatient.currentStage === "Not Started" 
                          ? "bg-gray-100 text-gray-800" 
                          : selectedPatient.currentStage === "Completed" 
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {selectedPatient.currentStage}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Medical Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span>{patientProfile?.phone || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gender:</span>
                      <span>{patientProfile?.gender || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date of Birth:</span>
                      <span>{patientProfile?.dateOfBirth || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Address:</span>
                      <span>{patientProfile?.address || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Emergency Contact:</span>
                      <span>{patientProfile?.emergencyContact || "Not provided"}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {patientProfile?.medicalHistory && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Medical History</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {patientProfile.medicalHistory}
                  </p>
                </div>
              )}
              
              <DialogFooter className="gap-2 sm:gap-0">
                <Button 
                  variant="outline"
                  onClick={() => handleViewTreatment(selectedPatient.uid)}
                >
                  <i className="fas fa-clipboard-list mr-2"></i> View Treatment
                </Button>
                <DialogClose asChild>
                  <Button>Close</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientRecords;
