import React from 'react'
import scriptLoader from 'react-async-script-loader'
import constants from '../constants';

class GoogleMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      map: null,
      imageData: null
    };
  }
  placeMarker = (position, map) => {

    const google = window.google;
    var marker = new google.maps.Marker({
        position: position,
        map: map
    });
    map.panTo(position);
  }
  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    const google = window.google;
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {

        var map  = new google.maps.Map(this.refs.map, {
          center: {lat: 43.6532, lng: -79.3832},
          zoom: 12
        });

        var input = this.refs.locationQuery;
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        const handleLocationChange = function(place){this.props.onLocationChange(place)}.bind(this);

        var markers = [];
        var geocoder = new google.maps.Geocoder();

        google.maps.event.addListener(map, 'click', function(event) {
          geocoder.geocode({
            'latLng': event.latLng
          }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                const place = results[0];
                handleLocationChange(place);
                markers.forEach(function(marker) {
                  marker.setMap(null);
                });
                markers.push(new google.maps.Marker({
                  map: map,
                  title: place.name,
                  position: place.geometry.location
                }));
              }
            }
          });
        });


        //LISTENERS
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });
        map.addListener('click', function(e) {
          console.log(e);
                   });


        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();
          if (places.length == 0) {
            return;
          }
          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            handleLocationChange(place);

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
            });
          map.fitBounds(bounds);
        });
      }

      else this.props.onError()

    }
  }

  render(){
    return (
      <div>
        <div className='control'>
          <input ref='locationQuery' className="controls input" type="text" placeholder={this.props.searchPlaceholder} style={{width: '60%'}} />
        </div>

        <div ref="map" style={{width: '100%', zIndex: '10', height: '400px',paddingLeft: 'calc(0.625em - 1px)', paddingRight: 'calc(0.625em - 1px)' }}></div>
    </div>
    )
  }
}

export default scriptLoader(
  [
    `https://maps.googleapis.com/maps/api/js?key=${constants.GOOGLE_MAPS_API_KEY}&libraries=places&language=${localStorage.getItem('languagePref')}`
  ]
)(GoogleMap)
