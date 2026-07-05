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
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, User, GraduationCap, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ----------------- CONSTANTS -----------------
const MAIN_LEVELS = ["Fresher/ Direct Entry", "Staylite"];
const STAYLITE_LEVELS = ["200", "300", "400", "500"];
const FRESHER_LEVELS = ["100", "200 D.E"];

const PayAqua = () => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [checkLevel, setCheckLevel] = useState(false);

  const [formData, setFormData] = useState({
    matricNumber: "",
    department: "Aquaculture",
    college: "NAFIS",
    MainLevel: "",
    level: "",
    fresherLevel: "",
    email: "",
    reference: "",
    fullname: "",
    description: "Departmental due",
    deptLogo: "https://i.imgur.com/GLqKucy.jpeg",
    LedBy: "TEAM ALLAZELOS Led by Comr. Asaolu Emmanuel(ASHA)",
  });

  useEffect(() => {
    setCheckLevel(formData.MainLevel === "Staylite");
  }, [formData.MainLevel]);

  //   
  const email = formData.email;
  const matricNumber = formData.matricNumber;
  const fullname = formData.fullname;
  const department = formData.department;
  const level = formData.level;
  const fresherLevel = formData.fresherLevel;
  const college = formData.college;
  const amount = checkLevel ? 250000 : 550000;  
  const amountNaira = amount / 100;
  const description = formData.description;

 
  const payWithNomba = async () => {
    setIsSubmitting(true);

    try {
      const requestNomba = await fetch(
        "https://Miramain.onrender.com/initialize-transaction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, amount }),
        }
      );

      if (!requestNomba.ok) {
        throw new Error("Failed to initialize Nomba transaction");
      }

      const reply = await requestNomba.json();
      const { access_code, reference } = reply.data;

      const handler = (window as any).NombaPop.setup({
        key: import.meta.env.VITE_Nomba_PUBLIC_KEY,
        email,
        amount,
        currency: "NGN",
        reference,
        access_code,
        callback: async (response: any) => {
          try {
            const verification = await fetch(
              `https://Miramain.onrender.com/verify-transaction/${response.reference}`
            );
            const verify = await verification.json();

            if (verify.data?.status === "success") {
              setFormData({ ...formData, reference: response.reference });

              const savePayment = await fetch(
                "https://Miramain.onrender.com/aqua/save-payment",
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
                    description,
                   
                  }),
                }
              );

              if (savePayment.ok) {
                console.log("Payment successful and saved to database");
              } else {
                console.error("Failed to save payment to database");
              }

              setIsSubmitting(false);
              navigate(`/receipt`, { state: { formData } });
            }
          } catch (err) {
            console.error("Verification failed:", err);
            setIsSubmitting(false);
          }
        },
        onclose: () => {
          navigate("/home");
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

   
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    payWithNomba();
  }
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="shadow-md m-0 w-full bg-primary hover:bg-white hover:text-black transition-all duration-300 text-primary-foreground font-semibold py-3"
      >
        <CreditCard className="w-5 h-5 mr-2" />
        Aquaculture Due
      </Button>

      <div
        className={`transition-all duration-500 ease-in-out transform ${
          isVisible
            ? "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/70"
            : "hidden"
        }`}
      >
        <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-xl w-full max-w-3xl h-[85vh] rounded-2xl overflow-y-auto">
          <div>
            <Button
              className="flex absolute bg-red-600 hover:bg-red-700 justify-end rounded-full"
              onClick={() => setIsVisible(false)}
            >
              x
            </Button>
          </div>

          <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Aquaculture Departmental Due Payment
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  <SelectTrigger className="border-border/50 focus:border-primary">
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    {MAIN_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Staylite Levels */}
              {formData.MainLevel === "Staylite" && (
                <div className="space-y-2">
                  <Label htmlFor="level">Select Your Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) =>
                      setFormData({ ...formData, level: value })
                    }
                    required
                  >
                    <SelectTrigger className="border-border/50 focus:border-primary">
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAYLITE_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level} Level
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Fresher Levels */}
              {formData.MainLevel === "Fresher/ Direct Entry" && (
                <div className="space-y-2">
                  <Label htmlFor="fresherLevel">Select Your Level</Label>
                  <Select
                    value={formData.fresherLevel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, fresherLevel: value })
                    }
                    required
                  >
                    <SelectTrigger className="border-border/50 focus:border-primary">
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent>
                      {FRESHER_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level} {level === "100" ? "Level" : "Level D.E"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Matric Number */}
              <div className="space-y-2">
                <Label htmlFor="matric" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Matric Number
                </Label>
                <Input
                  id="matric"
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
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
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
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
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
                  <span className="text-muted-foreground">
                    Aquaculture Due Amount:
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    ₦{amountNaira.toLocaleString()}
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
        {isSubmitting && (
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

export default PayAqua;
