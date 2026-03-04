import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CreateLoan from "./pages/CreateLoan.jsx";
import EditLoan from "./pages/EditLoan.jsx";
import ShowLoan from "./pages/ShowLoan.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/loans/create" element={<CreateLoan />} />
      <Route path="/loans/details/:id" element={<ShowLoan />} />
      <Route path="/loans/edit/:id" element={<EditLoan />} />
    </Routes>
  );
}
