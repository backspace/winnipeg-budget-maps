import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class ApplicationController extends Controller {
  @service router;

  @tracked monthsSince2020 = 0;
  @tracked jan2020 = moment({y: 2020, m: 1, d: 1});

  get activeWard() {
    const activeWardName = this.router.currentRoute.params.name;

    if (activeWardName) {
      return this.model.wards.features.find(ward => ward.properties.name === activeWardName);
    } else {
      return undefined;
    }
  }

  emptyArray = [];

  get date() {
    return this.jan2020.clone().add(this.monthsSince2020, 'months');
  }

  @action
  updateMonths(event) {
    this.monthsSince2020 = event.target.value;
  }

  @action
  transitionToWardName(wardName) {
    this.transitionToRoute('ward', wardName);
  }
}
