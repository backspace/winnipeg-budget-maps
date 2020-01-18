import Route from '@ember/routing/route';
import Photos from '../data/councillor-photos';
import Contacts from '../data/councillor-contacts';

import resolveAsset from 'ember-cli-resolve-asset';
import inside from 'point-in-geopolygon';

export default class WardRoute extends Route {
  async model({ name }) {
    const {
      facilities,
      wards,
    } = this.modelFor('application');

    const ward = wards.features.find(ward => ward.properties.name === name);
    const councillorName = ward.properties.councillor;
    const photoFilename = Photos.find(person => person.name === councillorName).photo;
    const photoUrl = await resolveAsset(`councillors/${photoFilename}`);

    const contact = Contacts.find(c => c.person === councillorName);
    const emailLink = contact.email_link;
    const recipientIndex = emailLink.indexOf('Recipient=');
    const ampersandAfterRecipientIndex = emailLink.indexOf('&', recipientIndex + 1);
    const emailUsername = emailLink.substring(recipientIndex + 10, ampersandAfterRecipientIndex);
    const email = `${emailUsername}@winnipeg.ca`;

    const closures = facilities
      .filter(facility => facility.closure)
      .filter(facility => inside.polygon(ward.geometry.coordinates[0], [facility.lon, facility.lat]));

    return {
      ward,
      photoUrl,
      phone: contact.phone,
      email,
      closures,
    }
  }
}
