const express = require('express');
const router = express.Router();
const Pensioner = require('../models/Pensioner');
const PensionCredit = require('../models/PensionCredit');
const { getFYMonths, MONTH_NAMES } = require('../utils/financialYear');

// POST /api/pensioners — create new pensioner
router.post('/', async (req, res) => {
  try {
    const pensioner = new Pensioner(req.body);
    await pensioner.save();
    res.status(201).json({ success: true, data: pensioner });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ success: false, message: `Duplicate value for ${field}` });
    }
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/pensioners?search=...  — search by name or pensionerId
router.get('/', async (req, res) => {
  try {
    const { search = '' } = req.query;
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { pensionerId: { $regex: search, $options: 'i' } },
            { ppoNo: { $regex: search, $options: 'i' } },
          ],
        }
      : {};
    const pensioners = await Pensioner.find(query).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: pensioners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/pensioners/:id — single pensioner basic info
router.get('/:id', async (req, res) => {
  try {
    const pensioner = await Pensioner.findById(req.params.id);
    if (!pensioner) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: pensioner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/pensioners/:id/credits — profile + FY-grouped credit sheet
router.get('/:id/credits', async (req, res) => {
  try {
    const pensioner = await Pensioner.findById(req.params.id);
    if (!pensioner) return res.status(404).json({ success: false, message: 'Not found' });

    const credits = await PensionCredit.find({ pensionerId: req.params.id }).sort({
      year: 1,
      month: 1,
    });

    // Group credits by financial year
    const fyMap = {};
    credits.forEach((c) => {
      const fy = c.financialYear;
      if (!fyMap[fy]) fyMap[fy] = [];
      fyMap[fy].push(c);
    });

    // Build structured FY summaries
    const financialYears = Object.entries(fyMap)
      .sort(([a], [b]) => (a > b ? -1 : 1)) // latest FY first
      .map(([fy, fyCredits]) => {
        const months = getFYMonths(fy);
        const monthMap = {};
        fyCredits.forEach((c) => {
          monthMap[`${c.month}-${c.year}`] = c;
        });

        const monthlyBreakdown = months.map(({ month, year }) => {
          const credit = monthMap[`${month}-${year}`];
          return {
            month,
            year,
            monthName: MONTH_NAMES[month],
            amountCredited: credit ? credit.amountCredited : null,
            status: credit ? credit.status : 'Unpaid',
            remarks: credit ? credit.remarks : '',
            creditDate: credit ? credit.creditDate : null,
          };
        });

        const totalDisbursed = fyCredits.reduce((sum, c) => sum + c.amountCredited, 0);
        const monthsPaid = fyCredits.length;
        const avgMonthly = monthsPaid > 0 ? Math.round(totalDisbursed / monthsPaid) : 0;

        return {
          financialYear: fy,
          totalDisbursed,
          monthsPaid,
          avgMonthly,
          monthlyBreakdown,
        };
      });

    res.json({ success: true, data: { pensioner, financialYears } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/pensioners/:id — update pensioner
router.patch('/:id', async (req, res) => {
  try {
    const pensioner = await Pensioner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pensioner) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: pensioner });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;