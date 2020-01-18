import Route from '@ember/routing/route';
import Wards from '../data/wards';

export default class WardRoute extends Route {
  model({ name }) {
    return Wards.features.find(ward => ward.properties.name === name);
  }
}
