const express = require('express');
const Service = require('../models/Service');
const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  const services = await Service.find();
  res.json(services);
});

// Create a new service
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ msg: 'Name required' });
  const service = new Service({ name });
  await service.save();
  res.status(201).json(service);
});

// Update service
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  const service = await Service.findByIdAndUpdate(req.params.id, { name }, { new: true });
  if (!service) return res.status(404).json({ msg: 'Service not found' });
  res.json(service);
});

// Delete service
router.delete('/:id', async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) return res.status(404).json({ msg: 'Service not found' });
  res.json({ msg: 'Service deleted' });
});

module.exports = router;
