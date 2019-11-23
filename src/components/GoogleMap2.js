import React from 'react'

class GoogleMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      map: null,
      imageData: null
    };
  }
  placeMarker = (position, map) => {
    var marker = new google.maps.Marker({
        position: position,
        map: map
    });
    map.panTo(position);
  }
  componentWillReceiveProps (nextProps) {
    fetch(`https://maps.googleapis.com/maps/api/js?key=AIzaSyCN9joc20fO_YTL4VRhjeOtcdC3i04zGCs&libraries=places&callback=${this.loadMap}`, {headers: {'Content-Type': 'jsonp'}});
  }
  loadMap = () => {
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

  render(){
    return (
      <div>
        <div className='control'>
          <input ref='locationQuery' className="controls input" type="text" placeholder="Search for a location" style={{width: '60%'}} />
        </div>

        <div ref="map" style={{width: '100%', zIndex: '10', height: '400px',paddingLeft: 'calc(0.625em - 1px)', paddingRight: 'calc(0.625em - 1px)' }}></div>
    </div>
    )
  }
}

export default GoogleMap;
