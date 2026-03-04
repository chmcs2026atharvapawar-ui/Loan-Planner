import { useEffect, useMemo, useState } from "react";
import api from "../axios.js";   // ✅ axios instance use karo
import toast from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";
import Spinner from "../components/Spinner.jsx";
import LoanCard from "../components/LoanCard.jsx";
import { Link } from "react-router-dom";

function Home() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  /* ================= FETCH LOANS ================= */
  const fetchLoans = async () => {
    try {
      setLoading(true);

      const response = await api.get("/loans");

      // ✅ FIX: backend direct array bhej raha hai
      const loanData = Array.isArray(response.data)
        ? response.data
        : [];

      setLoans(loanData);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch loans");
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  /* ================= FILTER ================= */
  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const matchesSearch =
        loan.loanName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.loanId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All"
          ? true
          : loan.status?.toLowerCase() === statusFilter.toLowerCase();

      const matchesType =
        typeFilter === "All"
          ? true
          : loan.loanType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [loans, searchTerm, statusFilter, typeFilter]);

  /* ================= STATS ================= */
  const stats = useMemo(() => {
    const activeLoans = loans.filter(
      (l) => l.status?.toLowerCase() === "active"
    );

    const closedLoans = loans.filter(
      (l) => l.status?.toLowerCase() === "closed"
    ).length;

    const outstandingAmount = activeLoans.reduce(
      (sum, l) => sum + (Number(l.remainingAmount) || 0),
      0
    );

    const monthlyEmi = activeLoans.reduce(
      (sum, l) => sum + (Number(l.emiAmount) || 0),
      0
    );

    return {
      total: loans.length,
      active: activeLoans.length,
      closed: closedLoans,
      outstandingAmount,
      monthlyEmi,
    };
  }, [loans]);

  const loanTypes = useMemo(() => {
  const types = (loans || [])
    .map((l) => l.loanType)
    .filter((type) => type && type.trim() !== ""); // 🔥 remove empty

  return ["All", ...Array.from(new Set(types))];
}, [loans]);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-2xl p-6 shadow mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Personal Loan Planner</h1>
            <p className="text-sm opacity-90">
              Manage and track your loans efficiently
            </p>
          </div>

          <Link to="/loans/create" className="btn btn-primary">
            + Add Loan
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Loans" value={stats.total} />
          <StatCard title="Active Loans" value={stats.active} />
          <StatCard title="Outstanding Amount" value={`₹ ${stats.outstandingAmount}`} />
          <StatCard title="Monthly EMI" value={`₹ ${stats.monthlyEmi}`} />
        </div>

        {/* FILTERS */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by Loan / Customer / Loan ID"
            className="input input-bordered md:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="select select-bordered md:w-52"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            className="select select-bordered md:w-52"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {loanTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <button className="btn btn-outline" onClick={fetchLoans}>
            Refresh
          </button>
        </div>

        {/* GRID */}
        {loading ? (
          <Spinner />
        ) : filteredLoans.length === 0 ? (
          <div className="text-center py-12 opacity-70">
            No loans found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLoans.map((loan) => (
              <LoanCard key={loan._id} loan={loan} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* Small reusable stat card */
function StatCard({ title, value }) {
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <p className="text-sm opacity-70">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default Home;