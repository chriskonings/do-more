'use strict';

const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const yelp = require('yelp-fusion');
var firebase = require('firebase-admin');
const app = express();
const yelpKey = process.argv[2] ? require('./config.js').YELP_KEY : process.env.YELP_KEY
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
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDhX3iFHfJO+SDh\nJGhOsXFofIh8B3YF/a3kn29DnQn/EXdfeX/+sHIOzmN6fP6iDGUmrJfweJWKdMyO\npCnP5wNbfnR4fnFry0NHSUfryMA48zUBPE3NoyqCAbqF0tRCxRHdn7bito8NfHDB\ncTQ7QP8AMcxugXjZMjcjdzVJ7/NbSzHDzM/EFTKZLpqSXSUjU6111OndDmbfKPiy\nTuGoAHDJeXYSFtRY4x9Saht6udw/VIAwNNURPJzr1Cy04ZX2dS2wws+NkmNE47df\nxFN7uEr/3bU0KR26x1IwuqJz6r+XVRcLfC67NTRaJi0ihuNnJpH40yzd5hi7asHu\nAziMfPCvAgMBAAECggEATjlP4IxLXSPVSK/VUHMAVO7chIgma9/n6nF4MfSg0ppi\nX44RYfomLINwPcSCsQYyWaEQP5Pq+5qcoWnTZWjeXnRewq/IeEydtnF1+B2+skWg\nASTIMHbQuz0UW3yY1fAGynC0Dq6kql6l2E6NfX+KwquGNFjV9DUctD+dDGOviODC\nzZmlA4Ut+wsy+J2mzUhZ+kfZTzQEi5JRIHUJSeJaL4q2RJg0Sd5gRcEm/FLymf99\nAlEaQza1KZz8kpGnUjxW1dGgs4S4YrStL49wLs75VwIgDthfxARoFlnDNeVq194X\nyIPC4YvvTWWYANsDi6uOTZj3AqfhqsSQGlYmwkLBqQKBgQDy2CV/rwFFT+g9/Ae9\np+b4m7LffkRmQ/RGFaehGz//J9kP8YLyVOIkY8bAYb3eE62AaI5+8H79C1QCrExf\npqk4TbOmM6zkXwiKC5vIXtEBiyZvC3Gr8bDnLAfLTaXNjrwGzJFUbQsSK3tArzVv\nE287wlJjmBDX59oJ70s5zun2TQKBgQDtlQZTTJfA2h1ihTKZ+CdPV9J6SwL/Ivea\nFIr2PTA4WTfN40gkqZGPzTsTuqnTmKvLGdxT5V//D8cqQJqXyS1rXP/ODiDUPsOO\nP11iieM+uDar1IHvWxY225PLgVTcotZ+NDsi0BjFGydsuJw7+Cluti3nOX0ENC4n\n1zapDrM46wKBgQC2OR0CT7a7ZPeXM3w3gzscx/CUJfJ7bnho8qzjhkgiVatafFZP\nMwSyW7BzAaTwdIGXvl1WwW34wTxb+SAiEjQejKfGijYs82a793QBCaz55ImFf+ff\nJzAgd3itxGkq8vUCgRR4bo6FJt2IrzCAVev8wpcCJsRUzqRdGhOvoCUNbQKBgQCs\n8vsz0GH4Rc92VLhNVVRoceoKlGiOCopsY9/0+P4NRwVUn8t4xOft4tzKs+vE2TLW\nGvFFMYj8SCQYIgdnz099BKpC+g3z8+yvtHjqrq36jmdeFsiv0YMOVDH2xyNbqj6y\niJsz8IDXm7jLcGhrT2/55CzuUe8sDEA9SHHGB6l4GQKBgQDEs5i1tNc7NUPHhMmv\ndidbu+enFJr1wh4N8eJtak5BDJdKwik2V6Poj3iW9GM2NfSH814I3FtLE+XYbmZA\ndpDninsbdTPAhNFcpdmdyD/TXybvQcZCij6Q7rO48KEplHQclT2tlDXvCcGAgz0f\nJCYaJ1Sw85dAANyHZt8bAmm89Q==\n-----END PRIVATE KEY-----\n",
  }),
  databaseURL: 'https://do-more-ecc5c.firebaseio.com/',
});

app.get('/getPlacesUsers', function(req, res) {
  const {places} = req.query
  const placesArr = []
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
  Promise.all(promises).then((p)=>{
    res.json(p)
  });
  return res
})

app.get('/getYelpResults', function(req, res) {
  const {lat, lng, term, radius, sortBy, offset} = req.query
  const calcRadius = radius < 40000 ? radius : null
  if (term) {
    yelpClient.search({
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
      res.json(e)
      console.log(e);
    });
  } else {
    yelpClient.search({
      sort_by: sortBy,
      limit: 25,
      latitude: lat,
      longitude: lng,
      offset: offset,
      radius: calcRadius
    }).then(response => {
      res.json(response.jsonBody.businesses)
    }).catch(e => {
      res.json(e)
      console.log(e)
    });
  }
  return res
})

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Listening on port ' + port));
