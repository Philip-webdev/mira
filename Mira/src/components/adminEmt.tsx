import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GraduationCap,DollarSign,  CreditCard, TrendingUp, Users, AlertCircle, Clock, Download,Megaphone, FileText, Search} from "lucide-react";
import {useEffect, useState} from 'react';
import { Input } from "@/components/ui/input";

const EmtDashboard = () => {

  const [result, setResult] = useState<any[]>([]);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const sumTransactions = (allTransactions.reduce((sum, transaction) => sum + (parseInt(transaction.amount)  || 0), 0)).toLocaleString();

  const totalActive = filteredTransactions.length
  const itemsPerPage = 10; // Number of items to display per page

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1)

  const paginatedTransactions = 
  filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)


 const stats = [
    { title: "Total Revenue", value: sumTransactions, icon: DollarSign, nairaValue:"₦", change: "+12%" },
    { title: "Active", value: totalActive, icon: Users, change: "+8%" },
    { title: "Pending Payments", value: "-", icon: AlertCircle, change: "-5%" },
    { title: "Volume", value: totalActive, icon: CreditCard, change: "+15%" },
  ];

  useEffect(() =>{
  setSubmitted(true);
  const recentTransactions = async () => {
    const response = await fetch('https://Mira-backend-main.onrender.com/api/admin/dashboard/EMT');
    const result = await response.json();
    setResult(await result.slice(-5).reverse());
  };
recentTransactions();

const Transactions = async () => {
    const response = await fetch('https://Mira-backend-main.onrender.com/api/admin/dashboard/EMT');
    const result = await response.json();
    setAllTransactions(await result.reverse());
  };
  Transactions();

  const timer = setTimeout(() => {
    setSubmitted(false);
  }, 2000
  );

   return () => clearTimeout(timer); // cleanup  
}, []);

 useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTransactions(allTransactions);
      return;
    }
    const filtered = allTransactions.filter((transaction) =>
      transaction.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.matricNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to the first page when search term changes
  }, [searchTerm, allTransactions]);



  return (
    <DashboardLayout titile="emt Dashboard" variant="emt">
      {submitted && (
                  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-8 text-center flex flex-col items-center">
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-700 text-lg font-medium">
                        Getting your Dashboard ...
                      </p>
                    </div>
                  </div>
                )}
      <div className="space-y-8">
                <div className="space-y-2">
                   {/* Welcome Section */}
                          <div className="space-y-2">
                            <h1 className="flex gap-2  text-3xl font-bold text-foreground">Hi, Admin
                               
                               <div className="absolute top-0 m-2  right-0 rounded-sm py-1 text-xs"><a href="/" style={{textDecorationColor:'none'}}><Download className="p-1 w-7 h-7 m-2 rounded-full bg-black animate-[color-changing_1s_ease-out_infinite]" /></a></div>
                            
                            </h1>
                          <div 
                    style={{ 
                      backgroundImage: 'url("/WhatsApp Image 2025-09-18 at 15.48.19_33eb4084.jpg")', 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center' 
                    }} 
                    className="relative rounded-lg h-[350px] w-full overflow-hidden hover:shadow-yellow-700/100 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Overlay with Blur */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                  
                    {/* Content */}
                    <div className="absolute bottom-6 left-6 z-10 text-white">
                      <h2 className="text-2xl font-bold">Environmental Management and Toxicology (EMT)</h2>
                      <p className="text-sm opacity-80 mt-1">
                       Payment Management dashboard
                      </p>
                    </div>
                  </div>
                  </div>
                  </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur border-emt/30 h-auto w-auto ">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                {stat.nairaValue ? <div className="h-4 w-4 text-colerm">{stat.nairaValue}</div> : <stat.icon className="h-4 w-4 text-colerm" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-primary flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

         
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur border-emt/30">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Clock className="w-5 h-5 mr-2 text-emt" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {result?.map((transaction) => (
                  <div key={transaction._id} className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground font-medium">{transaction.matricNumber}</span>
                      <span className="text-xs text-muted-foreground">{transaction.fullname}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-foreground">₦{(transaction.amount?.toLocaleString())}</span>
                       
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

         
        </div>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by names, matric, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg"
          />
        </div>

        {/* All Payments Table */}
        <Card className="bg-card/50 backdrop-blur border-emt/30">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-emt" />
              All User Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Matric</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Ref</TableHead>
                  
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.map((payment, index) => (
                  <TableRow key={payment._id}>
                    <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + (index + 1)}</TableCell>
                    <TableCell>{payment.matricNumber}</TableCell>
                    <TableCell className="text-muted-foreground">{payment.fullname}</TableCell>
                    <TableCell>₦{(payment.amount?.toLocaleString())}</TableCell>  
                    <TableCell>{payment.level === "None" ? payment.fresherLevel : payment.level}</TableCell>
                    <TableCell className="font-bold">{payment.reference}</TableCell>
                   
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4 px-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-card/50 backdrop-blur rounded disabled:opacity-50">
                  Previous
              </button>
              <div className="text-sm text-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-card/50 backdrop-blur rounded disabled:opacity-50">
                  Next
              </button>
            </div>
          </CardContent>
          {
            allTransactions.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                  <FileText className="w-12 h-12 text-gray-400" />
                  <p>No Transactions yet</p>
              </div>
            )
          }
        </Card>

      
      </div>
    </DashboardLayout>
  );
};

export default EmtDashboard;