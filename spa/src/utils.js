import fullHeart from './assets/full-heart.svg';
import emptyHeart from './assets/empty-heart.svg';

const utils = {
  newMarker(p, users, map, iw) {
    let marker;
    const userCount = users ? Object.keys(users).length : 0;
    const place = p.place ? p.place : p;
    const lat = p.place ? p.place.pos.lat : p.coordinates.latitude;
    const lng = p.place ? p.place.pos.lng : p.coordinates.longitude;
    const labelContent = userCount ? String(userCount) : '0';
    const icon = (userCount >= 1) ? fullHeart : emptyHeart;
    const zIndex = (userCount >= 1) ? userCount * 10 : (userCount + 1);
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
  pinSymbol(color) {
    return {
      url: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
      fillColor: color,
      fillOpacity: 1,
      scale: 1,
    };
  },
};
export default utils;

