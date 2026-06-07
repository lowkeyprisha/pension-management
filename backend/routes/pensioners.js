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
