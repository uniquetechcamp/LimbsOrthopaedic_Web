import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface PatientProfile {
  id?: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  gender?: 'male' | 'female' | 'other' | '';
  dateOfBirth?: string;
  createdAt?: any;
  updatedAt?: any;
}

interface TreatmentStage {
  id: string;
  patientId: string;
  stage: string;
  notes: string;
  date: any;
  doctorId: string;
  doctorName: string;
}

interface PatientsState {
  patients: PatientProfile[];
  filteredPatients: PatientProfile[];
  currentPatient: PatientProfile | null;
  treatmentStages: TreatmentStage[];
  loading: boolean;
  error: string | null;
}

const initialState: PatientsState = {
  patients: [],
  filteredPatients: [],
  currentPatient: null,
  treatmentStages: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (_, { rejectWithValue }) => {
    try {
      // First, get all users with role "patient"
      const usersQuery = query(
        collection(db, 'users'),
        where('role', '==', 'patient')
      );
      
      const usersSnapshot = await getDocs(usersQuery);
      const patients: PatientProfile[] = [];
      
      // For each patient user, get their profile details if available
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        
        // Check for detailed profile
        const profileQuery = query(
          collection(db, 'patientProfiles'),
          where('userId', '==', userData.uid)
        );
        
        const profileSnapshot = await getDocs(profileQuery);
        let profileData = {};
        
        if (!profileSnapshot.empty) {
          const profileDoc = profileSnapshot.docs[0];
          profileData = { ...profileDoc.data(), id: profileDoc.id };
        }
        
        patients.push({
          userId: userData.uid,
          fullName: userData.displayName || 'No Name',
          email: userData.email || 'No Email',
          createdAt: userData.createdAt,
          ...profileData,
        });
      }
      
      return patients;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPatientTreatmentStages = createAsyncThunk(
  'patients/fetchPatientTreatmentStages',
  async (patientId: string, { rejectWithValue }) => {
    try {
      const stagesQuery = query(
        collection(db, 'treatmentStages'),
        where('patientId', '==', patientId),
        orderBy('date', 'desc')
      );
      
      const stagesSnapshot = await getDocs(stagesQuery);
      const stages: TreatmentStage[] = [];
      
      stagesSnapshot.forEach((doc) => {
        const data = doc.data();
        stages.push({
          id: doc.id,
          patientId: data.patientId,
          stage: data.stage,
          notes: data.notes,
          date: data.date,
          doctorId: data.doctorId,
          doctorName: data.doctorName,
        });
      });
      
      return stages;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePatientProfile = createAsyncThunk(
  'patients/updatePatientProfile',
  async (profile: PatientProfile, { rejectWithValue }) => {
    try {
      // Check if profile already exists
      const profileQuery = query(
        collection(db, 'patientProfiles'),
        where('userId', '==', profile.userId)
      );
      
      const profileSnapshot = await getDocs(profileQuery);
      
      if (profileSnapshot.empty) {
        // Create new profile
        const newProfile = {
          ...profile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        
        const docRef = await addDoc(collection(db, 'patientProfiles'), newProfile);
        return { ...newProfile, id: docRef.id };
      } else {
        // Update existing profile
        const profileDoc = profileSnapshot.docs[0];
        const updatedProfile = {
          ...profile,
          updatedAt: serverTimestamp(),
        };
        
        await updateDoc(doc(db, 'patientProfiles', profileDoc.id), updatedProfile);
        return { ...updatedProfile, id: profileDoc.id };
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTreatmentStage = createAsyncThunk(
  'patients/addTreatmentStage',
  async (
    { 
      patientId, 
      stage, 
      notes, 
      doctorId, 
      doctorName 
    }: { 
      patientId: string; 
      stage: string; 
      notes: string; 
      doctorId: string; 
      doctorName: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const newStage = {
        patientId,
        stage,
        notes,
        date: serverTimestamp(),
        doctorId,
        doctorName,
      };
      
      const docRef = await addDoc(collection(db, 'treatmentStages'), newStage);
      return { ...newStage, id: docRef.id };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setCurrentPatient: (state, action: PayloadAction<PatientProfile | null>) => {
      state.currentPatient = action.payload;
    },
    filterPatients: (state, action: PayloadAction<string>) => {
      const searchTerm = action.payload.toLowerCase();
      if (!searchTerm) {
        state.filteredPatients = state.patients;
      } else {
        state.filteredPatients = state.patients.filter(
          (patient) =>
            patient.fullName.toLowerCase().includes(searchTerm) ||
            patient.email.toLowerCase().includes(searchTerm) ||
            (patient.phone && patient.phone.includes(searchTerm))
        );
      }
    },
    clearPatientData: (state) => {
      state.currentPatient = null;
      state.treatmentStages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPatients
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
        state.filteredPatients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchPatientTreatmentStages
      .addCase(fetchPatientTreatmentStages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientTreatmentStages.fulfilled, (state, action) => {
        state.loading = false;
        state.treatmentStages = action.payload;
      })
      .addCase(fetchPatientTreatmentStages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // updatePatientProfile
      .addCase(updatePatientProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatientProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient = action.payload;
        
        // Update patient in patients array
        const index = state.patients.findIndex(
          (p) => p.userId === action.payload.userId
        );
        
        if (index !== -1) {
          state.patients[index] = action.payload;
        } else {
          state.patients.push(action.payload);
        }
        
        // Update filtered patients
        const filteredIndex = state.filteredPatients.findIndex(
          (p) => p.userId === action.payload.userId
        );
        
        if (filteredIndex !== -1) {
          state.filteredPatients[filteredIndex] = action.payload;
        } else {
          state.filteredPatients.push(action.payload);
        }
      })
      .addCase(updatePatientProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // addTreatmentStage
      .addCase(addTreatmentStage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTreatmentStage.fulfilled, (state, action) => {
        state.loading = false;
        state.treatmentStages = [action.payload as TreatmentStage, ...state.treatmentStages];
      })
      .addCase(addTreatmentStage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentPatient,
  filterPatients,
  clearPatientData,
} = patientsSlice.actions;

export default patientsSlice.reducer;
