import Loan from "../models/loanModel.js";

/* ================= CREATE ================= */
export const createLoan = async (req, res) => {
  try {
    const {
      loanName,
      customerName,
      loanType,
      loanAmount,
      interestRate,
      tenureMonths,
      startDate,
    } = req.body;

    // EMI Calculation
    const P = Number(loanAmount);
    const R = Number(interestRate);
    const N = Number(tenureMonths);

    let emi = 0;
    const r = R / 12 / 100;

    if (r === 0) {
      emi = P / N;
    } else {
      emi = (P * r * Math.pow(1 + r, N)) /
        (Math.pow(1 + r, N) - 1);
    }
    // ================= AUTO INCREMENT LOAN ID =================
    const lastLoan = await Loan.findOne().sort({ createdAt: -1 });

    let nextNumber = 1001;

    if (lastLoan && lastLoan.loanId) {
      const lastNumber = parseInt(lastLoan.loanId.replace("LN", ""));
      nextNumber = lastNumber + 1;
    }
    // ================= END DATE CALC =================
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + N);

    const newLoan = await Loan.create({
      loanId: "LN" + nextNumber,
      loanName,
      customerName,
      loanType,
      loanAmount: P,
      interestRate: R,
      tenureMonths: N,
      startDate: start,
      endDate: end,
      emiAmount: Number(emi.toFixed(2)),
      remainingAmount: P,
      status: "Active",
    });

    res.status(201).json(newLoan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= GET ALL ================= */
export const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find();
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET BY loanId ================= */
export const getLoanByLoanId = async (req, res) => {
  try {
    const loan = await Loan.findOne({ loanId: req.params.loanId });
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    res.status(200).json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE BY loanId ================= */
export const updateLoanByLoanId = async (req, res) => {
  try {
    const {
      loanAmount,
      interestRate,
      tenureMonths,
      ...rest
    } = req.body;

    const P = Number(loanAmount);
    const R = Number(interestRate);
    const N = Number(tenureMonths);

    let emi = 0;
    const r = R / 12 / 100;

    if (r === 0) {
      emi = P / N;
    } else {
      emi =
        (P * r * Math.pow(1 + r, N)) /
        (Math.pow(1 + r, N) - 1);
    }

    const updatedLoan = await Loan.findOneAndUpdate(
      { loanId: req.params.loanId },
      {
        ...rest,
        loanAmount: P,
        interestRate: R,
        tenureMonths: N,
        emiAmount: Number(emi.toFixed(2)), // 🔥 EMI update
      },
      { new: true }
    );

    res.status(200).json(updatedLoan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= DELETE BY loanId ================= */
export const deleteLoanByLoanId = async (req, res) => {
  try {
    const loan = await Loan.findOneAndDelete({
      loanId: req.params.loanId
    });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.status(200).json({ message: "Loan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE BY Mongo _id (id:xxxx) ================= */
export const deleteLoanByMongoId = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.status(200).json({
      message: "Loan deleted successfully",
      deletedId: req.params.id
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid Mongo ID" });
  }
};
export const recalculateAllEmi = async (req, res) => {
  try {
    const loans = await Loan.find();

    for (let loan of loans) {
      const P = loan.loanAmount;
      const R = loan.interestRate;
      const N = loan.tenureMonths;

      const r = R / 12 / 100;
      let emi = 0;

      if (r === 0) {
        emi = P / N;
      } else {
        emi =
          (P * r * Math.pow(1 + r, N)) /
          (Math.pow(1 + r, N) - 1);
      }

      loan.emiAmount = Number(emi.toFixed(2));
      await loan.save();
    }

    res.json({ message: "All EMI recalculated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
