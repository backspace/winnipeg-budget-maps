import Route from '@ember/routing/route';
import libraries from '../data/libraries';
import pools from '../data/pools';
import Wards from '../data/wards';

import Closures from '../data/closures';

export default class ApplicationRoute extends Route {
  model() {
    return {
      pools: pools.map(p => {
        p.closure = Closures[p.name];
        return p;
      }),
      libraries: libraries.map(l => {
        l.closure = Closures[l.name];
        return l;
      }),
      wards: Wards,
    };
  }
}
