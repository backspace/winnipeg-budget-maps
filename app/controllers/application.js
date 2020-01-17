import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import moment from 'moment';

export default class ApplicationController extends Controller {
  @tracked monthsSince2020 = 0;
  @tracked jan2020 = moment({y: 2020, m: 1, d: 1});

  get date() {
    return this.jan2020.clone().add(this.monthsSince2020, 'months');
  }

  @action
  updateMonths(event) {
    this.monthsSince2020 = event.target.value;
  }
}
