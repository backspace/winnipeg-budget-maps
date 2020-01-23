import Route from '@ember/routing/route';
import facilities from '../data/facilities';
import Wards from '../data/wards';

import Closures from '../data/closures';

import L from 'leaflet';

export default class ApplicationRoute extends Route {
  model() {
    Wards.features.forEach(ward => {
      const extent = ward.properties.extent;
      ward.properties.bounds = boundsFromExtent(extent);
    });

    Wards.properties.bounds = boundsFromExtent(Wards.properties.extent);

    return {
      facilities: facilities.map(f => {
        if (f.syntheticClosureDateString) {
          f.closure = new Date(Date.parse(f.syntheticClosureDateString));
          f.syntheticClosure = true;
        } else {
          f.closure = Closures[f.name];
        }
        return f;
      }),
      facilityTypes: facilities.mapBy('type').uniq(),
      wards: Wards,
    };
  }
}

function boundsFromExtent(extent) {
  return L.latLngBounds(
    L.latLng(extent[1], extent[0]),
    L.latLng(extent[3], extent[2])
  );
}
