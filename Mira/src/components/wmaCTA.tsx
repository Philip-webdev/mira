import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, User, GraduationCap, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PayWMA = () => {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [checkLevel, setCheckLevel] = useState<boolean>(false);

 
  const [formData, setFormData] = useState({
    matricNumber: "",
    department: "WMA",
    college: "WREMAMSA",
    amount: 5000, // default Fresher
    mainLevel: "",
    level: "",
    reference: "",
    fresherLevel: "",
    email: "",
    fullname: "",
    description: "Departmental due",
    deptLogo: "https://i.imgur.com/Mq6aWRG.jpeg",
    ledBy: "Led by Comrade Lord_Wesley",
  });

    
  useEffect(() => {
    const staylite = formData.mainLevel === "Staylite";
    setCheckLevel(staylite);

    setFormData((prev) => ({
      ...prev,
      amount: staylite ? 3000 : 5000,
    }));
  }, [formData.mainLevel]);

 
  const mainLevels = ["Fresher/ Direct Entry", "Staylite"];
  const levels = ["200", "300", "400", "500"];
  const fresherLevels = ["100", "200"];

 
  // const payWithNomba = async () => {
  //   setSubmitting(true);

  //   try {
     
  //     const response = await fetch("https://Miramain.onrender.com/initialize-transaction", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email: formData.email, amount: formData.amount * 100 }), // kobo
  //     });

  //     const data = await response.json();
  //     if (!response.ok) throw new Error(data.message || "Failed to initialize transaction");

  //     const { reference, access_code } = data.data;

       
  //     // const handler = NombaPop.setup({
  //     //   key: import.meta.env.VITE_Nomba_PUBLIC_KEY,
  //     //   email: formData.email,
  //     //   amount: formData.amount * 100,
  //     //   currency: "NGN",
  //     //   reference,
  //     //   access_code,
  //     //   callback: async (res: any) => {
  //     //     try {
         
  //     //       const verification = await fetch(`https://Miramain.onrender.com/verify-transaction/${res.reference}`);
  //     //       const verify = await verification.json();

  //     //       if (verify.data?.status === "success") {
              
  //     //         const savePayment = await fetch("https://Miramain.onrender.com/wma/save-payment", {
  //     //           method: "POST",
  //     //           headers: { "Content-Type": "application/json" },
  //     //           body: JSON.stringify({ ...formData, reference: res.reference }),
  //     //         });

  //     //         if (!savePayment.ok) throw new Error("Failed to save payment to DB");

                
 
             
  //     //         navigate(`/receipt`, { state: { formData, reference: res.reference } });
  //     //       }
  //     //     } catch (err) {
  //     //       console.error("Error verifying/saving payment:", err);
  //     //     } finally {
  //     //       setSubmitting(false);
  //     //     }
  //     //   },
  //     //   onClose: () => {
  //     //     setSubmitting(false);
  //     //     navigate("/home");
  //     //   },
  //     // });

  //     handler.openIframe();
  //   } catch (err) {
  //     console.error("Payment error:", err);
  //     setSubmitting(false);
  //   }
  // };
 const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // payWithNomba();
  }
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Toggle Button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="shadow-md m-0 w-full bg-primary hover:bg-white hover:text-black transition-all duration-300 text-primary-foreground font-semibold py-3 "
      >
        <CreditCard className="w-5 h-5 mr-2" />
        WMA Due
      </Button>

      {/* Modal */}
      <div
        className={`transition-all duration-500 ease-in-out transform ${
          isVisible
            ? "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/70"
            : "hidden"
        } `}
      >
        <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-xl w-full max-w-3xl h-[85vh] rounded-2xl overflow-y-auto">
          <div>
            <Button
              className="flex absolute bg-red-600 justify-end rounded-full"
              onClick={() => setIsVisible(false)}
            >
              x
            </Button>
          </div>

          <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              WMA Departmental Due Payment
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            <form
              onSubmit={ handleSubmit} 
              className="space-y-6"
            >
              {/* Fresher / Staylite */}
              <div className="space-y-2">
                <Label htmlFor="mainLevel">Are you a Fresher or Staylite</Label>
                <Select
                  value={formData.mainLevel}
                  onValueChange={(value) => setFormData({ ...formData, mainLevel: value })}
                  required
                >
                  <SelectTrigger className="border-border/50 focus:border-primary">
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    {mainLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Staylite Levels */}
              {formData.mainLevel === "Staylite" && (
                <div className="space-y-2">
                  <Label htmlFor="level">Select Your Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                    required
                  >
                    <SelectTrigger className="border-border/50 focus:border-primary">
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

              
              {formData.mainLevel === "Fresher/ Direct Entry" && (
                <div className="space-y-2">
                  <Label htmlFor="fresherLevel">Select Your Level</Label>
                  <Select
                    value={formData.fresherLevel}
                    onValueChange={(value) => setFormData({ ...formData, fresherLevel: value })}
                    required
                  >
                    <SelectTrigger className="border-border/50 focus:border-primary">
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent>
                      {fresherLevels.map((lvl) => (
                        <SelectItem key={lvl} value={lvl}>
                          {lvl} {lvl === "100" ? "Level" : "Level D.E"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

           
              <div className="space-y-2">
                <Label htmlFor="matric" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Matric Number
                </Label>
                <Input
                  id="matric"
                  placeholder="e.g., 20201735"
                  value={formData.matricNumber}
                  onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value })}
                  className="border-border/50 focus:border-primary"
                  required
                />
              </div>

               
              <div className="space-y-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
                  placeholder="e.g., John Ade"
                  value={formData.fullname}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                  className="border-border/50 focus:border-primary"
                  required
                />
              </div>

           
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-border/50 focus:border-primary"
                  required
                />
              </div>
 
              <div className="pt-4 border-t border-border/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">WMA Due Amount:</span>
                  <span className="text-2xl font-bold text-primary">₦{formData.amount.toLocaleString()}</span>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3"
                  disabled={submitting}
                >
                  {submitting ? "Processing..." : "Proceed to Payment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Overlay Loader */}
        {submitting && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-700 text-lg font-medium">Processing your payment...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayWMA;
