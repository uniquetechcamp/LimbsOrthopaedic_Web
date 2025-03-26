import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import patientsReducer from './slices/patientsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentsReducer,
    patients: patientsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in redux state
        ignoredActions: [
          'appointments/fetchUserAppointments/fulfilled',
          'appointments/fetchAllAppointments/fulfilled',
          'appointments/bookAppointment/fulfilled',
          'patients/fetchPatients/fulfilled',
          'patients/fetchPatientTreatmentStages/fulfilled',
          'patients/updatePatientProfile/fulfilled',
          'patients/addTreatmentStage/fulfilled',
        ],
        ignoredPaths: [
          'appointments.appointments',
          'appointments.filteredAppointments',
          'appointments.currentAppointment',
          'patients.patients',
          'patients.filteredPatients',
          'patients.currentPatient',
          'patients.treatmentStages',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
