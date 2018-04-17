'use strict';

const config = require("./config.js");
const express = require('express')
const app = express()
const yelp = require('yelp-fusion');
const client = yelp.client(config.keys.YELP);

app.get('/api', function(req, res) {
  const {lat, lng, limit} = req.query
  const search = client.search({
    limit: limit,
    latitude: lat,
    longitude: lng,
    term:'Coffee',
  }).then(response => {
    res.json(response.jsonBody.businesses)
  }).catch(e => {
    console.log(e);
  });
  return search
})

app.listen(3000, () => console.log('Listening on port 3000'))

