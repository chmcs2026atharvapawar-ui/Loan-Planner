import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";
import BackButton from "../components/BackButton.jsx";
import Spinner from "../components/Spinner.jsx";
import api from "../axios.js";

function ShowLoan() {
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams(); // loanId

  useEffect(() => {
    setLoading(true);

    api
      .get(`/loans/by-loanId/${id}`)
      .then((response) => {
        setLoan(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to fetch loan details");
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-6xl mx-auto p-4">
        <BackButton destination="/" />
        <h1 className="text-2xl font-bold mb-4">Loan Details</h1>

        {loading ? (
          <Spinner />
        ) : loan ? (
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm opacity-70">Loan ID</p>
                    <p className="font-semibold">{loan.loanId}</p>
                  </div>

                  <div>
                    <p className="text-sm opacity-70">Loan Name</p>
                    <p className="font-semibold">{loan.loanName}</p>
                  </div>

                  <div>
                    <p className="text-sm opacity-70">Status</p>
                    <span
                      className={`badge ${
                        loan.status === "Active"
                          ? "badge-success"
                          : "badge-neutral"
                      }`}
                    >
                      {loan.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm opacity-70">Interest Rate</p>
                    <p className="font-semibold">{loan.interestRate}%</p>
                  </div>

                  <div>
                    <p className="text-sm opacity-70">EMI Amount</p>
                    <p className="font-semibold">₹ {loan.emiAmount}</p>
                  </div>

                  <div>
                    <p className="text-sm opacity-70">Start Date</p>
                    <p className="font-semibold">
                      {loan.startDate
                        ? new Date(loan.startDate).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm opacity-70">Created At</p>
                    <p className="font-semibold">
                      {loan.createdAt
                        ? new Date(loan.createdAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm opacity-70">Customer Name</p>
                    <p className="font-semibold">{loan.customerName}</p>
                  </div>

                  <div>
                    <p className="text-sm opacity-70">Loan Type</p>
                    <p className="font-semibold">{loan.loanType}</p>
                  </div>

                  <div>
                    <p className="text-sm opacity-70">Loan Amount</p>
                    <p className="font-semibold">₹ {loan.loanAmount}</p>
                  </div>

                  <div>
                    <p className="text-sm opacity-70">Tenure</p>
                    <p className="font-semibold">{loan.tenureMonths} months</p>
                  </div>

                  <div>
                    <p className="text-sm opacity-70">Remaining Amount</p>
                    <p className="font-semibold">₹ {loan.remainingAmount}</p>
                  </div>

                  <div>
                    <p className="text-sm opacity-70">End Date</p>
                    <p className="font-semibold">
                      {loan.endDate
                        ? new Date(loan.endDate).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm opacity-70">Updated At</p>
                    <p className="font-semibold">
                      {loan.updatedAt
                        ? new Date(loan.updatedAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg font-semibold">No details found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShowLoan;
