const express = require('express');
const routes = express.Router();

const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

routes.post('/devs', DevController.store);
routes.get('/devs', DevController.index);

routes.delete('/devs/delete', DevController.destroy);

routes.put('/devs/update', DevController.update);

routes.get('/search',SearchController.index)

module.exports = routes;