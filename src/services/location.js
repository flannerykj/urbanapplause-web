// @flow
import request from './request';
import constants from '../constants';

export type GPSLongitudeRef = 'W' | 'E';
export type GPSLatitudeRef = 'N' | 'S';
export type Coordinates = {
  lat: number,
  lng: number
}

type ExifData = {
  GPSLongitude: number[],
}

export const buildCoordinatesFromExif = (
  gpsLongitude: number[],
  gpsLongitudeRef: GPSLongitudeRef,
  gpsLatitude: number[],
  gpsLatitudeRef: GPSLatitudeRef
): ?Coordinates => {

  if (gpsLongitude && gpsLongitudeRef && gpsLatitude && gpsLatitudeRef) {
    const lngDegrees = gpsLongitude[0];
    const lngMinutes = gpsLongitude[1];
    const lngSeconds = gpsLongitude[2];
    let lng = lngDegrees + lngMinutes/60 + lngSeconds/3600;

    if (gpsLongitudeRef == 'W') {
      lng = lng * -1
    }
    const latDegrees = gpsLatitude[0];
    const latMinutes = gpsLatitude[1];
    const latSeconds = gpsLatitude[2];
    let lat = latDegrees + latMinutes/60 + latSeconds/3600;
    if (gpsLatitudeRef == 'S') {
      lat = lat * -1
    }
    return {
      lng,
      lat
    }
  }
  return null;
}

/*
function dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
  }

const getAddressComponents = (place) => {
  var address = {};
  place.address_components.forEach(function(c) {
      switch(c.types[0]){
          case 'street_number':
              address.StreetNumber = c;
              break;
          case 'route':
              address.StreetName = c;
              break;
          case 'neighborhood': case 'locality':    // North Hollywood or Los Angeles?
              address.City = c;
              break;
          case 'administrative_area_level_1':     //  Note some countries don't have states
              address.State = c;
              break;
          case 'postal_code':
              address.Zip = c;
              break;
          case 'country':
              address.Country = c;
              break;
      }
  });

  return address;
}

const getCoord = (number, ref) => {
    var l = number[0].numerator + number[1].numerator /
      (60 * number[1].denominator) + number[2].numerator / (3600 * number[2].denominator);
    if (ref == 'W'|'S') {
      return l*(-1)
    } else {
      return l
    }
}
const reverseGeocode = (lat, lng)=> {
  var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${constants.GOOGLE_MAPS_API_KEY}`
  return fetch(url)
      .then(res => res.json())
      .then((data) => {
        return data;
      })
        .catch((err) => {
          return({
            formatted_address: `Reverse geocoding failed. Coordinates for this image are latitude: ${lat}, longitude: ${lng}`,
            geometry: {
              location: {
                lat: lat,
                lng: lng
              }
            },
            city: 'Unknown',
          })
        });
}
export default {
  getAddressComponents: getAddressComponents,
  getCoord: getCoord,
  dataURLtoFile: dataURLtoFile,
  reverseGeocode: reverseGeocode
}



/* export function _getCoord(number, ref) {
  console.log('get coord: ', number, ref);
  var l = number[0].numerator + number[1].numerator /
    (60 * number[1].denominator) + number[2].numerator / (3600 * number[2].denominator);
  if (ref == 'W'|'S') {
    return l*(-1)
  } else {
    return l
  }
}

export function _reverseGeocode(lat, lng){
  var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCN9joc20fO_YTL4VRhjeOtcdC3i04zGCs`
  return request({url: url})
      .then((data) => {
        return data;
      })
        .catch((err) => {
          return({
            formatted_address: `Reverse geocoding failed. Coordinates for this image are latitude: ${lat}, longitude: ${lng}`,
            geometry: {
              location: {
                lat: lat,
                lng: lng
              }
            },
            city: 'Unknown',
          })
  });
}

  */
