import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class FacilityMarkerComponent extends Component {
  @tracked hovering = false;

  @action over() {
    this.hovering = true;
  }

  @action out() {
    this.hovering = false;
  }
}
