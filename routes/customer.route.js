const express = require('express');
const userModel = require('../models/customer.model');

const router = express.Router();

router.post('/', async (req, res) => {
  const result = await userModel.add(req.body);
  const ret = {
    id: result.insertId,
    ...req.body
  }

  delete ret.password_hash;
  res.status(201).json(ret);
})

module.exports = router;