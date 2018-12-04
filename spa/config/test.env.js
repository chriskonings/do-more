'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  GOOGLEMAPS_KEY: JSON.stringify(process.env.GOOGLEMAPS_KEY),
  FIREBASE_KEY: JSON.stringify(process.env.FIREBASE_KEY),
  FIREBASE_API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY),
  YELP_KEY: JSON.stringify(process.env.YELP_KEY)
})
