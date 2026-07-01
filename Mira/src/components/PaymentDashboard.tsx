import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, BookOpen, Home, Utensils, Car, ArrowUpRight, Clock, CheckCircle } from "lucide-react";
import studentPaymentImage from "@/assets/student-payment.jpg";

const PaymentDashboard = () => {
  const quickPayments = [
    { icon: BookOpen, label: "Tuition", amount: "₦2,450,000", color: "text-primary", bg: "bg-primary/10" },
    { icon: Home, label: "Housing", amount: "₦850,000", color: "text-info", bg: "bg-info/10" },
    { icon: Utensils, label: "Meal Plan", amount: "₦320,000", color: "text-warning", bg: "bg-warning/10" },
    { icon: Car, label: "Parking", amount: "₦75,000", color: "text-success", bg: "bg-success/10" },
  ];

  const recentTransactions = [
    { id: "TXN001", description: "Spring Semester Tuition", amount: "₦2,450,000", status: "completed", date: "Dec 15, 2024" },
    { id: "TXN002", description: "Dormitory Fee - Fall", amount: "₦850,000", status: "completed", date: "Dec 12, 2024" },
    { id: "TXN003", description: "Meal Plan Renewal", amount: "₦320,000", status: "pending", date: "Dec 10, 2024" },
  ];

  return (
    <section className="py-20 px-4 bg-background relative overflow-hidden">
      {/* Student image in relief */}
      <div className="absolute top-20 right-10 opacity-5">
        <img 
          src={studentPaymentImage} 
          alt="Student making payment" 
          className="w-72 h-72 object-cover rounded-xl"
        />
      </div>
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your Payment <span className="bg-gradient-primary bg-clip-text text-transparent">Hub</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your college payments in one beautiful, intuitive dashboard.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Account Balance */}
          <Card className="lg:col-span-1 bg-gradient-primary border-0 text-primary-foreground shadow-elegant animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Account Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">₦1,247,830</div>
              <p className="opacity-90">Available for payments</p>
              <Button variant="secondary" className="mt-4 w-full bg-white/20 hover:bg-white/30 border-white/20">
                Add Funds
              </Button>
            </CardContent>
          </Card>

          {/* Quick Payments */}
          <Card className="lg:col-span-2 shadow-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle>Quick Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {quickPayments.map((payment, index) => (
                  <div
                    key={payment.label}
                    className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-glow group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${payment.bg}`}>
                        <payment.icon className={`w-5 h-5 ${payment.color}`} />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-sm text-muted-foreground">{payment.label}</div>
                    <div className="text-xl font-semibold">{payment.amount}</div>
                  </div>
                ))}
              </div>
              <Button variant="payment" className="w-full mt-6" size="lg">
                <CreditCard className="w-5 h-5" />
                Make Payment
              </Button>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="lg:col-span-3 shadow-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-muted">
                        {transaction.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : (
                          <Clock className="w-5 h-5 text-warning" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.id} • {transaction.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{transaction.amount}</div>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PaymentDashboard;