import {
  DollarSign,
  CreditCard,
  Users,
  AlertCircle} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { adminConfig } from "@/data/adminConfig";
import DashboardHero from "./Admin/Dashboard/DashboardHero";
import FloatingShapes from "./Admin/Dashboard/FloatingShapes";
import StatsGrid from "./Admin/Dashboard/StatsGrid";
import QuickActions from "./Admin/Dashboard/QuickActions";
import DashboardSkeleton from "./Admin/Dashboard/DashboardSkeleton";
import RevenueChart from "./Admin/Dashboard/RevenueChart";
import RecentTransactions from "./Admin/Dashboard/RecentTransactions";
import ActivityTimeline from "./Admin/Dashboard/ActivityTimeline";
import { apiGet } from "@/lib/api";

const AdminDashboard = () => {
  const { college } = useParams();
  const config = adminConfig[college as keyof typeof adminConfig];
  if (!config) {
    return <div>Dashboard not found</div>;
  }
  const [result, setResult] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const sumTransactions = allTransactions
    .reduce((sum, transaction) => sum + (parseInt(transaction.amount) || 0), 0)
    .toLocaleString();

  const totalActive = filteredTransactions.length;
  const itemsPerPage = 10; // Number of items to display per page

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const revenueChartData = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en", {
      month: "short",
    });

    const map = new Map<string, number>();

    allTransactions
      .filter((t) => t.paymentStatus === "completed")
      .forEach((transaction) => {
        const date = new Date(transaction.dateOfPayment);

        const key = `${date.getFullYear()}-${date.getMonth()}`;

        map.set(key, (map.get(key) || 0) + Number(transaction.amount));
      });

    return [...map.entries()]
      .sort()
      .slice(-6)
      .map(([key, revenue]) => {
        const [year, month] = key.split("-");

        return {
          month: formatter.format(new Date(Number(year), Number(month))),
          revenue,
        };
      });
  }, [allTransactions]);

  const activities = [...allTransactions]
    .sort(
      (a, b) =>
        new Date(b.dateOfPayment).getTime() -
        new Date(a.dateOfPayment).getTime(),
    )
    .slice(0, 15);

  const stats = [
    {
      title: "Total Revenue",
      value: sumTransactions,
      icon: DollarSign,
      nairaValue: "₦",
      change: "+12%",
    },
    { title: "Active", value: totalActive, icon: Users, change: "+8%" },
    { title: "Pending Payments", value: "-", icon: AlertCircle, change: "-5%" },
    { title: "Volume", value: totalActive, icon: CreditCard, change: "+15%" },
  ];

  useEffect(() => {
    const loadDashboard = async () => {
      setSubmitted(true);

      try {
        const data = await apiGet('/api/admin/partner/payments');
        const payments = Array.isArray(data) ? data : data.payments || [];
        setResult(payments.slice(-5).reverse());
        setAllTransactions(payments.reverse());
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setSubmitted(false);
      }
    };

    loadDashboard();
  }, [college]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTransactions(allTransactions);
      return;
    }
    const filtered = allTransactions.filter(
      (transaction) =>
        transaction.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.matricNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to the first page when search term changes
  }, [searchTerm, allTransactions]);

  useEffect(() => {
    console.log(config.image);
    console.log(allTransactions);
  }, [allTransactions, config.image]);

  return (
    <>
      {submitted && (
        
        <DashboardSkeleton />
      )}
      <div className="space-y-8 relative">
        <FloatingShapes />
        <DashboardHero title={config.title} image={config.image} />
        <StatsGrid
          revenue={Number(sumTransactions.replace(/,/g, ""))}
          users={totalActive}
          volume={totalActive}
        />
        <QuickActions />
        <RevenueChart data={revenueChartData} />
        <RecentTransactions loading={submitted} transactions={result} />
        <ActivityTimeline loading={submitted} activities={activities} />
      </div>
    </>
  );
};

export default AdminDashboard;
