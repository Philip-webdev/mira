import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building2, Mail, Search } from "lucide-react";
import { apiPost } from "@/lib/api";

export default function BankSettingsPage() {
  const navigate = useNavigate();
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [looking, setLooking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [emailSaving, setEmailSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLookup = async () => {
    if (!accountNumber || !bankCode) {
      setError("Enter account number and bank code first");
      return;
    }
    setLooking(true);
    setError(null);
    try {
      const data = await apiPost("/api/admin/partner/bank-lookup", { accountNumber, bankCode });
      setAccountName(data.accountName || "");
    } catch (err: any) {
      setError(err.message || "Lookup failed");
    } finally {
      setLooking(false);
    }
  };

  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || !bankCode || !accountName) {
      setError("Please lookup the account name first");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await apiPost("/api/admin/partner/bank-account", { accountNumber, bankCode });
      setSuccess("Bank account updated successfully");
    } catch (err: any) {
      setError(err.message || "Failed to update bank account");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    setEmailSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await apiPost("/api/admin/partner/update-owner-email", { ownerEmail: newEmail });
      setSuccess("Owner email updated successfully");
    } catch (err: any) {
      setError(err.message || "Failed to update email");
    } finally {
      setEmailSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Bank Settings</h1>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      )}
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Bank Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankCode">Bank Code</Label>
              <Input id="bankCode" placeholder="e.g. 044" value={bankCode} onChange={(e) => { setBankCode(e.target.value); setError(null); setSuccess(null); }} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input id="accountNumber" placeholder="10-digit number" value={accountNumber} onChange={(e) => { setAccountNumber(e.target.value); setError(null); setSuccess(null); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <div className="flex gap-2">
              <Input id="accountName" placeholder="Auto-filled after lookup" value={accountName} readOnly className="bg-muted" />
              <Button type="button" variant="outline" onClick={handleLookup} disabled={looking}>
                <Search className={`h-4 w-4 mr-2 ${looking ? "animate-spin" : ""}`} />
                Lookup
              </Button>
            </div>
          </div>
          <form onSubmit={handleSaveBank}>
            <Button type="submit" disabled={saving || !accountName} className="w-full">
              {saving ? "Saving..." : "Save Bank Account"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Update Owner Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newEmail">New Email</Label>
              <Input id="newEmail" type="email" placeholder="owner@example.com" value={newEmail} onChange={(e) => { setNewEmail(e.target.value); setError(null); setSuccess(null); }} required />
            </div>
            <Button type="submit" disabled={emailSaving} className="w-full">
              {emailSaving ? "Updating..." : "Update Email"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
