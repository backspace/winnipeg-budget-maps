import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

import { task, timeout } from 'ember-concurrency';
import moment from 'moment';

export default class ApplicationController extends Controller {
  @service router;

  @tracked hidden = [];
  @tracked debug = false;

  queryParams = ['hidden', 'debug'];

  @tracked monthsSince2020 = 0;
  @tracked jan2020 = moment({y: 2020, m: 1, d: 1});

  maximumMonth = 35;

  @tracked zoom = 12;

  @tracked slide = 0;
  slides = 2;

  constructor() {
    super(...arguments);

    this.playSwiper.perform();
  }

  get activeWard() {
    const activeWardName = this.router.currentRoute.params.name;

    if (activeWardName) {
      return this.model.wards.features.find(ward => ward.properties.name === activeWardName);
    } else {
      return undefined;
    }
  }

  get sortedWards() {
    const allWards = [...this.model.wards.features];

    if (this.activeWard) {
      allWards.splice(allWards.indexOf(this.activeWard), 1);
      allWards.push(this.activeWard);
    }

    return allWards;
  }

  get markerLength() {
    if (this.zoom < 12) {
      return 12;
    } else if (this.zoom < 14) {
      return 20;
    } else {
      return 25;
    }
  }

  get halfMarkerLength() {
    return this.markerLength/2;
  }

  emptyArray = [];

  get date() {
    return this.jan2020.clone().add(this.monthsSince2020, 'months');
  }

  get filteredFacilities() {
    return this.model.facilities.filter(f => !this.hidden.includes(f.type));
  }

  get facilityTypeStates() {
    return this.model.facilityTypes.map(type => {
      return {
        type,
        hidden: this.hidden.includes(type)
      };
    });
  }

  @action
  zoomChanged({target}) {
    this.zoom = target.getZoom();
  }

  @action
  toggleFacilityType(type) {
    const index = this.hidden.indexOf(type);

    if (index > -1) {
      this.hidden.splice(index, 1);
      this.hidden = [...this.hidden];
    } else {
      this.hidden = [...this.hidden, type];
    }
  }

  @action
  updateMonths(event) {
    this.monthsSince2020 = event.target.value;
  }

  @action
  transitionToWardName(wardName) {
    this.transitionToRoute('ward', wardName);
  }

  @task(function*() {
    this.monthsSince2020 = 0;

    while (this.monthsSince2020 < this.maximumMonth) {
      this.monthsSince2020++;
      yield timeout(200);
    }
  })
  playTimeline;

  @task(function*() {
    while (true) {
      this.slide++;

      if (this.slide === this.slides) {
        this.slide = 0;
      }

      yield timeout(5000);
    }
  })
  playSwiper;
}
