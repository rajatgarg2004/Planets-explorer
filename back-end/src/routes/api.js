const express = require("express");
const planetRouter = require('./planets/planets.router');
const launchRouter = require('./launches/launches.router');

const api = express.Router();


api.use('/planets',planetRouter);
api.use('/launches',launchRouter);

module.exports = api;