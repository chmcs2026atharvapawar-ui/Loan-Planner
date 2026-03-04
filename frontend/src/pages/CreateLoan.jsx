import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios.js";

import toast from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";
import BackButton from "../components/BackButton.jsx";
import Spinner from "../components/Spinner.jsx";

function CreateLoan() {
  const [loanName, setLoanName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [loanType, setLoanType] = useState("Personal");
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenureMonths, setTenureMonths] = useState("");
  const [startDate, setStartDate] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ EMI Preview (UI only)
  const emiPreview = useMemo(() => {
    const P = Number(loanAmount);
    const R = Number(interestRate);
    const N = Number(tenureMonths);

    if (!P || !R || !N) return 0;

    const r = R / 12 / 100;

    if (r === 0) return Number((P / N).toFixed(2));

    const emi =
      (P * r * Math.pow(1 + r, N)) /
      (Math.pow(1 + r, N) - 1);

    return Number(emi.toFixed(2));
  }, [loanAmount, interestRate, tenureMonths]);

  // ✅ End Date Preview (UI only)
  const endDatePreview = useMemo(() => {
    if (!startDate || !tenureMonths) return "";
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + Number(tenureMonths));
    return d.toLocaleDateString();
  }, [startDate, tenureMonths]);

  const handleSaveLoan = async () => {
    if (
      !customerName ||
      !loanName ||
      !loanAmount ||
      !interestRate ||
      !tenureMonths ||
      !startDate
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        loanName: loanName.trim(),
        customerName: customerName.trim(),
        loanType,
        loanAmount: Number(loanAmount),
        interestRate: Number(interestRate),
        tenureMonths: Number(tenureMonths),
        startDate: new Date(startDate),
      };

      await api.post("/loans", payload);

      toast.success("Loan Added Successfully");
      navigate("/");
    } catch (error) {
      console.error("CREATE LOAN ERROR 👉", error.response?.data || error.message);
      toast.error("Failed to create loan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-5xl mx-auto p-4">
        <BackButton destination="/" />
        <h1 className="text-2xl font-bold mb-4">Create Loan</h1>

        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Form */}
            <div className="lg:col-span-2 card bg-base-100 shadow">
              <div className="card-body">
                <div className="grid md:grid-cols-2 gap-4">

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Customer Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Loan Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={loanName}
                      onChange={(e) => setLoanName(e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Loan Type</span>
                    </label>
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
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Loan Amount</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Interest Rate (%)</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Tenure (Months)</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      value={tenureMonths}
                      onChange={(e) => setTenureMonths(e.target.value)}
                    />
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text">Start Date</span>
                    </label>
                    <input
                      type="date"
                      className="input input-bordered"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                </div>

                <div className="mt-6">
                  <button
                    className="btn btn-primary"
                    onClick={handleSaveLoan}
                  >
                    Save Loan
                  </button>
                </div>

                <p className="text-xs opacity-70 mt-4">
                  EMI, End Date and Loan ID are generated automatically by backend.
                </p>
              </div>
            </div>

            {/* Preview */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h2 className="font-bold text-lg">Preview</h2>

                <div className="mt-3 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm opacity-70">EMI (approx)</span>
                    <span className="font-bold">₹ {emiPreview}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm opacity-70">End Date</span>
                    <span className="font-bold">
                      {endDatePreview || "-"}
                    </span>
                  </div>

                  <div className="divider"></div>

                  <div className="text-xs opacity-70">
                    * Preview is only for UI display.
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default CreateLoan;