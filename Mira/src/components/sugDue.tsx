import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, User,  LucideSchool } from "lucide-react";

const sugPaymentForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    matricNumber: "",
    department: "",
    level: ""
  });

  const departments = [
    "Computer Science",
    "Engineering", 
    "Veterinary Medicine",
    "Law",
    "Business Administration",
    "Arts",
    "Science"
  ];

  const levels = ["100", "200", "300", "400", "500"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <div className="space-y-10" style={{padding:'20px'}}>
     
      <Button
        onClick={() => setIsVisible(!isVisible)} 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
      >
        <CreditCard className="w-7 h-7 mr-4" />
        Pay SUG Due
      </Button>

      <div className={`transition-all duration-500 ease-in-out transform ${
        isVisible 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
      }`}>
        <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-xl">
          <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <LucideSchool className="w-5 h-5" />
              SUG Due Payment
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
                  placeholder="e.g., 20201735"
                  value={formData.matricNumber}
                  onChange={(e) => setFormData({...formData, matricNumber: e.target.value})}
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
                <Label htmlFor="level">Level</Label>
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

              <div className="pt-4 border-t border-border/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">sug Due Amount:</span>
                  <span className="text-2xl font-bold text-primary">₦15,000</span>
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
      </div>
    </div>
  );
};

export default sugPaymentForm;