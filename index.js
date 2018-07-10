'use strict';

const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const yelp = require('yelp-fusion');
const config = require('./config.js');
const client = yelp.client(config.keys.YELP);
const app = express()

app.use("/", serveStatic ( path.join (__dirname, './spa/dist')))

// app.get('*', function (req, res) {
//   res.sendFile(__dirname + '../spa/dist/index.html')
// })

app.get('/api', function(req, res) {
  const {lat, lng, term, radius, sortBy, offset} = req.query
  const calcRadius = radius < 40000 ? radius : null
  let search
  if (term) {
    search = client.search({
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
      res.json(e.body.businesses)
      console.log(e);
    });
  } else {
    search = client.search({
      sort_by: sortBy,
      limit: 25,
      latitude: lat,
      longitude: lng,
      offset: offset,
      radius: calcRadius
    }).then(response => {
      res.json(response.jsonBody.businesses)
    }).catch(e => {
      res.json(e.body.businesses)
      console.log(e);
    });
  }
  return search
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Listening on port 3000'))
