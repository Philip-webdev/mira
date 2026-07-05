import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, User, GraduationCap, Mail } from "lucide-react";

const SSLMPaymentForm = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    matricNumber: "",
    department: "SSLM",
    college: "ASSLAMS",
    MainLevel: "",
    level: "",
    fresherLevel: "",
    email: "",
    fullname: "",
    reference: "",
    description: "Departmental due",
    deptLogo: "https://i.imgur.com/g0YPRZQ.jpeg",
    LedBy: "TEAM ALPHACORE Led by Comr.Salami Akorede(Heskay)",
  });

  const [isStaylite, setIsStaylite] = useState<boolean>(false);

  useEffect(() => {
    setIsStaylite(formData.MainLevel === "Staylite");
  }, [formData.MainLevel]);

  // Derived values
  const amount = isStaylite ? 200000 : 600000; // kobo
  const amountN = amount / 100;

  // Payment function
  const payWithNomba = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "https://Miramain.onrender.com/initialize-transaction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, amount }),
        }
      );

      const data = await response.json();
      const access_code = data.data.access_code;

      const handler = (window as any).NombaPop.setup({
        key: import.meta.env.VITE_Nomba_PUBLIC_KEY,
        email: formData.email,
        amount,
        currency: "NGN",
        reference: data.data.reference,
        access_code,
        callback: async (resp: any) => {
          const verifyResponse = await fetch(
            `https://Miramain.onrender.com/verify-transaction/${resp.reference}`
          );
          const verifyData = await verifyResponse.json();

          if (verifyData.data?.status === "success") {
            setFormData({ ...formData, reference: resp.reference });

            const save = await fetch(
              "https://Miramain.onrender.com/sslm/save-payment",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...formData,
                  mainLevel: formData.MainLevel,
                  reference: resp.reference,
                  amount,
                }),
              }
            );

            if (save.ok) {
              console.log("Payment saved successfully");
              setLoading(false);
              navigate("/receipt", { state: { formData } });
            } else {
              setLoading(false);
              console.error("Failed to save payment");
            }
          }
        },
        onclose: () => {
          setLoading(false);
          navigate("/home");
        },
      });

      handler.openIframe();

      // Send reference separately
      fetch("https://payMira.onrender.com/refReceipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(handler.reference),
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const MainLevels = ["Fresher/ Direct Entry", "Staylite"];
  const Levels = ["200", "300", "400", "500"];
  const FresherLevels = ["100", "200 D.E"];

     const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    payWithNomba();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="shadow-md w-full bg-primary hover:bg-white hover:text-black transition-all duration-300 text-primary-foreground font-semibold py-3"
      >
        <CreditCard className="w-5 h-5 mr-2" />
        SSLM Due
      </Button>

      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/70">
          <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-xl w-full max-w-3xl h-[85vh] rounded-2xl overflow-y-auto">
            <div>
              <Button
                className="flex absolute bg-red-500 hover:bg-red-600 justify-end rounded-full"
                onClick={() => setIsVisible(false)}
              >
                x
              </Button>
            </div>

            <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                SSLM Departmental Due Payment
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Main Level */}
                <div className="space-y-2">
                  <Label htmlFor="mainLevel">Are you a Fresher or Staylite</Label>
                  <Select
                    value={formData.MainLevel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, MainLevel: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent>
                      {MainLevels.map((lvl) => (
                        <SelectItem key={lvl} value={lvl}>
                          {lvl}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Staylite Levels */}
                {formData.MainLevel === "Staylite" && (
                  <div className="space-y-2">
                    <Label>Select Your Level</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value) =>
                        setFormData({ ...formData, level: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your level" />
                      </SelectTrigger>
                      <SelectContent>
                        {Levels.map((lvl) => (
                          <SelectItem key={lvl} value={lvl}>
                            {lvl} Level
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Fresher Levels */}
                {formData.MainLevel === "Fresher/ Direct Entry" && (
                  <div className="space-y-2">
                    <Label>Select Your Level</Label>
                    <Select
                      value={formData.fresherLevel}
                      onValueChange={(value) =>
                        setFormData({ ...formData, fresherLevel: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your level" />
                      </SelectTrigger>
                      <SelectContent>
                        {FresherLevels.map((lvl) => (
                          <SelectItem key={lvl} value={lvl}>
                            {lvl} {lvl === "100" ? "Level" : "Level D.E"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Matric */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Matric Number
                  </Label>
                  <Input
                    placeholder="e.g., 20201735"
                    value={formData.matricNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, matricNumber: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    placeholder="e.g., John Ade"
                    value={formData.fullname}
                    onChange={(e) =>
                      setFormData({ ...formData, fullname: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="e.g., john.ade@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Amount Display */}
                <div className="pt-4 border-t border-border/20">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-muted-foreground">SSLM Due Amount:</span>
                    <span className="text-2xl font-bold text-primary">
                      ₦{amountN.toLocaleString()}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3"
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-white rounded-lg p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-700 text-lg font-medium">
                  Processing your payment...
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SSLMPaymentForm;
