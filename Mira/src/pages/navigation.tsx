import { CheckCheck, LucideFactory, NewspaperIcon } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function Navigation ()  {
  const { pathname } = useLocation(); // Gets the current URL path

  // Helper to check if a path is active
  const isActive = (path) => pathname === path;
const [darkMode, setDarkMode] = useState(true);

  function toggleTheme() {
    setDarkMode(prev => !prev);
  }
  // Active color: green-500 (Hex: #22c55e)
  // Inactive color: gray (Lucide default/custom)
  const getIconClass = (path) => 
    isActive(path) ? "text-green-500" : "text-gray-400 dark:text-white";

  return (
    <div 
      className="fixed bottom-4 left-2 right-2 p-4 transition-colors z-50"
      style={{
        borderRadius: '1rem',
        backdropFilter: 'blur(15px)',
        color:'white',
        backgroundColor: darkMode ? "#1f1f1f99" : "white", 
      
      }}
    >
      <div className="text-center text-sm flex justify-evenly">
        <a href="/home">
          <LucideFactory className={getIconClass("/home")} />
        </a>
        
        <a href="/Searchreceipts">
          <CheckCheck className={getIconClass("/Searchreceipts")} />
        </a>
        
        <a href="/docs">
          <NewspaperIcon className={getIconClass("/docs")} />
        </a>
      </div>
    </div>
  );
};
