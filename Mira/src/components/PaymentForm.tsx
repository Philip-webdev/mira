import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, User, GraduationCap, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

type PaymentFormProps = {
  department: string;
  college: string;
  fresherAmount: number;
  stayliteAmount: number;
  deptLogo: string;
  ledBy: string;
};

const PaymentForm = ({ department, college, fresherAmount, stayliteAmount, deptLogo, ledBy }: PaymentFormProps) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [formData, setFormData] = useState({
    matricNumber: "",
    department,
    college,
    mainLevel: "",
    reference: "",
    level: "",
    fresherLevel: "",
    email: "",
    fullname: "",
    description: "Departmental due",
    deptLogo,
    ledBy,
  });

  const [checkLevel, setCheckLevel] = useState(false);

  useEffect(() => {
    setCheckLevel(formData.mainLevel === "Staylite");
  }, [formData.mainLevel]);

  const email = formData.email;
  const matricNumber = formData.matricNumber;
  const fullname = formData.fullname;
  const level = formData.level;
  const fresherLevel = formData.fresherLevel;
  const amount = checkLevel ? stayliteAmount * 100 : fresherAmount * 100; // in kobo
  const desc = formData.description;

  const payWithPaystack = async () => {
    setSubmitting(true);

    try {
      const requestPaystack = await fetch("https://Miramain.onrender.com/initialize-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount }),
      });

      const reply = await requestPaystack.json();
      const access_code = reply.data.access_code;

      const handler = (window as any).PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email,
        amount,
        currency: "NGN",
        reference: reply.data.reference,
        access_code,
        callback: async (response: any) => {
          const verification = await fetch(
            `https://Miramain.onrender.com/verify-transaction/${response.reference}`
          );
          const verify = await verification.json();

          if (verify.data?.status === "success") {
            setFormData({ ...formData, reference: response.reference });

            const savePayment = await fetch("https://Miramain.onrender.com/api/save-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email,
                amount,
                matricNumber,
                fullname,
                college,
                department,
                mainLevel: formData.mainLevel,
                level,
                fresherLevel,
                reference: response.reference,
                desc,
                deptLogo,
                ledBy,
              }),
            });

            if (savePayment.ok) {
              console.log("Payment saved to DB");
              navigate(`/receipts`, { state: { formData } });
            } else {
              console.error("Failed to save payment");
            }
          }
          setSubmitting(false);
        },
        onclose: () => navigate("/home"),
      });

      handler.openIframe();
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  const MainLevel = ["Fresher/ Direct Entry", "Staylite"];
  const levels = ["200", "300", "400", "500"];
  const fresherLevels = ["100", "200 D.E"];

  return (
    <div className="max-w-2xl mx-auto px-4 space-y-6">
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="shadow-md w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
      >
        <CreditCard className="w-5 h-5 mr-2" />
        {department} Due
      </Button>

      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60">
          <Card className="bg-card/95 backdrop-blur-sm shadow-xl w-full max-w-3xl h-[85vh] rounded-2xl overflow-y-auto relative">
            <Button
              className="absolute top-4 right-4 bg-red-500 rounded-full text-white"
              onClick={() => setIsVisible(false)}
            >
              x
            </Button>
            <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                {department} Departmental Due Payment
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="level">Are you a Fresher or Staylite</Label>
                  <Select
                    value={formData.mainLevel}
                    onValueChange={(value) => setFormData({ ...formData, mainLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent>
                      {MainLevel.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.mainLevel === "Staylite" && (
                  <div className="space-y-2">
                    <Label>Select Your Level</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value) => setFormData({ ...formData, level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your level" />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level} Level
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.mainLevel === "Fresher/ Direct Entry" && (
                  <div className="space-y-2">
                    <Label>Select Your Level</Label>
                    <Select
                      value={formData.fresherLevel}
                      onValueChange={(value) => setFormData({ ...formData, fresherLevel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your level" />
                      </SelectTrigger>
                      <SelectContent>
                        {fresherLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Inputs */}
                <div>
                  <Label>Matric Number</Label>
                  <Input
                    value={formData.matricNumber}
                    onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                {/* Amount */}
                <div className="pt-4 border-t border-border/20">
                  <div className="flex justify-between items-center mb-4">
                    <span>Due Amount:</span>
                    <span className="text-2xl font-bold text-primary">
                      ₦{checkLevel ? stayliteAmount.toLocaleString() : fresherAmount.toLocaleString()}
                    </span>
                  </div>
                  <Button onClick={payWithPaystack} className="w-full bg-gradient-primary text-white">
                    Proceed to Payment
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {submitting && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p>Processing your payment...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
