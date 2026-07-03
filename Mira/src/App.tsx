import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MainApp from "./pages/mainApp";
import { useState } from "react";
import CollegePaymentForm from "./components/collegeDues";
import DepartmentalPaymentForm from "./components/departmentaldue";
import SugPaymentForm from "./components/sugDue";
import Receipt from "./components/receipts";    
import Docus from "./components/Docs";
import Manager from "./components/fundManagement";
import AdminPanel from "./pages/AdminPanel";
import PrivacyPolicy from "./components/policy";
import ColermDashboard from "./components/adminColerm";
import GeoDashboard from "./components/adminGeo";
import SslmDashboard from "./components/adminSslm";
import WmaDashboard from "./components/adminWma";
import AquaDashboard from "./components/adminAqua";
import EmtDashboard from "./components/adminEmt";
import Hotline from "./components/hotlline";
import ProtectedRoute from "./pages/ProtectedRoute";
import FoodPage from "./pages/food";
import TicketsPage from "./pages/ticket";
import RestServicesPage from "./pages/rest";
import SearchReceipts from "./components/SearchReceipts";
import CtaReceipt from "./components/ctaReceipt";
import PbstDashboard from "./components/adminPbst";
import PpcpDashboard from "./components/adminPpcp";
import ColphysDashboard from "./components/adminColphys";
import NapsDashboard from "./components/adminNaps";
import CptDashboard from "./components/adminCpt";
import GenReceipt from "./components/GenReceipt";
import FossuDashboard from "./components/adminFossu";
import NewsComponent from "./pages/announce";
import { AdmissionModal } from "./pages/Admissionmodal";
import SharePurchaseForm from "./components/SharePurchaseForm";
import AdminDashboard from "./components/AdminDashboard";
import SplashScreen from "./pages/SplashScreen";
import AboutUs from "./components/aboutus";
import DashboardShell from "./components/Admin/DashboardShell";
import PaymentsPage from "./components/Admin/Payments/PaymentPage";
const queryClient = new QueryClient();


const AdmissionRoute = () => {
  const navigate = useNavigate();
  return <AdmissionModal open={true} onClose={() => navigate('/')} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/home" element={<MainApp />} />
          {/* <Route path="/college-payment" element={<CollegePaymentForm />} />
          <Route path="/departmental-payment" element={<DepartmentalPaymentForm />} /> */}
          <Route path="/sug-payment" element={<SugPaymentForm />} />
          <Route path="/receipts" element={<Receipt />} />
           <Route path="/receipt" element={<CtaReceipt />} />
          <Route path="/Searchreceipts" element={<SearchReceipts />} />
          <Route path="/generate-receipt" element={<GenReceipt />} />
          <Route path="/blogs" element={<Docus />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
           <Route path="/admission" element={<AdmissionRoute />} />
          <Route path="/manager" element={<Manager />} />
          <Route path="/admin" element={<AdminPanel />} />
          {/* <Route path="/admin/:college" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}/>
          <Route path="/admin/aqua" element={<ProtectedRoute>< AquaDashboard /></ProtectedRoute>}/> */}
          <Route path="/about" element={<AboutUs/>} />
          <Route path="/admin/:college" element={<ProtectedRoute><DashboardShell /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="payments" element={<PaymentsPage />} />
          </Route>
          {/* <Route path="/admin/aqua" element={<ProtectedRoute>< AquaDashboard /></ProtectedRoute>}/> */}
          <Route path="/Miracare" element={<Hotline/>} />
          
          <Route path="/news" element={<NewsComponent/>} />
          <Route path="/food" element={<FoodPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/rest" element={<RestServicesPage />} />
          <Route path="/invest" element={<SharePurchaseForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
