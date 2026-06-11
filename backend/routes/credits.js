const express = require('express');
const router = express.Router();
const PensionCredit = require('../models/PensionCredit');
const Pensioner = require('../models/Pensioner');
const { computeFinancialYear } = require('../utils/financialYear');

// GET /api/credits/active-pensioners?month=5&year=2025
// Returns all Active pensioners pre-populated for bulk entry
router.get('/active-pensioners', async (req, res) => {
  try {
    const { month, year } = req.query;
    const pensioners = await Pensioner.find({ status: 'Active' }).select(
      'pensionerId name ppoNo basePensionAmount'
    );
    // Check which already have a credit for this month/year
    let existingMap = {};
    if (month && year) {
      const existing = await PensionCredit.find({
        month: parseInt(month),
        year: parseInt(year),
        pensionerId: { $in: pensioners.map((p) => p._id) },
      });
      existing.forEach((c) => {
        existingMap[c.pensionerId.toString()] = c;
      });
    }

    const result = pensioners.map((p) => {
      const existing = existingMap[p._id.toString()];
      return {
        _id: p._id,
        pensionerId: p.pensionerId,
        name: p.name,
        ppoNo: p.ppoNo,
        basePensionAmount: p.basePensionAmount,
        amountCredited: existing ? existing.amountCredited : p.basePensionAmount,
        alreadySaved: !!existing,
        existingCreditId: existing ? existing._id : null,
        remarks: existing ? existing.remarks : '',
      };
    });

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/credits/bulk — batch save monthly credits
router.post('/bulk', async (req, res) => {
  try {
    const { month, year, entries, enteredBy = 'admin' } = req.body;

    if (!month || !year || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ success: false, message: 'month, year, and entries are required' });
    }

    const financialYear = computeFinancialYear(parseInt(month), parseInt(year));
    const results = [];
    const errors = [];

    for (const entry of entries) {
      try {
        const { pensionerId, amountCredited, remarks = '' } = entry;

        // Confirmation gate: if already marked Success, require explicit override flag
        const existing = await PensionCredit.findOne({
          pensionerId,
          month: parseInt(month),
          year: parseInt(year),
        });

        if (existing && existing.status === 'Success' && !entry.forceOverride) {
          errors.push({ pensionerId, reason: 'Already credited as Success. Set forceOverride=true to update.' });
          continue;
        }

        const credit = await PensionCredit.findOneAndUpdate(
          { pensionerId, month: parseInt(month), year: parseInt(year) },
          {
            amountCredited,
            financialYear,
            creditDate: new Date(),
            status: 'Success',
            remarks,
            enteredBy,
            lastUpdated: new Date(),
          },
          { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
        );
        results.push(credit);
      } catch (entryErr) {
        errors.push({ pensionerId: entry.pensionerId, reason: entryErr.message });
      }
    }
