import Route from '@ember/routing/route';
import facilities from '../data/facilities';
import Wards from '../data/wards';

import Closures from '../data/closures';
import FacilityCuts from '../data/facility-cuts';

import glenway from '../data/glenway';

import L from 'leaflet';
import moment from 'moment';

export default class MapRoute extends Route {
  model() {
    Wards.features.forEach(ward => {
      const extent = ward.properties.extent;
      ward.properties.bounds = boundsFromExtent(extent);
    });

    Wards.properties.bounds = boundsFromExtent(Wards.properties.extent);

    return {
      facilities: facilities.map(f => {
        if (!f.alreadyCollated) {
          if (f.syntheticClosureDateString) {
            f.closure = moment(f.syntheticClosureDateString);
            f.syntheticClosure = true;
          } else if (Closures[f.name]) {
            f.closure = moment(Closures[f.name]);
          }

          const facilityCuts = FacilityCuts[f.name];

          if (f.closure && facilityCuts) {
            f.cuts = Object.keys(facilityCuts).reduce((cuts, cutKey) => {
              if (f.closure.isBefore(facilityCuts[cutKey])) {
                cuts[cutKey] = facilityCuts[cutKey];
              }

              return cuts;
            }, {});

            if (Object.keys(f.cuts).length === 0) {
              f.cuts = null;
            }
          } else {
            f.cuts = facilityCuts;
          }

          f.alreadyCollated = true;
        }

        return f;
      }),
      facilityTypes: facilities.mapBy('type').uniq(),
      routes: {
        glenway
      },
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
