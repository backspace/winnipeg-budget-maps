import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import L from 'leaflet';

export default class HelicopterComponent extends Component {
  sw = L.latLng(49.871061, -97.195258);
  ne = L.latLng(49.930911, -97.071704);

  bounds = L.latLngBounds(this.sw, this.ne);

  @tracked position;
  @tracked newPosition;

  constructor() {
    super(...arguments);

    this.position = getRandomInBounds(this.bounds);

    this.animate.perform();
  }

  @task(function*() {
    const delta = 0.0005;
    let newPosition = this.position;
    let latDelta, lngDelta;

    while (true) {
      if (this.position.equals(newPosition, delta*4)) {
        do {
          newPosition = getRandomInBounds(this.position.toBounds(1000));
        } while (!this.bounds.contains(newPosition))

        this.newPosition = newPosition;

        let latDiff = newPosition.lat - this.position.lat;
        let lngDiff = newPosition.lng - this.position.lng;

        if (Math.abs(lngDiff) > Math.abs(latDiff)) {
          const ratio = Math.abs(latDiff)/(Math.abs(latDiff) + Math.abs(lngDiff));

          latDelta = ratio*delta*(latDiff < 0 ? -1 : 1);
          lngDelta = delta*(lngDiff < 0 ? -1 : 1);
        } else {
          const ratio = Math.abs(lngDiff)/(Math.abs(latDiff) + Math.abs(lngDiff));

          latDelta = delta*(latDiff < 0 ? -1 : 1);
          lngDelta = ratio*delta*(lngDiff < 0 ? -1 : 1);
        }
      } else {
        this.position = L.latLng(this.position.lat + latDelta, this.position.lng + lngDelta);
      }

      yield timeout(400);
    }
  })
  animate;

}

function getRandomInBounds(bounds) {
  return L.latLng(
    getRandomBetween(bounds.getNorth(), bounds.getSouth()),
    getRandomBetween(bounds.getWest(), bounds.getEast()),
  );
}

// Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
