import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Testimonials from "@/pages/Testimonials";
import Contact from "@/pages/Contact";
import AppointmentBooking from "@/pages/AppointmentBooking";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import PatientProfile from "@/pages/PatientProfile";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import PatientRecords from "@/pages/dashboard/PatientRecords";
import TreatmentStages from "@/pages/dashboard/TreatmentStages";
import DoctorManagement from "@/pages/dashboard/DoctorManagement";
import AdminAuth from "@/pages/admin/AdminAuth";
import CreateSuperusers from "@/pages/admin/CreateSuperusers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LiveChat from "@/components/layout/LiveChat";
import Products from "@/pages/Products";
import Blog from "@/pages/Blog";


function App() {
  return (
    <>
      <Header />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          <Route path="/products" component={Products} />
          <Route path="/blog" component={Blog} />
          <Route path="/testimonials" component={Testimonials} />
          <Route path="/contact" component={Contact} />
          <Route path="/appointment" component={AppointmentBooking} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/profile">
            <ProtectedRoute>
              <PatientProfile />
            </ProtectedRoute>
          </Route>
          <Route path="/dashboard">
            <ProtectedRoute requiredRole="doctor">
              <DashboardHome />
            </ProtectedRoute>
          </Route>
          <Route path="/dashboard/patients">
            <ProtectedRoute requiredRole="doctor">
              <PatientRecords />
            </ProtectedRoute>
          </Route>
          <Route path="/dashboard/treatment/:patientId?">
            <ProtectedRoute requiredRole="doctor">
              <TreatmentStages />
            </ProtectedRoute>
          </Route>
          <Route path="/dashboard/doctors">
            <ProtectedRoute requiredRole="owner">
              <DoctorManagement />
            </ProtectedRoute>
          </Route>
          <Route path="/admin/auth" component={AdminAuth} />
          <Route path="/admin/superusers" component={CreateSuperusers} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <LiveChat />
      <Toaster />
    </>
  );
}

export default App;