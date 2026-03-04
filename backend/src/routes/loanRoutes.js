import express from "express";
import {
  createLoan,
  getAllLoans,
  getLoanByLoanId,
  updateLoanByLoanId,
  deleteLoanByLoanId,
  deleteLoanByMongoId
} from "../controllers/loanController.js";

const router = express.Router();

router.post("/", createLoan);
router.get("/", getAllLoans);
router.get("/by-loanId/:loanId", getLoanByLoanId);
router.put("/by-loanId/:loanId", updateLoanByLoanId);
router.delete("/by-loanId/:loanId", deleteLoanByLoanId);
router.delete("/id:id", deleteLoanByMongoId);
export default router;
