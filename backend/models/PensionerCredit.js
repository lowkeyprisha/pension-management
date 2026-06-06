const mongoose = require('mongoose');
const { computeFinancialYear } = require('../utils/financialYear');

const pensionCreditSchema = new mongoose.Schema(
  {
    pensionerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pensioner',
      required: true,
      index: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    financialYear: {
      type: String, // e.g. "2024-2025"
    },
    amountCredited: {
      type: Number,
      required: true,
      min: 0,
    },
    creditDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Success', 'Pending', 'Failed'],
      default: 'Success',
    },
    remarks: { type: String, default: '' },
    enteredBy: { type: String, default: 'admin' }, // audit trail
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-compute financial year before save
pensionCreditSchema.pre('save', function (next) {
  this.financialYear = computeFinancialYear(this.month, this.year);
  this.lastUpdated = new Date();
  next();
});

// Compound unique index: one credit entry per pensioner per month/year
pensionCreditSchema.index(
  { pensionerId: 1, month: 1, year: 1 },
  { unique: true }
);

module.exports = mongoose.model('PensionCredit', pensionCreditSchema);