import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowUpCircle } from "lucide-react";
import { apiPost } from "@/lib/api";

export default function WithdrawPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await apiPost("/api/admin/partner/withdraw", { amount: numAmount });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Withdrawal failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Withdraw</h1>
        </div>
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-xl font-semibold">Withdrawal Initiated</h2>
            <p className="text-muted-foreground">Your withdrawal of ₦{parseFloat(amount).toLocaleString()} has been submitted for processing.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate("/admin/withdrawals")}>View History</Button>
              <Button onClick={() => navigate(-1)}>Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Withdraw</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5" />
            Initiate Withdrawal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(null); }}
                required
              />
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
            )}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Processing..." : "Withdraw"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
