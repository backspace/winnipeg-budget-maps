import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import moment from 'moment';

export default class ApplicationController extends Controller {
  @tracked monthsSince2020 = 0;
  @tracked jan2020 = moment({y: 2020, m: 1, d: 1});

  @tracked activeWard;

  emptyArray = [];

  get date() {
    return this.jan2020.clone().add(this.monthsSince2020, 'months');
  }

  @action
  updateMonths(event) {
    this.monthsSince2020 = event.target.value;
  }

  @action
  transitionToWard(ward) {
    this.activeWard = ward.properties.name;
    this.transitionToRoute('ward', this.activeWard);
  }

  @action
  transitionToWardName(wardName) {
    const ward = this.model.wards.features.find(ward => ward.properties.name === wardName);
    this.transitionToWard(ward);
  }
}
