import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Wallet2Icon } from "lucide-react";

const HowToCard = () => {
  const [isOpen, setIsOpen] = useState(false);
const [darkMode, setDarkMode] = useState(false);

  function toggleTheme() {
    setDarkMode(prev => !prev);
  }
  return (
    <Card className="bg-gray-50 backdrop-blur-sm border-gray-200">
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={darkMode ? "dark" : ""}>
        <CardTitle className="flex items-center justify-center dark:text-white" >
          
          <div style={{display: 'flex', alignItems: 'center', fontSize:'smaller' }}>
            <div><Wallet2Icon style={{marginRight: '0.5rem'}}/></div><div>Pay with  Mira<span className="dark:text-gray-300">Pay</span></div>
          </div>
          {isOpen ? (
            <ChevronUp className="ml-10 w-5 h-5 dark:text-white" />
          ) : (
            <ChevronDown className="ml-10 w-5 h-5 dark:text-white" />
          )}
        </CardTitle>
        </div>
      </CardHeader>
      
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'hidden'
      }`}>
        <CardContent className="space-y-4 text-gray-900 dark:text-white font-[100]">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <p>Select the Payment type (college, departmental, NASS, SUG)</p>
          </div>
          
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <p>Fill in your details (Matric number, Department, Level)</p>
          </div>
          
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <p>Review payment details and confirm your entries</p>
          </div>
          
          <div className="flex  gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              4
            </div>
            <p>Complete secure payment and receive receipt</p>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default HowToCard;