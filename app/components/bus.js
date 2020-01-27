import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import L from 'leaflet';

export default class BusComponent extends Component {
  pathIndex;
  pathForward;

  @tracked position;
  @tracked fact;

  constructor() {
    super(...arguments);

    this.pathIndex = getRandomInt(0, this.args.path.coordinates.length - 1);
    this.coordinates = this.args.path.coordinates;
    this.position = this.latLngFromCoordinate(this.coordinates[this.pathIndex]);
    this.pathForward = Math.random() < 0.5 ? true : false;
    this.pathLength = this.coordinates.length;

    this.calculateStepDeltas();
    this.animate.perform();
    this.cycleFacts.perform();
  }

  get iconAnchor() {
    return L.point(this.args.markerLength/2, this.args.markerLength/2);
  }

  calculateStepDeltas() {
    const delta = 0.0005;

    if (this.pathForward) {
      this.nextIndex = this.pathIndex + 1;
    } else {
      this.nextIndex = this.pathIndex - 1;
    }

    if (this.nextIndex < 0) {
      this.nextIndex = 1;
      this.pathForward = true;
    } else if (this.nextIndex === this.pathLength) {
      this.nextIndex = this.pathLength - 2;
      this.pathForward = false;
    }

    this.nextPosition = this.latLngFromCoordinate(this.coordinates[this.nextIndex]);

    let latDiff = this.nextPosition.lat - this.position.lat;
    let lngDiff = this.nextPosition.lng - this.position.lng;

    if (Math.abs(lngDiff) > Math.abs(latDiff)) {
      const ratio = Math.abs(latDiff)/(Math.abs(latDiff) + Math.abs(lngDiff));

      this.latDelta = ratio*delta*(latDiff < 0 ? -1 : 1);
      this.lngDelta = delta*(lngDiff < 0 ? -1 : 1);

      this.stepsUntilNextPosition = Math.floor(lngDiff/this.lngDelta);
    } else {
      const ratio = Math.abs(lngDiff)/(Math.abs(latDiff) + Math.abs(lngDiff));

      this.latDelta = delta*(latDiff < 0 ? -1 : 1);
      this.lngDelta = ratio*delta*(lngDiff < 0 ? -1 : 1);

      this.stepsUntilNextPosition = Math.floor(latDiff/this.latDelta);
    }

    this.currentStep = 0;
  }

  latLngFromCoordinate(coordinate) {
    return L.latLng(coordinate[1], coordinate[0]);
  }

  @task(function*() {
    while (true) {
      if (this.currentStep >= this.stepsUntilNextPosition) {
        this.position = this.nextPosition;
        this.pathIndex = this.nextIndex;
        this.calculateStepDeltas();
      }

      this.position = this.position = L.latLng(this.position.lat + this.latDelta, this.position.lng + this.lngDelta);
      this.currentStep++;

      yield timeout(400);
    }
  })
  animate;

  @task(function*() {
    const facts = [
      'no more paper schedules',
      'BUStxt schedule information cancelled',
      'no more DART service for lower-density neighbourhoods',
      'shorter afternoon rush hour service',
      'fewer interior bus washes',
      'no more free Downtown Spirit buses',
      'shorter service on weekdays and Saturdays',
    ];

    let factIndex = getRandomInt(0, facts.length);

    while (true) {
      this.fact = facts[factIndex];
      factIndex = (factIndex + 1) % facts.length;
      yield timeout(5000);
    }
  })
  cycleFacts;
}

// Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
