
import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { addDoc, collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  availability: {
    days: string[];
    hours: string[];
  };
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

const appointmentSchema = z.object({
  doctorId: z.string().min(1, { message: "Please select a doctor" }),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, { message: "Please select a time" }),
});

const AppointmentBooking: React.FC = () => {
  const { user, loading } = useAuth();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>(timeSlots);

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }
    fetchDoctors();
  }, [user, loading]);

  const fetchDoctors = async () => {
    try {
      const doctorsQuery = query(collection(db, 'doctors'));
      const doctorsSnapshot = await getDocs(doctorsQuery);
      const doctorsList: Doctor[] = [];
      
      doctorsSnapshot.forEach((doc) => {
        const data = doc.data();
        doctorsList.push({
          id: doc.id,
          name: data.name,
          specialization: data.specialization,
          availability: data.availability || {
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            hours: timeSlots,
          },
        });
      });
      
      setDoctors(doctorsList);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load doctors',
        variant: 'destructive',
      });
    }
  };

  const checkSlotAvailability = async (doctorId: string, date: Date) => {
    try {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      const appointmentsQuery = query(
        collection(db, 'appointments'),
        where('doctorId', '==', doctorId),
        where('date', '>=', Timestamp.fromDate(start)),
        where('date', '<=', Timestamp.fromDate(end))
      );

      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      const bookedSlots = new Set(
        appointmentsSnapshot.docs.map(doc => doc.data().time)
      );

      const available = timeSlots.filter(slot => !bookedSlots.has(slot));
      setAvailableSlots(available);
    } catch (error) {
      console.error('Error checking slot availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to check slot availability',
        variant: 'destructive',
      });
    }
  };

  const handleDoctorChange = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    setSelectedDoctor(doctor || null);
    const date = form.getValues('date');
    if (date) {
      checkSlotAvailability(doctorId, date);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date && selectedDoctor) {
      checkSlotAvailability(selectedDoctor.id, date);
    }
  };

  const onSubmit = async (values: z.infer<typeof appointmentSchema>) => {
    try {
      if (!user) return;

      const appointmentData = {
        patientId: user.uid,
        patientName: user.displayName,
        doctorId: values.doctorId,
        doctorName: selectedDoctor?.name,
        date: Timestamp.fromDate(values.date),
        time: values.time,
        status: 'scheduled',
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'appointments'), appointmentData);
      
      toast({
        title: 'Success',
        description: 'Appointment booked successfully',
      });
      
      navigate('/dashboard/appointments');
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: 'Error',
        description: 'Failed to book appointment',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
          <CardDescription>
            Select your preferred doctor, date, and time for your appointment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleDoctorChange(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialization}
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          handleDateChange(date);
                        }}
                        disabled={(date) => {
                          const day = date.getDay();
                          return day === 0 || day === 6; // Disable weekends
                        }}
                        className="rounded-md border"
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
                    <FormLabel>Time</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time slot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Book Appointment
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentBooking;
