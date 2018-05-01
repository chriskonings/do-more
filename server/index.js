'use strict';

const config = require("./config.js");
const express = require('express')
const app = express()
const yelp = require('yelp-fusion');
const client = yelp.client(config.keys.YELP);

app.get('/api', function(req, res) {
  const {lat, lng, limit, term, radius, sortBy} = req.query
  const calcRadius = radius < 40000 ? radius : null
  const search = client.search({
    sort_by: sortBy,
    limit: limit,
    latitude: lat,
    longitude: lng,
    term: term,
    radius: calcRadius
  }).then(response => {
    res.json(response.jsonBody.businesses)
  }).catch(e => {
    res.json(e.body.businesses)
    console.log(e);
  });
  return search
})

app.listen(3000, () => console.log('Listening on port 3000'))

