const { Router } = require('express');
const VolunteerController = require('./controllers/VolunteerController');
const SearchVolController = require('./controllers/SearchVolController');

const routes = Router();

// Volunteers 
routes.get('/volunteers', VolunteerController.index);
routes.post('/volunteers', VolunteerController.store);

// Search Volunteers
routes.get('/search_vol', SearchVolController.index);

module.exports = routes;