import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axios.js";

import toast from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";
import BackButton from "../components/BackButton.jsx";
import Spinner from "../components/Spinner.jsx";

function EditLoan() {
  const [loading, setLoading] = useState(false);

  const [loanName, setLoanName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [loanType, setLoanType] = useState("Personal");
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenureMonths, setTenureMonths] = useState("");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState("Active");
  const [remainingAmount, setRemainingAmount] = useState("");

  const { id } = useParams(); // loanId
  const navigate = useNavigate();

/* ================= FETCH LOAN ================= */
useEffect(() => {
  const fetchLoan = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/loans/by-loanId/${id}`);
      const loan = response.data;

      setLoanName(loan.loanName);
      setCustomerName(loan.customerName);
      setLoanType(loan.loanType);
      setLoanAmount(loan.loanAmount);
      setInterestRate(loan.interestRate);
      setTenureMonths(loan.tenureMonths);
      setStartDate(loan.startDate?.split("T")[0] || "");
      setStatus(loan.status);
      setRemainingAmount(loan.remainingAmount);

    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch loan");
    } finally {
      setLoading(false);
    }
  };

  fetchLoan();
}, [id]);

/* ================= UPDATE ================= */
const handleEditLoan = async () => {
  try {
    setLoading(true);

    const data = {
      loanName,
      customerName,
      loanType,
      loanAmount: Number(loanAmount),
      interestRate: Number(interestRate),
      tenureMonths: Number(tenureMonths),
      startDate,
      status,
      remainingAmount: Number(remainingAmount),
    };

    await api.put(`/loans/by-loanId/${id}`, data);

    toast.success("Loan Updated Successfully");
    navigate("/");
  } catch (error) {
    console.log(error);
    toast.error("Failed to update loan");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-5xl mx-auto p-4">
        <BackButton destination="/" />
        <h1 className="text-2xl font-bold mb-4">Edit Loan</h1>

        {loading ? (
          <Spinner />
        ) : (
          <div className="card bg-base-100 shadow">
            <div className="card-body">

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  type="text"
                  className="input input-bordered"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer Name"
                />

                <input
                  type="text"
                  className="input input-bordered"
                  value={loanName}
                  onChange={(e) => setLoanName(e.target.value)}
                  placeholder="Loan Name"
                />

                <select
                  className="select select-bordered"
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                >
                  <option value="Personal">Personal</option>
                  <option value="Home">Home</option>
                  <option value="Education">Education</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Business">Business</option>
                </select>

                <input
                  type="number"
                  className="input input-bordered"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Loan Amount"
                />

                <input
                  type="number"
                  className="input input-bordered"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="Interest Rate"
                />

                <input
                  type="number"
                  className="input input-bordered"
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(e.target.value)}
                  placeholder="Tenure Months"
                />

                <input
                  type="date"
                  className="input input-bordered"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />

                <select
                  className="select select-bordered"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>

                <input
                  type="number"
                  className="input input-bordered"
                  value={remainingAmount}
                  onChange={(e) => setRemainingAmount(e.target.value)}
                />

              </div>

              <div className="mt-6">
                <button
                  className="btn btn-primary w-full"
                  onClick={handleEditLoan}
                >
                  Save Changes
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditLoan;