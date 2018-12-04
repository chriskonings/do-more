'use strict'

module.exports = {
  NODE_ENV: '"production"',
  GOOGLEMAPS_KEY: JSON.stringify(process.env.GOOGLEMAPS_KEY),
  FIREBASE_KEY: JSON.stringify(process.env.FIREBASE_KEY),
  FIREBASE_API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY),
  YELP_KEY: JSON.stringify(process.env.YELP_KEY)
}
