import { Link } from "react-router-dom";

function BackButton({ destination = "/" }) {
  return (
    <div className="mb-4">
      <Link to={destination} className="btn btn-outline btn-sm">
        ⬅ Back
      </Link>
    </div>
  );
}

export default BackButton;
