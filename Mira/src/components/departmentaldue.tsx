import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, User,  LucideSchool, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import { apiPost } from "@/lib/api";

// declare global {
//   interface Window {
//     MonnifySDK: any;
//   }
// }

interface DepartmentPaymentFormProps {
  IsDeptVisible: boolean;
  setDeptIsVisible: Dispatch<SetStateAction<boolean>>;
}


const DepartmentalPaymentForm: React.FC<DepartmentPaymentFormProps> = ({ IsDeptVisible, setDeptIsVisible}) => {
    const navigate = useNavigate();
  const [submitting, notSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    matricNumber: "",
    department: "",
    MainLevel: "",
    level: "",
    fresherLevel: "",
    email: "",
    fullname: "",
    desc: "College due"
  });
  const departmentalPrices: Record<string, {fresher:number, staylite:number}> = {
     "Soil Science & Land Management (SSLM)": { fresher: 6000, staylite: 2000 },
    "Plant Breeding & Seed Technology (PBST)": { fresher: 6500, staylite: 2500 },
    "Plant Physiology & Crop Production (PPCP)": { fresher: 5000, staylite:2500 },
    "Crop Protection (CPT)": { fresher: 2500, staylite: 2000 },
    "Aquaculture & Fisheries Management (Fishery)": { fresher: 5500, staylite: 2500 },
    "Environmental Management & Toxicology (EMT)": { fresher: 5000, staylite: 3000 },
    "Forestry & Wildlife Management (Forestry)": { fresher: 2600, staylite: 2100 },
    "Water Resources Management & Agricultural Meteorology (WMA)": { fresher: 5000, staylite: 3000 },
    "Geology (GEO)": { fresher: 5000, staylite: 3500 },
    "Physics (PHS)": {fresher: 5500, staylite: 4000}
  };

const email =  formData.email;
const matricNumber = formData.matricNumber;
const fullname = formData.fullname;
const department = formData.department || "None";
const level = formData.level || "None";
const fresherLevel = formData.fresherLevel || "None";
const mainLevel = formData.MainLevel;
let amount = 0;
if(department && mainLevel){
  if(mainLevel === "Fresher/ Direct Entry"){
    amount = departmentalPrices[department]?.fresher || 0;
  }else if(mainLevel === "Staylite"){
    amount = departmentalPrices[department]?.staylite || 0;
  }
}  
const desc = formData.desc;
const isDisabled = formData.matricNumber.startsWith("2025") 

const requestFlutter = async () => {
  notSubmitting(true);
  try {
    const callbackUrl = `${window.location.origin}/receipts`;
    const data = await apiPost('/api/payments/initiate', {
      email,
      payerName: fullname,
      amount,
      partnerIdentifier: department,
      businessVertical: "education",
      metadata: { matricNumber, department: "None", level, fresherLevel, mainLevel, collegeName: "None", desc },
      callbackUrl,
    });

    if (data.paymentLink) {
      window.location.href = data.paymentLink;
    } else {
      alert('Payment link not found');
      throw new Error('Payment link not found');
    }
  } catch (error) {
    console.error('Error:', error);
    notSubmitting(false);
  }
}

  const departments = [
    "Soil Science & Land Management (SSLM)",
    "Plant Breeding & Seed Technology (PBST)", 
    "Crop Protection (CPT)",
    "Aquaculture & Fisheries Management (Fishery)",
    "Environmental Management & Toxicology (EMT)",
    "Forestry & Wildlife Management (Forestry)",
    "Water Resources Management & Agricultural Meteorology (WMA)",
    "Geology (GEO)",
    "Plant Physiology & Crop Production (PPCP)",
    "Physics (PHS)"
  ];

  const MainLevel = ["Fresher/ Direct Entry", "Staylite"];
  const levels = ["200", "300", "400", "500"];
  const fresherLevels = ["100", "200"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);

  };

  useEffect(() => {
   const leveler = MainLevel.filter(lev => lev === "Fresher/ Direct Entry")
   console.log(leveler);
   
  }, [])
  

  return (
    <div className="space-y-4" style={{padding:'20px'}}>
      

      <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black transition-all duration-500 ease-in-out ${
        IsDeptVisible
          ? 'bg-opacity-60 opacity-100 scale-100' 
          : 'bg-opacity-0 opacity-0 scale-95 pointer-events-none'
      }`}>
        <button
          type="reset"
          onClick={() =>{setDeptIsVisible(false); setFormData({ matricNumber: "",
                                                            department: "",
                                                            MainLevel: "",
                                                            level: "",
                                                            fresherLevel: "",
                                                            email: "",
                                                            fullname: "",
                                                            desc: "Departmental due"})} }
          className="absolute top-3 right-7 text-white-500 hover:text-white-800 transition-colors"
            >
              ✕
        </button>
        <Card className="relative bg-card/95 backdrop-blur-sm border-border/50 shadow-xl w-full max-w-3xl h-[80vh] overflow-y-auto rounded-2xl">
            <button
              type="reset"
              onClick={() =>{setDeptIsVisible(false); setFormData({ matricNumber: "",
                                                                department: "",
                                                                MainLevel: "",
                                                                level: "",
                                                                fresherLevel: "",
                                                                email: "",
                                                                fullname: "",
                                                                desc: "Departmental due"})} }
              className="absolute top-3 right-3 text-white-500 hover:text-gray-800 transition-colors"
            >
              ✕
            </button>
          <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <LucideSchool className="w-5 h-5" />
              Departmental Due Payment
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
                  placeholder="e.g., john.ade@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="border-border/50 focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select 
                  value={formData.department}
                  onValueChange={(value) => setFormData({...formData, department: value})}
                  required
                >
                  <SelectTrigger className="border-border/50 focus:border-primary">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                  <span className="text-muted-foreground">Departmental Due Amount:</span>
                  <span className="text-2xl font-bold text-primary">{amount.toLocaleString()}</span>
                </div>}

                {formData.MainLevel === "Staylite" && <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Departmental Due Amount:</span>
                  <span className="text-2xl font-bold text-primary">{amount.toLocaleString()}</span>
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
                <Button onClick={requestFlutter}
                  type="submit" 
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

export default DepartmentalPaymentForm;
