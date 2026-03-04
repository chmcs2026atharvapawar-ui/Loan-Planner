import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    loanId: {
      type: String,
      unique: true,
    },

    loanName: {
      type: String,
      required: true,
      trim: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    loanType: {
      type: String,
      enum: ["Personal", "Home", "Education", "Vehicle", "Business"],
      required: true,
    },

    loanAmount: {
      type: Number,
      required: true,
    },

    interestRate: {
      type: Number,
      required: true,
    },

    tenureMonths: {
      type: Number,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },
    
    endDate: {
      type: Date,
    },

    emiAmount: {
      type: Number,
    },

    remainingAmount: {
      type: Number,
    },

    status: {
      type: String,
      enum: ["Active", "Closed"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Loan", loanSchema);