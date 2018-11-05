import fullHeart from './assets/full-heart.svg';
import emptyHeart from './assets/empty-heart.svg';

const utils = {
  generateId() {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
  },
  newMarker(p, users, map, iw, markers) {
    let marker;
    const userCount = users ? Object.keys(users).length : 0;
    const markerCount = markers ? markers.length : 0;
    const place = p.place ? p.place : p;
    const lat = p.place ? p.place.pos.lat : p.coordinates.latitude;
    const lng = p.place ? p.place.pos.lng : p.coordinates.longitude;
    const labelContent = userCount ? String(userCount) : '0';
    const icon = (userCount >= 1) ? fullHeart : emptyHeart;
    const zIndex = markerCount && (markerCount <= 0) ? 1 : markerCount * 2;
    gm.load(async (google) => {
      const MarkerWithLabel = require('markerwithlabel')(google.maps); // eslint-disable-line global-require
      marker = new MarkerWithLabel({
        position: { lat, lng },
        labelContent,
        icon,
        map,
        zIndex,
        labelAnchor: new google.maps.Point(15.5, 42),
        labelClass: 'marker-label',
      });
      marker.place = place;
      google.maps.event.addListener(marker, 'click', function markerClick() {
        iw.el.open(map, this);
        iw.content = place; // eslint-disable-line no-param-reassign
      });
    });
    return marker;
  },
  calcPrimeLocation(data) {
    if (!(data.length > 0)) {
      return false;
    }

    const numCoords = data.length;

    let X = 0.0;
    let Y = 0.0;
    let Z = 0.0;

    for (let i = 0; i < data.length; i += 1) {
      const lat = ((data[i][0] * Math.PI) / 180);
      const lon = ((data[i][1] * Math.PI) / 180);

      const a = Math.cos(lat) * Math.cos(lon);
      const b = Math.cos(lat) * Math.sin(lon);
      const c = Math.sin(lat);

      X += a;
      Y += b;
      Z += c;
    }

    X /= numCoords;
    Y /= numCoords;
    Z /= numCoords;

    const lon = Math.atan2(Y, X);
    const hyp = Math.sqrt((X * X) + (Y * Y));
    const lat = Math.atan2(Z, hyp);

    const newX = ((lat * 180) / Math.PI);
    const newY = ((lon * 180) / Math.PI);

    return [newX, newY];
  },
  pinSymbol() {
    return {
      path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0',
      fillColor: '#3B7AFC',
      fillOpacity: 0.6,
      strokeWeight: 0,
      scale: 0.5,
    };
  },
};
export default utils;

