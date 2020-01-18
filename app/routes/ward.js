import Route from '@ember/routing/route';
import Wards from '../data/wards';
import Photos from '../data/councillor-photos';

export default class WardRoute extends Route {
  model({ name }) {
    const ward = Wards.features.find(ward => ward.properties.name === name);
    const councillorName = ward.properties.councillor;
    const photoUrl = Photos.find(person => person.name === councillorName).photo;

    return {
      ward,
      photoUrl
    }
  }
}
