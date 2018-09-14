'use strict';

const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const yelp = require('yelp-fusion');
var firebase = require('firebase-admin');
const app = express();
const yelpKey = process.argv[2] ? require('./config.js').YELP_KEY : process.env.YELP_KEY
const firebaseKey = process.argv[2] ? require('./config.js').FIREBASE_KEY : process.env.FIREBASE_KEY
const yelpClient = yelp.client(yelpKey);

if (!process.argv[2]) {
  app.use("/", serveStatic ( path.join (__dirname, './spa/dist')))
}

// app.get('*', function (req, res) {
//   res.sendFile(__dirname + '../spa/dist/index.html')
// })


firebase.initializeApp({
  credential: firebase.credential.cert({
    projectId: 'do-more-ecc5c',
    clientEmail: 'firebase-adminsdk-irn1g@do-more-ecc5c.iam.gserviceaccount.com',
    private_key: firebaseKey,
  }),
  databaseURL: 'https://do-more-ecc5c.firebaseio.com/',
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
