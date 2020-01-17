import Route from '@ember/routing/route';
import Libraries from '../data/libraries';

export default class ApplicationRoute extends Route {
  model() {
    return Libraries.data.map(row => {

      return {
        name: row[8],
        lat: parseFloat(row[19][1]),
        lon: parseFloat(row[19][2]),
      };
    });
  }
}
