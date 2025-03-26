import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Appointment {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt?: any;
}

interface AppointmentFormData {
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message?: string;
}

interface AppointmentsState {
  appointments: Appointment[];
  filteredAppointments: Appointment[];
  currentAppointment: Appointment | null;
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentsState = {
  appointments: [],
  filteredAppointments: [],
  currentAppointment: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchUserAppointments = createAsyncThunk(
  'appointments/fetchUserAppointments',
  async (userId: string, { rejectWithValue }) => {
    try {
      const appointmentsQuery = query(
        collection(db, 'appointments'),
        where('userId', '==', userId)
      );
      
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      const appointmentsList: Appointment[] = [];
      
      appointmentsSnapshot.forEach((doc) => {
        const data = doc.data();
        appointmentsList.push({
          id: doc.id,
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          service: data.service,
          date: data.date,
          time: data.time,
          message: data.message,
          status: data.status,
          createdAt: data.createdAt,
        });
      });
      
      return appointmentsList;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllAppointments = createAsyncThunk(
  'appointments/fetchAllAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const appointmentsQuery = query(collection(db, 'appointments'));
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      const appointmentsList: Appointment[] = [];
      
      appointmentsSnapshot.forEach((doc) => {
        const data = doc.data();
        appointmentsList.push({
          id: doc.id,
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          service: data.service,
          date: data.date,
          time: data.time,
          message: data.message,
          status: data.status,
          createdAt: data.createdAt,
        });
      });
      
      return appointmentsList;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const bookAppointment = createAsyncThunk(
  'appointments/bookAppointment',
  async (appointment: AppointmentFormData, { rejectWithValue }) => {
    try {
      const newAppointment = {
        ...appointment,
        status: 'pending' as const,
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, 'appointments'), newAppointment);
      
      return {
        id: docRef.id,
        ...newAppointment,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateAppointmentStatus',
  async (
    { id, status }: { id: string; status: 'confirmed' | 'cancelled' | 'completed' },
    { rejectWithValue }
  ) => {
    try {
      await updateDoc(doc(db, 'appointments', id), {
        status,
        updatedAt: serverTimestamp(),
      });
      
      return { id, status };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setCurrentAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.currentAppointment = action.payload;
    },
    filterAppointments: (state, action: PayloadAction<{ 
      status?: string; 
      date?: string;
      searchTerm?: string;
    }>) => {
      const { status, date, searchTerm } = action.payload;
      
      let filtered = [...state.appointments];
      
      if (status) {
        filtered = filtered.filter(app => app.status === status);
      }
      
      if (date) {
        filtered = filtered.filter(app => app.date === date);
      }
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          app => 
            app.fullName.toLowerCase().includes(term) || 
            app.email.toLowerCase().includes(term) ||
            app.phone.includes(term)
        );
      }
      
      state.filteredAppointments = filtered;
    },
    clearAppointments: (state) => {
      state.appointments = [];
      state.filteredAppointments = [];
      state.currentAppointment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserAppointments
      .addCase(fetchUserAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
        state.filteredAppointments = action.payload;
      })
      .addCase(fetchUserAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchAllAppointments
      .addCase(fetchAllAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
        state.filteredAppointments = action.payload;
      })
      .addCase(fetchAllAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // bookAppointment
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload as Appointment);
        state.filteredAppointments.push(action.payload as Appointment);
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // updateAppointmentStatus
      .addCase(updateAppointmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update in appointments array
        const appointmentIndex = state.appointments.findIndex(
          app => app.id === action.payload.id
        );
        
        if (appointmentIndex !== -1) {
          state.appointments[appointmentIndex].status = action.payload.status;
        }
        
        // Update in filtered appointments
        const filteredIndex = state.filteredAppointments.findIndex(
          app => app.id === action.payload.id
        );
        
        if (filteredIndex !== -1) {
          state.filteredAppointments[filteredIndex].status = action.payload.status;
        }
      })
      .addCase(updateAppointmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentAppointment,
  filterAppointments,
  clearAppointments,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
