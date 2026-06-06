const mongoose = require('mongoose');

const pensionerSchema = new mongoose.Schema(
  {
    pensionerId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      index: true,
    },
    fathersName: { type: String, trim: true },
    dob: { type: Date },
    dor: { type: Date, required: [true, 'Date of retirement is required'] },
    pensionStartDate: { type: Date },
    aadhaarNo: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: (v) => /^\d{12}$/.test(v),
        message: 'Aadhaar must be exactly 12 digits',
      },
    },
    phoneNo: {
      type: String,
      validate: {
        validator: (v) => !v || /^\d{10}$/.test(v),
        message: 'Phone number must be exactly 10 digits',
      },
    },
    panNo: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      validate: {
        validator: (v) => !v || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v),
        message: 'Invalid PAN format',
      },
    },
    ppoNo: {
      type: String,
      unique: true,
      required: [true, 'PPO Number is required'],
    },
    address: { type: String },
    bankAccountNo: { type: String },
    ifscCode: {
      type: String,
      uppercase: true,
      validate: {
        validator: (v) => !v || /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v),
        message: 'Invalid IFSC format',
      },
    },
    nomineeName: { type: String },
    basePensionAmount: {
      type: Number,
      required: [true, 'Base pension amount is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Suspended', 'Deceased'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

// Auto-generate pensionerId and pensionStartDate before saving
pensionerSchema.pre('save', async function (next) {
  if (!this.pensionerId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Pensioner').countDocuments();
    this.pensionerId = `PNS-${year}-${String(count + 1).padStart(3, '0')}`;
  }
  if (!this.pensionStartDate && this.dor) {
    const start = new Date(this.dor);
    start.setDate(start.getDate() + 1);
    this.pensionStartDate = start;
  }
  next();
});

module.exports = mongoose.model('Pensioner', pensionerSchema);