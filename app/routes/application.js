import Route from '@ember/routing/route';
import Libraries from '../data/libraries';
import Closures from '../data/closures';

export default class ApplicationRoute extends Route {
  model() {
    return Libraries.data.map(row => {
      const name = row[8];
      return {
        name,
        lat: parseFloat(row[19][1]),
        lon: parseFloat(row[19][2]),
        closure: Closures[name],
      };
    });
  }
}
