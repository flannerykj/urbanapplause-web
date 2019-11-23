
export type Location = {
  id: number,
  street_address: string,
  city: string,
  country: string,
  postal_code: string,
  google_maps_place_id: ?string,
}

export type GoogleMapsPlace = {
  address_components: Array<GoogleMapsAddressComponent>,
  formatted_address: string,
  geometry: {}
}


export type GoogleMapsAddressComponent = {
  long_name: string,
  short_name: string,
  types: Array<string>
}

export default Location;
