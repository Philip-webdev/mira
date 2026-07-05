import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wallet, RefreshCw } from "lucide-react";
import { apiGet } from "@/lib/api";

export default function BalancePage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<{ ledgerBalance: number; gatewayBalance: number; gateway: string; subAccountId: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet("/api/admin/partner/balance");
      setBalance(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch balance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Balance</h1>
        <Button variant="ghost" size="icon" onClick={fetchBalance} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 h-32" />
            </Card>
          ))}
        </div>
      ) : balance ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Ledger Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₦{balance.ledgerBalance?.toLocaleString() || "0.00"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Gateway Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₦{balance.gatewayBalance?.toLocaleString() || "0.00"}</p>
              <p className="text-xs text-muted-foreground mt-1">Via {balance.gateway} ({balance.subAccountId})</p>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
