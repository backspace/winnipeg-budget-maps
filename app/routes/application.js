import Route from '@ember/routing/route';
import facilities from '../data/facilities';
import Wards from '../data/wards';

import Closures from '../data/closures';

export default class ApplicationRoute extends Route {
  model() {
    return {
      facilities: facilities.map(f => {
        f.closure = Closures[f.name];
        return f;
      }),
      wards: Wards,
    };
  }
}
