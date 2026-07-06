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
import AdminRegister from "./pages/AdminRegister";
import PrivacyPolicy from "./components/policy";
import Hotline from "./components/hotlline";
import ProtectedRouteComponent from "./components/ProtectedRoute";
import FoodPage from "./pages/food";
import TicketsPage from "./pages/ticket";
import RestServicesPage from "./pages/rest";
import SearchReceipts from "./components/SearchReceipts";
import CtaReceipt from "./components/ctaReceipt";
import GenReceipt from "./components/GenReceipt";
import NewsComponent from "./pages/announce";
import { AdmissionModal } from "./pages/Admissionmodal";
import SharePurchaseForm from "./components/SharePurchaseForm";
import AdminDashboard from "./components/AdminDashboard";
import SplashScreen from "./pages/SplashScreen";
import AboutUs from "./components/aboutus";
import DashboardShell from "./components/Admin/DashboardShell";
import PaymentsPage from "./components/Admin/Payments/PaymentPage";
import BalancePage from "./components/Admin/BalancePage";
import WithdrawPage from "./components/Admin/WithdrawPage";
import WithdrawalsPage from "./components/Admin/WithdrawalsPage";
import BankSettingsPage from "./components/Admin/BankSettingsPage";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import Unauthorized from "./pages/Unauthorized";
const queryClient = new QueryClient();

const AdmissionRoute = () => {
  const navigate = useNavigate();
  return <AdmissionModal open={true} onClose={() => navigate("/")} />;
};

const AppRoutes = () => (
  <Routes>
    {/* Auth Routes - Public */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    {/* <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/verify-email" element={<VerifyEmail />} />
    <Route path="/reset-password" element={<ResetPassword />} /> */}
    <Route path="/unauthorized" element={<Unauthorized />} />

    {/* Public Routes */}
    <Route path="/" element={<Index />} />
    <Route path="/splash" element={<SplashScreen />} />
    <Route path="/about" element={<AboutUs />} />
    <Route path="/blogs" element={<Docus />} />
    <Route path="/privacy" element={<PrivacyPolicy />} />
    <Route path="/admission" element={<AdmissionRoute />} />
    <Route path="/Miracare" element={<Hotline />} />
    <Route path="/news" element={<NewsComponent />} />

    {/* Protected Routes - Authentication Required */}
    <Route
      path="/home"
      element={
        // <MainApp />
        <ProtectedRouteComponent>
          <MainApp />
        </ProtectedRouteComponent>
      }
    />
    <Route
      path="/sug-payment"
      element={
        <ProtectedRouteComponent>
          <SugPaymentForm />
        </ProtectedRouteComponent>
      }
    />
    <Route
      path="/receipts"
      element={
        <ProtectedRouteComponent>
          <Receipt />
        </ProtectedRouteComponent>
      }
    />
    <Route
      path="/receipt"
      element={
        <ProtectedRouteComponent>
          <CtaReceipt />
        </ProtectedRouteComponent>
      }
    />
    <Route
      path="/Searchreceipts"
      element={
        <ProtectedRouteComponent>
          <SearchReceipts />
        </ProtectedRouteComponent>
      }
    />
    <Route
      path="/generate-receipt"
      element={
        <ProtectedRouteComponent>
          <GenReceipt />
        </ProtectedRouteComponent>
      }
    />
    <Route
      path="/manager"
      element={
        <ProtectedRouteComponent requiredRoles={["admin"]}>
          <Manager />
        </ProtectedRouteComponent>
      }
    />
    <Route
      path="/admin"
      element={
        <ProtectedRouteComponent requiredRoles={["admin"]}>
          <AdminPanel />
        </ProtectedRouteComponent>
      }
    />
    <Route
      path="/admin/:college"
      element={
        <ProtectedRouteComponent requiredRoles={["admin"]}>
          <DashboardShell />
        </ProtectedRouteComponent>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="payments" element={<PaymentsPage />} />
    </Route>
    <Route
      path="/food"
      element={
        <ProtectedRouteComponent>
          <FoodPage />
        </ProtectedRouteComponent>
      }
    />
    <Route
      path="/tickets"
      element={
        <ProtectedRouteComponent>
          <TicketsPage />
        </ProtectedRouteComponent>
      }
    />
    <Route
      path="/rest"
      element={
        <ProtectedRouteComponent>
          <RestServicesPage />
        </ProtectedRouteComponent>
      }
    />
    <Route
      path="/invest"
      element={
        <ProtectedRouteComponent>
          <SharePurchaseForm />
        </ProtectedRouteComponent>
      }
    />

    {/* 404 Route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route
              path="/admin/:college"
              element={
                <ProtectedRouteComponent requiredRoles={["admin"]}>
                  <DashboardShell />
                </ProtectedRouteComponent>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="balance" element={<BalancePage />} />
              <Route path="withdraw" element={<WithdrawPage />} />
              <Route path="withdrawals" element={<WithdrawalsPage />} />
              <Route path="bank-settings" element={<BankSettingsPage />} />
            </Route>
            {/* <Route path="/admin/aqua" element={<ProtectedRoute>< AquaDashboard /></ProtectedRoute>}/> */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/Miracare" element={<Hotline />} />

            <Route path="/news" element={<NewsComponent />} />
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
