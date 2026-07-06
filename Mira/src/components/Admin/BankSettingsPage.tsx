import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Mail, Search, CheckCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  const inputClass = "w-full rounded-2xl border border-[#180b28]/10 bg-white/80 py-3 px-4 text-[#180b28] outline-none transition focus:border-[#b8bcef] focus:ring-2 focus:ring-[#b8bcef]/30 text-sm";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#180b28]/10 bg-white/70 text-[#180b28] backdrop-blur-xl transition hover:bg-white/90"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#180b28]">Bank Settings</h1>
          <p className="text-sm text-[#180b28]/60">Manage your settlement bank account</p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-5 py-3 text-sm text-green-700"
          >
            <CheckCircle size={16} />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bank Account Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl border border-[#180b28]/10 bg-white/70 p-8 backdrop-blur-xl shadow-lg"
      >
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#5f67ac]/10 blur-3xl" />
        <div className="relative">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#180b28] to-[#5f67ac] text-white shadow-lg">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#180b28]">Settlement Bank Account</h2>
              <p className="text-xs text-[#180b28]/60">Where your withdrawals will be sent</p>
            </div>
          </div>

          <form onSubmit={handleSaveBank} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#180b28]">Bank Code</label>
                <input
                  placeholder="e.g. 044"
                  value={bankCode}
                  onChange={(e) => { setBankCode(e.target.value); setError(null); setSuccess(null); }}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#180b28]">Account Number</label>
                <input
                  placeholder="10-digit number"
                  value={accountNumber}
                  onChange={(e) => { setAccountNumber(e.target.value); setError(null); setSuccess(null); }}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#180b28]">Account Name</label>
              <div className="flex gap-2">
                <input
                  placeholder="Auto-filled after lookup"
                  value={accountName}
                  readOnly
                  className={`${inputClass} bg-[#180b28]/5`}
                />
                <button
                  type="button"
                  onClick={handleLookup}
                  disabled={looking}
                  className="flex items-center gap-2 rounded-2xl border border-[#180b28]/10 bg-white/70 px-4 py-3 text-sm font-semibold text-[#180b28] backdrop-blur-xl transition hover:bg-white/90 disabled:opacity-50 whitespace-nowrap"
                >
                  <Search size={14} className={looking ? "animate-spin" : ""} />
                  {looking ? "Looking..." : "Lookup"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || !accountName}
              className="w-full rounded-2xl bg-gradient-to-r from-[#180b28] to-[#5f67ac] py-3.5 text-sm font-bold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Save Bank Account
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>

      {/* Owner Email Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-3xl border border-[#180b28]/10 bg-white/70 p-8 backdrop-blur-xl shadow-lg"
      >
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#b8bcef]/20 blur-3xl" />
        <div className="relative">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5f67ac] to-[#b8bcef] text-white shadow-lg">
              <Mail size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#180b28]">Update Owner Email</h2>
              <p className="text-xs text-[#180b28]/60">Change the email for notifications</p>
            </div>
          </div>

          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#180b28]">New Email</label>
              <input
                type="email"
                placeholder="owner@example.com"
                value={newEmail}
                onChange={(e) => { setNewEmail(e.target.value); setError(null); setSuccess(null); }}
                required
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={emailSaving}
              className="w-full rounded-2xl border border-[#180b28]/10 bg-white/70 py-3.5 text-sm font-bold text-[#180b28] backdrop-blur-xl transition hover:bg-white/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {emailSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#180b28]/30 border-t-[#180b28]" />
                  Updating...
                </>
              ) : (
                <>
                  <Mail size={16} />
                  Update Email
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
