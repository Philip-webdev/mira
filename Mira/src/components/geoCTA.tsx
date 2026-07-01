import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CreditCard, User, GraduationCap, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PayGeo = () => {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [formData, setFormData] = useState({
    matricNumber: "",
    department: "Geology",
    college: "GEOSA",
    MainLevel: "",
    reference: "",
    level: "",
    fresherLevel: "",
    email: "",
    fullname: "",
    description: "Departmental due",
    deptLogo: "https://i.imgur.com/hO5hPIs.jpeg",
    LedBy: "Team Threshold Led by Comrade Fhizeey",
  });

  const [checkLevel, setCheckLevel] = useState(false);

  useEffect(() => {
    setCheckLevel(formData.MainLevel === "Staylite");
  }, [formData.MainLevel]);

  // destructured for easier usage
  const { email, matricNumber, fullname, level, fresherLevel } = formData;
  const department = "Geology";
  const college = "GEOSA";
  const amount = checkLevel ? 350000 : 500000; // in kobo
  const desc = formData.description;

  const payWithPaystack = async () => {
    setSubmitting(true);

    try {
      const res = await fetch(
        "https://Miramain.onrender.com/initialize-transaction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, amount }),
        }
      );

      const reply = await res.json();

      if (!res.ok) throw new Error(reply?.message || "Transaction init failed");

      const { access_code, reference } = reply.data;

      const handler = (window as any).PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email,
        amount,
        currency: "NGN",
        reference,
        access_code,
        callback: async (response: any) => {
          try {
            const verifyRes = await fetch(
              `https://Miramain.onrender.com/verify-transaction/${response.reference}`
            );
            const verify = await verifyRes.json();

            if (verify.data?.status === "success") {
              setFormData({ ...formData, reference: response.reference });

              const saveRes = await fetch(
                "https://Miramain.onrender.com/geo/save-payment",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email,
                    amount,
                    matricNumber,
                    fullname,
                    college,
                    department,
                    mainLevel: formData.MainLevel,
                    level,
                    fresherLevel,
                    reference: response.reference,
                    desc,
                    deptLogo: formData.deptLogo,
                    LedBy: formData.LedBy,
                  }),
                }
              );

              if (!saveRes.ok) {
                console.error("Failed to save payment to database");
              }

              setSubmitting(false);
              navigate("/receipt", { state: { formData } });
            }
          } catch (err) {
            console.error(err);
            setSubmitting(false);
          }
        },
        onclose: () => {
          setSubmitting(false);
          navigate("/home");
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  const MainLevelOptions = ["Fresher/ Direct Entry", "Staylite"];
  const levels = ["200", "300", "400", "500"];
  const fresherLevels = ["100", "200 D.E"];

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    payWithPaystack();
  };
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="shadow-md w-full bg-primary hover:bg-white hover:text-black transition-all duration-300 text-primary-foreground font-semibold py-3"
      >
        <CreditCard className="w-5 h-5 mr-2" />
        Geology Due
      </Button>

      <div
        className={`transition-all duration-500 ease-in-out transform ${
          isVisible
            ? "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black"
            : "hidden"
        }`}
      >
        <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-xl w-full max-w-3xl h-[85vh] rounded-2xl overflow-y-auto">
          <div>
            <Button
              className="flex absolute bg-red-500 justify-end rounded-full"
              onClick={() => setIsVisible(!isVisible)}
            >
              x
            </Button>
          </div>

          <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Geology Departmental Due Payment
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Fresher or Staylite */}
              <div className="space-y-2">
                <Label>Are you a Fresher or Staylite</Label>
                <Select
                  value={formData.MainLevel}
                  onValueChange={(val) =>
                    setFormData({ ...formData, MainLevel: val })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    {MainLevelOptions.map((lvl) => (
                      <SelectItem key={lvl} value={lvl}>
                        {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional Level Dropdowns */}
              {formData.MainLevel === "Staylite" && (
                <div className="space-y-2">
                  <Label>Select Your Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(val) =>
                      setFormData({ ...formData, level: val })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((lvl) => (
                        <SelectItem key={lvl} value={lvl}>
                          {lvl} Level
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.MainLevel === "Fresher/ Direct Entry" && (
                <div className="space-y-2">
                  <Label>Select Your Level</Label>
                  <Select
                    value={formData.fresherLevel}
                    onValueChange={(val) =>
                      setFormData({ ...formData, fresherLevel: val })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent>
                      {fresherLevels.map((lvl) => (
                        <SelectItem key={lvl} value={lvl}>
                          {lvl === "100" ? `${lvl} Level` : `${lvl} Level D.E`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Matric Number */}
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

              {/* Payment Section */}
              <div className="pt-4 border-t border-border/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">
                    Geology Due Amount:
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    ₦{checkLevel ? "3,500" : "5,000"}
                  </span>
                </div>

                <Button
                  type="button"
                  
                  className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3"
                >
                  Proceed to Payment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {submitting && (
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
    </div>
  );
};

export default PayGeo;
