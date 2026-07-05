import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { apiPost } from "@/lib/api";

export default function AdminRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    partnerIdentifier: "",
    partnerName: "",
    businessVertical: "",
    bankCode: "",
    accountNumber: "",
    accountName: "",
    ownerEmail: "",
    ownerPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await apiPost("/api/admin/auth/register", formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-xl font-semibold">Registration Successful</h2>
            <p className="text-muted-foreground">Your partner account has been created. You can now log in.</p>
            <Button onClick={() => navigate("/admin")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link to="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Partner Registration</CardTitle>
              <p className="text-center text-sm text-muted-foreground">Create a new partner and admin account</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="partnerIdentifier">Partner Identifier</Label>
                  <Input id="partnerIdentifier" name="partnerIdentifier" value={formData.partnerIdentifier} onChange={handleChange} placeholder="Unique partner ID" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partnerName">Partner / Organization Name</Label>
                  <Input id="partnerName" name="partnerName" value={formData.partnerName} onChange={handleChange} placeholder="e.g. COLERM" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessVertical">Business Vertical</Label>
                  <Input id="businessVertical" name="businessVertical" value={formData.businessVertical} onChange={handleChange} placeholder="e.g. education" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankCode">Bank Code</Label>
                    <Input id="bankCode" name="bankCode" value={formData.bankCode} onChange={handleChange} placeholder="e.g. 044" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input id="accountNumber" name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="10-digit account" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input id="accountName" name="accountName" value={formData.accountName} onChange={handleChange} placeholder="Name on bank account" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerEmail">Owner Email</Label>
                  <Input id="ownerEmail" name="ownerEmail" type="email" value={formData.ownerEmail} onChange={handleChange} placeholder="admin@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerPassword">Password</Label>
                  <div className="relative">
                    <Input id="ownerPassword" name="ownerPassword" type={showPassword ? "text" : "password"} value={formData.ownerPassword} onChange={handleChange} placeholder="Create a password" required className="pr-10" />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
                )}

                <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary/90">
                  {submitting ? "Registering..." : "Register Partner"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
