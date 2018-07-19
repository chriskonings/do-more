/* eslint-disable */
import fullHeart from '../assets/full-heart.svg'
import emptyHeart from '../assets/empty-heart.svg'

const utils = {
  newMarker(p, users, map, iw) {
    let marker
    const place = p.place ? p.place : p
    const lat = p.place ? p.place.pos.lat : p.coordinates.latitude
    const lng = p.place ? p.place.pos.lng : p.coordinates.longitude
    const markerLabel = users ? String(Object.keys(users).length) : '0'
    const markerIcon = users ? fullHeart : emptyHeart
    const zIndex = users ? Object.keys(users).length * 10 : 1
    console.log(zIndex)
    gm.load(async (google) => {
      var MarkerWithLabel = require('markerwithlabel')(google.maps);
      marker = new MarkerWithLabel({
        position: {lat: lat, lng: lng},
        labelContent:  markerLabel,
        icon: markerIcon,
        map: map,
        zIndex: zIndex,
        labelAnchor: new google.maps.Point(15.5, 42),
        labelClass: "marker-label", // the CSS class for the label
      });
      marker.place = place;
      google.maps.event.addListener(marker, 'click', function() {
        iw.el.open(map, this);
        iw.content = place
      });
    });
    return marker
  },
  calcPrimeLocation(data) {
    if (!(data.length > 0)){
        return false;
    }

    var num_coords = data.length;

    var X = 0.0;
    var Y = 0.0;
    var Z = 0.0;

    for(var i = 0; i < data.length; i++){
        var lat = data[i][0] * Math.PI / 180;
        var lon = data[i][1] * Math.PI / 180;

        var a = Math.cos(lat) * Math.cos(lon);
        var b = Math.cos(lat) * Math.sin(lon);
        var c = Math.sin(lat);

        X += a;
        Y += b;
        Z += c;
    }

    X /= num_coords;
    Y /= num_coords;
    Z /= num_coords;

    var lon = Math.atan2(Y, X);
    var hyp = Math.sqrt(X * X + Y * Y);
    var lat = Math.atan2(Z, hyp);

    var newX = (lat * 180 / Math.PI);
    var newY = (lon * 180 / Math.PI);

    return new Array(newX, newY);
  },
  pinSymbol(color) {
    return {
      url: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
      fillColor: color,
      fillOpacity: 1,
      scale: 1
    };
  },
}
export default utils

