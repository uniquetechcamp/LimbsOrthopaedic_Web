import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, where, orderBy, limit, Timestamp } from "firebase/firestore";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useLocation } from "wouter";


interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  pendingAppointments: number;
  todayAppointments: number;
  weeklyAppointmentsData: any[];
  patientsByServiceData: any[];
}

interface RecentAppointment {
  id: string;
  patientName: string;
  service: string;
  date: string;
  time: string;
  status: string;
}

interface RecentPatient {
  id: string;
  name: string;
  email: string;
  date: Timestamp;
}

const DashboardHome: React.FC = () => {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    todayAppointments: 0,
    weeklyAppointmentsData: [],
    patientsByServiceData: [],
  });
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);
  const [recentPatients, setRecentPatients] = useState<RecentPatient[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [location, navigate] = useLocation();

  const COLORS = ['#34bdf2', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
      fetchDashboardData();
    }
  }, [user, loading]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      setLoadingData(true);
      await Promise.all([
        fetchStats(),
        fetchRecentAppointments(),
        fetchRecentPatients(),
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchStats = async () => {
    // Get total patients
    const patientsQuery = query(collection(db, "users"), where("role", "==", "patient"));
    const patientsSnapshot = await getDocs(patientsQuery);
    const totalPatients = patientsSnapshot.size;
    
    // Get appointment stats
    const appointmentsQuery = query(collection(db, "appointments"));
    const appointmentsSnapshot = await getDocs(appointmentsQuery);
    
    let totalAppointments = 0;
    let pendingAppointments = 0;
    let todayAppointments = 0;
    
    // Service counts for pie chart
    const serviceCounts: { [key: string]: number } = {};
    
    // Weekly data for bar chart
    const weeklyData: { [key: string]: number } = {
      'Sunday': 0,
      'Monday': 0,
      'Tuesday': 0,
      'Wednesday': 0,
      'Thursday': 0,
      'Friday': 0,
      'Saturday': 0,
    };
    
    // Today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    appointmentsSnapshot.forEach((doc) => {
      const data = doc.data();
      totalAppointments++;
      
      // Count pending appointments
      if (data.status === "pending") {
        pendingAppointments++;
      }
      
      // Count today's appointments
      const appointmentDate = new Date(data.date);
      appointmentDate.setHours(0, 0, 0, 0);
      if (appointmentDate.getTime() === today.getTime()) {
        todayAppointments++;
      }
      
      // For weekly data
      const dayName = new Date(data.date).toLocaleString('en-US', { weekday: 'long' });
      if (weeklyData[dayName] !== undefined) {
        weeklyData[dayName]++;
      }
      
      // For service data
      const service = formatServiceName(data.service);
      if (serviceCounts[service]) {
        serviceCounts[service]++;
      } else {
        serviceCounts[service] = 1;
      }
    });
    
    // Format weekly data for chart
    const weeklyAppointmentsData = Object.keys(weeklyData).map(day => ({
      name: day,
      appointments: weeklyData[day],
    }));
    
    // Format service data for pie chart
    const patientsByServiceData = Object.keys(serviceCounts).map(service => ({
      name: service,
      value: serviceCounts[service],
    }));
    
    setStats({
      totalPatients,
      totalAppointments,
      pendingAppointments,
      todayAppointments,
      weeklyAppointmentsData,
      patientsByServiceData,
    });
  };

  const fetchRecentAppointments = async () => {
    const appointmentsQuery = query(
      collection(db, "appointments"),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    
    const appointmentsSnapshot = await getDocs(appointmentsQuery);
    const appointments: RecentAppointment[] = [];
    
    for (const doc of appointmentsSnapshot.docs) {
      const data = doc.data();
      
      // Get patient name
      let patientName = data.fullName;
      if (data.userId) {
        try {
          const userDoc = await getDocs(query(
            collection(db, "users"),
            where("uid", "==", data.userId)
          ));
          
          if (!userDoc.empty) {
            const userData = userDoc.docs[0].data();
            patientName = userData.displayName || data.fullName;
          }
        } catch (error) {
          console.error("Error fetching patient name:", error);
        }
      }
      
      appointments.push({
        id: doc.id,
        patientName,
        service: data.service,
        date: data.date,
        time: data.time,
        status: data.status,
      });
    }
    
    setRecentAppointments(appointments);
  };

  const fetchRecentPatients = async () => {
    const patientsQuery = query(
      collection(db, "users"),
      where("role", "==", "patient"),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    
    const patientsSnapshot = await getDocs(patientsQuery);
    const patients: RecentPatient[] = [];
    
    patientsSnapshot.forEach((doc) => {
      const data = doc.data();
      patients.push({
        id: doc.id,
        name: data.displayName || "No Name",
        email: data.email || "No Email",
        date: data.createdAt,
      });
    });
    
    setRecentPatients(patients);
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
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div>
          <Button 
            className="bg-[#34bdf2] hover:bg-[#2193c9]"
            onClick={() => navigate("/appointment")}
          >
            <i className="fas fa-plus mr-2"></i> New Appointment
          </Button>
        </div>
      </div>
      
      {loadingData ? (
        <div className="flex justify-center items-center py-20">
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalPatients}</div>
                <p className="text-xs text-gray-500 mt-1">
                  <i className="fas fa-user-circle mr-1"></i> Registered patients
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalAppointments}</div>
                <p className="text-xs text-gray-500 mt-1">
                  <i className="fas fa-calendar-check mr-1"></i> All time
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pending Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.pendingAppointments}</div>
                <p className="text-xs text-gray-500 mt-1">
                  <i className="fas fa-hourglass-half mr-1"></i> Awaiting confirmation
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Today's Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.todayAppointments}</div>
                <p className="text-xs text-gray-500 mt-1">
                  <i className="fas fa-calendar-day mr-1"></i> {new Date().toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Appointments</CardTitle>
                <CardDescription>Appointment distribution over the week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.weeklyAppointmentsData}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="appointments" fill="#34bdf2" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Patients by Service</CardTitle>
                <CardDescription>Distribution of patients across services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.patientsByServiceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {stats.patientsByServiceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
                <CardDescription>Latest appointment requests</CardDescription>
              </CardHeader>
              <CardContent>
                {recentAppointments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentAppointments.map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell className="font-medium">{appointment.patientName}</TableCell>
                            <TableCell>{formatServiceName(appointment.service)}</TableCell>
                            <TableCell>{formatDate(appointment.date)}</TableCell>
                            <TableCell>{formatStatus(appointment.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No recent appointments</p>
                )}
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/dashboard/patients")}
                  >
                    View All Appointments
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>New Patients</CardTitle>
                <CardDescription>Recently registered patients</CardDescription>
              </CardHeader>
              <CardContent>
                {recentPatients.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentPatients.map((patient) => (
                          <TableRow key={patient.id}>
                            <TableCell className="font-medium">{patient.name}</TableCell>
                            <TableCell>{patient.email}</TableCell>
                            <TableCell>
                              {patient.date?.toDate().toLocaleDateString() || "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No recent patients</p>
                )}
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/dashboard/patients")}
                  >
                    View All Patients
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
