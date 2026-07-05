import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, ArrowUpCircle } from "lucide-react";
import { apiGet } from "@/lib/api";

export default function WithdrawalsPage() {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWithdrawals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet("/api/admin/partner/withdrawals");
      setWithdrawals(Array.isArray(data) ? data : data.withdrawals || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch withdrawals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Withdrawal History</h1>
        <Button variant="ghost" size="icon" onClick={fetchWithdrawals} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 h-20" />
            </Card>
          ))}
        </div>
      ) : withdrawals.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ArrowUpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No withdrawals yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {withdrawals.map((w: any, i: number) => (
            <Card key={w.id || i}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">₦{w.amount?.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {w.createdAt ? new Date(w.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <Badge variant={w.status === "completed" ? "default" : w.status === "pending" ? "secondary" : "destructive"}>
                  {w.status || "pending"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
