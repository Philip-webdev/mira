import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, User,  LucideSchool, Mail } from "lucide-react";
import { Dispatch, SetStateAction } from "react";


interface CollegePaymentFormProps {
    IsFossuVisible: boolean;
    setFossuIsVisible: Dispatch<SetStateAction<boolean>>;
}

const FossuPaymentForm: React.FC<CollegePaymentFormProps> = ({ IsFossuVisible, setFossuIsVisible }) => {
  const navigate = useNavigate();

  const [submitting, notSubmitting] = useState<boolean>(false);
  // const [isVisible, setIsVisible] = useState(true);
  const [formData, setFormData] = useState({
    matricNumber: "",
    colleges: "",
    department: "",
    MainLevel: "",
    level: "",
    fresherLevel: "",
    email: "",
    fullname: "",
    desc: "College due"
  });

  const collegePrices: Record<string, {fresher: number, staylite:number}> = {
    "Federation of Oyo State Students Union (FOSSU)":{fresher: 1500, staylite: 1500},
  }

const email =  formData.email;
const matricNumber = formData.matricNumber;
const fullname = formData.fullname;
// const collegemain = formData.colleges;
// const mainCollege = collegemain.split(' ')[5]; // Extract "COLERM" from "College of Environmental Resources Management (COLERM)"
const collegeName ="Federation of Oyo State Students Union (FOSSU)";
const department = formData.department || "None";
const level = formData.level || "None";
const fresherLevel = formData.fresherLevel || "None";
const mainLevel = formData.MainLevel;
let amount = 0;

if (collegeName && mainLevel) {
  if (mainLevel === "Fresher/ Direct Entry") {
    amount = collegePrices[collegeName]?.fresher || 0;
  } else if (mainLevel === "Staylite") {
    amount = collegePrices[collegeName]?.staylite || 0;
  }
}
// const amountN = amount / 100;
const desc = formData.desc;

const payWithPaystack = async () => {
  notSubmitting(true); // <-- Start showing the loading overlay
  try {
    const requestPaystack = await fetch('https://Mira-backend-main.onrender.com/api/make-college-payment', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, matricNumber, fullname, collegeName, department, level, fresherLevel, mainLevel, amount})
    })

    const data = await requestPaystack.json();
    if(!requestPaystack.ok){
        notSubmitting(false);
        throw new Error(data.message || 'Failed to initialize transaction');
    }
    if (data.paymentLink) {
      
     window.location.href = data.paymentLink;
    }else{
      alert('Payment link not found');
      throw new Error('Payment link not found');
    }
  } catch (error) {
    console.error('Error:', error);
    notSubmitting(false);
  }
  console.log({ email, matricNumber, fullname, collegeName, department, level, fresherLevel, mainLevel});
}

// const payWithPaystack = async () => {
//   notSubmitting(true); // <-- Start showing the loading overlay

//   try {
//     const requestPaystack = await fetch('https://Miramain.onrender.com/initialize-transaction', {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, amount })
//     });
// if(requestPaystack.ok){
//     notSubmitting(false);
// }
//     const reply = await requestPaystack.json();
//     const access_code = reply.data.access_code;

//     // const popup = new PaystackPop();
//     // popup.resumeTransaction(access_code);

//     const handler = (window as any).PaystackPop.setup({
//       key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
//       email,
//       amount,
//       currency: "NGN",
//       reference: reply.data.reference,
//       access_code,
//       callback: (response: any) => {
//         const verifyTransaction = async () => {
//           const verification = await fetch(`https://Miramain.onrender.com/verify-transaction/${response.reference}`);
//           const verify = await verification.json();

//            if (verify.data?.status === "success") {
//              const savePayment = await fetch('https://Miramain.onrender.com/api/save-paymentCollege', {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json"
//               },
//               body: JSON.stringify({
//                 email,
//                 amount,
//                 matricNumber,
//                 fullname,
//                 college,
//                 department,
//                 mainLevel: formData.MainLevel,
//                 level,
//                 fresherLevel,
//                 reference: response.reference,
//                 desc
//               }),
//             });
//             if (savePayment.ok) {
//               notSubmitting(false);
//               console.log("Payment successful and saved to database");
//             }else {
//               notSubmitting(false);
//               console.error("Failed to save payment to database");
//             }
//             navigate(`/receipts/${response.reference}`, {state: {desc}});
//           }
//         };
//         verifyTransaction();
//       },
//       onclose: () => {
//          navigate('/home');
//       },
//     });

//     handler.openIframe();

//             const sendRef = fetch('https://payMira.onrender.com/refReceipt', {
//   method: 'POST',
//   headers: {
//         "Content-Type": "application/json",
//       },
//   body: JSON.stringify(handler.reference)  }
// );

//   } catch (err) {
//     notSubmitting(false); // <-- Hide loading on error
//     console.error(err);
//   }
// };

//   const colleges = [
//     "College of Environmental Resources Management (COLERM)",
//     "College of Physical Sciences (COLPHYS)"
//   ];

  const MainLevel = ["Fresher/ Direct Entry", "Staylite"];
  const levels = ["200", "300", "400", "500" ];
  const fresherLevels = ["100", "200"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
   // console.log("Form submitted:", formData);
  };

  return (
    <div className="space-y-4" style={{padding:'20px'}}>
      <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black transition-all duration-500 ease-in-out ${
        IsFossuVisible
          ? 'bg-opacity-60 opacity-100 scale-100' 
          : 'bg-opacity-0 opacity-0 scale-95 pointer-events-none'
      }`}>
        <button
              type="reset"
              onClick={() =>{setFossuIsVisible(false); setFormData({ matricNumber: "",
                                                                colleges: "",
                                                                department: "",
                                                                MainLevel: "",
                                                                level: "",
                                                                fresherLevel: "",
                                                                email: "",
                                                                fullname: "",
                                                                desc: "College due"})} }
              className="absolute top-3 right-7 text-white-500 hover:text-white-800 transition-colors"
            >
              ✕
          </button>
        <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-xl w-full max-w-3xl h-[85vh] overflow-y-auto rounded-2xl">
              <button
              type="reset"
              onClick={() =>{setFossuIsVisible(false); setFormData({ matricNumber: "",
                                                                colleges: "",
                                                                department: "",
                                                                MainLevel: "",
                                                                level: "",
                                                                fresherLevel: "",
                                                                email: "",
                                                                fullname: "",
                                                                desc: "College due"})} }
              className="absolute top-3 right-3 text-white-500 hover:text-gray-800 transition-colors"
            >
              ✕
            </button>
          <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <LucideSchool className="w-5 h-5" />
              Fossu Due Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="matric" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Matric Number
                </Label>
              <Input
  id="matric"
  type="text"
  pattern="\d{8}"
  maxLength={8} 
  onInput={(e) => {e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "");}}
  placeholder="e.g 20201735"
  value={formData.matricNumber}
  onChange={(e) =>
    setFormData({ ...formData, matricNumber: e.target.value })
  }
  className="border-border/50 focus:border-primary"
  required
/>

              </div> 

               <div className="space-y-2">
                  <Label htmlFor="fullname" className="flex items-center gap-2">
                    
                    Full Name
                  </Label>
                  <Input
                    id="fullname"
                    placeholder="e.g., John Ade"
                    value={formData.fullname}
                    onChange={(e) => setFormData({...formData, fullname: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="border-border/50 focus:border-primary"
                    required
                  />
                </div>

              {/* <div className="space-y-2">
                <Label htmlFor="college">College</Label>
                <Select 
                  value={formData.colleges}
                  onValueChange={(value) => setFormData({...formData, colleges: value})}
                  required
                >
                  <SelectTrigger className="border-border/50 focus:border-primary">
                    <SelectValue placeholder="Select your college" />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="level">Are you a Fresher or Staylite</Label>
                <Select
                  value={formData.MainLevel}
                  onValueChange={(value) => setFormData({...formData, MainLevel: value})}
                  required
                >
                  <SelectTrigger className="border-border/50 focus:border-primary">
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      formData.matricNumber.startsWith("2025") ?
                      (
                        MainLevel
                          .filter(lev => lev === "Fresher/ Direct Entry")
                          .map(level => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))
                      ) : (
                      MainLevel.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))
                      )
                    }
                  </SelectContent>
                </Select>
              </div>

              {formData.MainLevel === "Staylite" &&  <div className="space-y-2">
                <Label htmlFor="level">Select Your Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData({...formData, level: value})}
                  required
                >
                  <SelectTrigger className="border-border/50 focus:border-primary">
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
              }

              {formData.MainLevel === "Fresher/ Direct Entry" && <div className="space-y-2">
                <Label htmlFor="level">Select Your Level</Label>
                <Select
                  value={formData.fresherLevel}
                  onValueChange={(value) => setFormData({...formData, fresherLevel: value})}
                  required
                >
                  <SelectTrigger className="border-border/50 focus:border-primary">
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    {fresherLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level} {level === "100" ? "Level" : "Level D.E"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>}

              <div className="pt-4 border-t border-border/20 relative">
               {formData.MainLevel === "Fresher/ Direct Entry" && <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">College Due Amount:</span>
                  <span className="text-2xl font-bold text-primary">₦{amount.toLocaleString()}</span>
                </div>}

                {formData.MainLevel === "Staylite" && <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">College Due Amount:</span>
                  <span className="text-2xl font-bold text-primary">₦{amount.toLocaleString()}</span>
                </div>}

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
            
                <Button 
                  type="submit" onClick={payWithPaystack}
                  className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3"
                >
                  Proceed to Payment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FossuPaymentForm;
