# Find things to do from people like you

I was googling too much trying to find places to go when I travelled, review sites and "top X" articles just weren't cutting it for me, so I decided to build an app for people to collect, share and discover places from other people that had been there.


### Running locally
- Rename `config.template.js` to `config.js` and edit API Keys
- `npm install` in root folder
- `npm install` in `/spa` folder
- `npm run dev` in root folder
- `npm run dev` in `/spa` folder

Note: local server and spa must be running simultaneously in order to use front-end and back-end

### To Do

#### Features
- [ ] Add "find" sharing with other users
- [x] Add "hot finds" feature
- [ ] Sort "finds" by location in "my finds"
- [ ] Add dropdown to filter by location in "my finds"
- [ ] Add "been there" tagging, to tell when someone has actually been to the place and how many.

#### Tech
- [x] Deploy to server
- [ ] Set up continuous integration (Jenkins) - [Dev -> Staging -> Production]
- [ ] Migrate (from Google Maps) to Mapbox
- [ ] Migrate (from Firebase) to MongoDB

