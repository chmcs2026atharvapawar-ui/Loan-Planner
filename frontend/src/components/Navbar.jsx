import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Personal Loan Planners
        </Link>
      </div>

      <div className="flex-none">
        <Link to="/loans/create" className="btn btn-primary">
          + Add Loan
        </Link>
      </div>
    </div>
  );
}
