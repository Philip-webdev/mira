import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Home, Library, User, CheckCheck, PanelRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiGet } from "@/lib/api";

const SearchReceipts = () => {
  const [receiptNumber, setReceiptNumber] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearched, setIsSearched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (receiptNumber.trim() === "") {
      setSearchResult(null);
      setIsSearched(false);
    }
  }, [receiptNumber]);

  const handleSearch = async () => {
    if (!receiptNumber.trim()) return;
    setSubmitting(true);

    try {
      const data = await apiGet(`/api/payments/receipts/${encodeURIComponent(receiptNumber)}`);
      setSearchResult(data?.data || data);
      setIsSearched(true);
    } catch (error) {
      console.error("Error fetching receipt:", error);
      setSearchResult(null);
      setIsSearched(true);
    } finally {
      setSubmitting(false);
    }
  };

  const getIconClass = (path: string) =>
    pathname === path ? "text-white" : "text-[#c9cbed]/70";

  const displayResult = () => {
    if (!searchResult) {
      return <p className="text-sm text-slate-500">No receipt found for this number.</p>;
    }

    return (
      <div className="space-y-3 rounded-3xl border border-[#5f67ac]/15 bg-[#f8f7ff] p-5 shadow-sm dark:border-[#5f67ac]/25 dark:bg-[#241436]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Student</p>
            <p className="text-lg font-semibold text-slate-950 dark:text-white">{searchResult.payerName || searchResult.fullname}</p>
          </div>
          <Badge variant={searchResult.paymentStatus === "completed" ? "default" : "secondary"}>{searchResult.paymentStatus || "Paid"}</Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-[#180b28]">
            <p className="text-xs uppercase text-slate-400">Reference</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">{searchResult.reference}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-[#180b28]">
            <p className="text-xs uppercase text-slate-400">Receipt No</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">{searchResult.receiptNo}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-[#180b28]">
            <p className="text-xs uppercase text-slate-400">Partner</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">{searchResult.partnerIdentifier}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-[#180b28]">
            <p className="text-xs uppercase text-slate-400">Amount Paid</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">{searchResult.amountPaid || searchResult.amount || "N/A"}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button size="sm" onClick={() => navigate("/receipt", { state: { searchResult } })}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="dark min-h-screen bg-[#180b28] text-white px-5 pb-28" style={{ fontFamily: "Sora, sans-serif" }}>
      <div className="max-w-4xl mx-auto py-6 space-y-8">
       

        <Card className="rounded-[2rem] border border-[#5f67ac]/25 bg-[#180b28] p-6 shadow-sm shadow-black/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-[#d8daf7]">
              <Search className="h-5 w-5" />
              Receipt Search
            </CardTitle>
            <CardDescription className="text-white dark:text-white">
              Enter your receipt number to retrieve your payment receipt.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 md:grid-cols-[1.4fr,_0.6fr]">
              <Input
                placeholder="Enter receipt number"
                value={receiptNumber}
                onChange={(e) => {
                  setReceiptNumber(e.target.value);
                  setIsSearched(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full bg-none"
              />
              <Button onClick={handleSearch} className="w-full bg-[#5f67ac] text-white hover:bg-[#4d559c]">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {isSearched && (
              <div className="rounded-[1.5rem] border border-[#5f67ac]/20 bg-[#f8f7ff] p-5 shadow-sm dark:border-[#5f67ac]/30 dark:bg-[#241436]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Search result for</p>
                    <p className="text-lg font-semibold text-slate-950 dark:text-white">{receiptNumber}</p>
                  </div>
                  <div className="rounded-3xl bg-[#5f67ac]/15 px-3 py-2 text-[11px] font-semibold text-[#d8daf7]">{searchResult ? "1 found" : "0 found"}</div>
                </div>
                <div className="relative mt-6">
                  {submitting && (
                    <div className="absolute inset-0 rounded-[1.5rem] bg-black/30 backdrop-blur-sm flex items-center justify-center z-20">
                      <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-6 text-slate-900 shadow-lg">
                        <div className="h-12 w-12 rounded-full border-4 border-[#d8daf7] border-t-[#5f67ac] animate-spin" />
                        <p className="font-semibold">Fetching receipt...</p>
                      </div>
                    </div>
                  )}
                  {displayResult()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

     <nav
        className="fixed bottom-4 left-1/2 z-50 flex items-center gap-10 rounded-full bg-[#5f67ac]/25 px-6 py-3 shadow-xl backdrop-blur-xl"
        style={{
          transform: "translateX(-50%)",
          boxShadow: "0 4px 12px rgba(0,0,0,.15)",
        }}
      >
        <button onClick={() => navigate("/home")} aria-label="Home" className={getIconClass("/home") + " transition"}>
          <PanelRight className="w-5 h-5" />
        </button>
        <button onClick={() => navigate("/Searchreceipts")} aria-label="Receipts" className={getIconClass("/Searchreceipts") + " transition"}>
          <CheckCheck className="w-5 h-5" />
        </button>
        <button onClick={() => navigate("/docs")} aria-label="Docs" className={getIconClass("/docs") + " transition"}>
          <Library className="w-5 h-5" />
        </button>
        <button onClick={() => navigate("/manager")} aria-label="Profile" className={getIconClass("/manager") + " transition"}>
          <User className="w-5 h-5" />
        </button>
      </nav>
    </div>
  );
};

export default SearchReceipts;
