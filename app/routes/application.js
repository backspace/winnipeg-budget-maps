import Route from '@ember/routing/route';
import Libraries from '../data/libraries';
import IndoorPools from '../data/indoor-pools';
import OutdoorPools from '../data/outdoor-pools';

import Closures from '../data/closures';

export default class ApplicationRoute extends Route {
  model() {
    const libraries = Libraries.data.map(row => {
      const name = row[8];
      return {
        name,
        lat: parseFloat(row[19][1]),
        lon: parseFloat(row[19][2]),
        closure: Closures[name],
      };
    });

    const indoorPools = IndoorPools.data.map(row => {
      const name = row[8];
      return {
        name,
        lat: parseFloat(row[45][1]),
        lon: parseFloat(row[45][2]),
        closure: Closures[name]
      }
    });

    const outdoorPools = OutdoorPools.data.map(row => {
      const name = row[8];
      return {
        name,
        lat: parseFloat(row[37][1]),
        lon: parseFloat(row[37][2]),
        closure: Closures[name]
      }
    })

    return {
      pools: indoorPools.concat(outdoorPools),
      libraries,
    };
  }
}
