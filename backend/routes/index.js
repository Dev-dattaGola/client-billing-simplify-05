
const clientRoutes = require('./clientRoutes');

// Import other route files here when they're created
const attorneyRoutes = require('express').Router();
const caseRoutes = require('express').Router();
const medicalRoutes = require('express').Router();
const chatbotRoutes = require('express').Router();
const depositionRoutes = require('express').Router();
const messageRoutes = require('express').Router();
const calendarRoutes = require('express').Router();
const userRoutes = require('express').Router();

module.exports = {
  clientRoutes,
  caseRoutes,
  medicalRoutes,
  chatbotRoutes,
  depositionRoutes,
  attorneyRoutes,
  messageRoutes,
  calendarRoutes,
  userRoutes
};
