'use strict';

require('dotenv').config();
const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const yelp = require('yelp-fusion');
let firebase = require('firebase-admin');
const app = express();
const yelpKey = process.env.YELP_KEY;
const yelpClient = yelp.client(yelpKey);

//console.log(process.env.FIREBASE_KEY.replace(/\\n/g, ''))

if (!process.argv[2]) {
  app.use("/", serveStatic ( path.join (__dirname, './spa/dist')))
}

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "do-more-ecc5c.firebaseapp.com",
  databaseURL: "https://do-more-ecc5c.firebaseio.com",
  projectId: "do-more-ecc5c",
  storageBucket: "do-more-ecc5c.appspot.com",
  messagingSenderId: "669577878898"
});

app.get('/getPlaceUsers', function(req, res) {
  const {places} = req.query
  const promises = places.map(id => {
    return firebase.database().ref('finds')
    .orderByChild('place/id')
    .equalTo(id)
    .once('value').then(s => {
      if (s.val()) {
        for (const key in s.val()) {
          const item = s.val()[key];
          return item
        }
      }
    })
  });
  Promise.all(promises).then( p => {
    const users = p.map(p => p && p.users)
    res.json(users)
  }).catch(e => {
    res.json(e)
    console.log(e);
  });
  return res
})

app.get('/placeKeyById', function(req, res) {
  const {placeId} = req.query
  firebase.database().ref('finds')
  .orderByChild('place/id')
  .equalTo(placeId)
  .once('value').then(s => {
    if (s.val()) {
      const key = Object.keys(s.val())[0]
      res.json(key)
    }
    return res
  })
})

app.get('/getYelpResults', function(req, res) {
  const {lat, lng, categories, radius, sortBy, offset} = req.query
  const calcRadius = radius < 40000 ? radius : null
  yelpClient.search({
    sort_by: sortBy,
    limit: 25,
    latitude: lat,
    longitude: lng,
    categories,
    offset,
    radius: calcRadius
  }).then(response => {
    res.json(response.jsonBody.businesses)
  }).catch(e => {
    res.json(e)
    console.log(e);
  });
  return res
})

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Listening on port ' + port));
