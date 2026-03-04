import { Link } from "react-router-dom";

function LoanCard({ loan }) {
  // ✅ safety
  if (!loan) return null;

  const isClosed = loan.status === "Closed";

  return (
    <div className="card bg-base-100 shadow hover:shadow-md transition">
      <div className="card-body p-5">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <p className="text-xs opacity-60 font-semibold">
              {loan.loanId || "-"}
            </p>

            <h2 className="font-bold text-lg leading-tight truncate">
              {loan.loanName || "-"}
            </h2>

            <p className="text-sm font-semibold text-primary truncate">
              {loan.customerName || "-"}
            </p>

            <p className="text-sm opacity-70">{loan.loanType || "-"}</p>
          </div>

          <span
            className={`badge ${
              loan.status === "Active" ? "badge-success" : "badge-neutral"
            }`}
          >
            {loan.status || "-"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-xs uppercase opacity-60">Principal</p>
            <p className="font-bold text-lg">₹ {loan.loanAmount ?? 0}</p>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase opacity-60">EMI</p>
            <p className="font-bold text-lg text-success">
              ₹ {isClosed ? 0 : loan.emiAmount ?? 0}/mo
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-xs opacity-70 mt-3">
          <span>📌 {loan.interestRate ?? 0}% p.a.</span>
          <span>⏳ {loan.tenureMonths ?? 0} months</span>
          <span>
            📅 Started{" "}
            {loan.startDate ? new Date(loan.startDate).toLocaleDateString() : "-"}
          </span>
        </div>

        <div className="divider my-3"></div>

        <div className="flex justify-between items-center">
          <p className="text-sm opacity-70">Remaining</p>
          <p className="font-bold">
            ₹ {isClosed ? 0 : loan.remainingAmount ?? 0}
          </p>
        </div>

        <div className="flex gap-2 mt-4">
          <Link
            to={`/loans/details/${loan.loanId}`}
            className="btn btn-outline btn-sm flex-1"
          >
            👁 View
          </Link>

          <Link
            to={`/loans/edit/${loan.loanId}`}
            className="btn btn-outline btn-sm flex-1"
          >
            ✏ Edit
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoanCard;
