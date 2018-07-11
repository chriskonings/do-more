'use strict';

const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const yelp = require('yelp-fusion');
const app = express();
const yelpKey = process.argv[2] ? require('./config.js').YELP_KEY : process.env.YELP_KEY
const yelpClient = yelp.client(yelpKey);

if (!process.argv[2]) {
  app.use("/", serveStatic ( path.join (__dirname, './spa/dist')))
}

// app.get('*', function (req, res) {
//   res.sendFile(__dirname + '../spa/dist/index.html')
// })

app.get('/api', function(req, res) {
  const {lat, lng, term, radius, sortBy, offset} = req.query
  const calcRadius = radius < 40000 ? radius : null
  let search
  if (term) {
    search = yelpClient.search({
      sort_by: sortBy,
      limit: 25,
      latitude: lat,
      longitude: lng,
      term: term,
      offset: offset,
      radius: calcRadius
    }).then(response => {
      res.json(response.jsonBody.businesses)
    }).catch(e => {
      console.log(e);
      res.json(e)
    });
  } else {
    search = yelpClient.search({
      sort_by: sortBy,
      limit: 25,
      latitude: lat,
      longitude: lng,
      offset: offset,
      radius: calcRadius
    }).then(response => {
      res.json(response.jsonBody.businesses)
    }).catch(e => {
      console.log(e)
      res.json(e)
    });
  }
  return search
})

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Listening on port ' + port));
