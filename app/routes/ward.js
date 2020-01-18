import Route from '@ember/routing/route';
import Wards from '../data/wards';
import Photos from '../data/councillor-photos';
import Contacts from '../data/councillor-contacts';

export default class WardRoute extends Route {
  model({ name }) {
    const ward = Wards.features.find(ward => ward.properties.name === name);
    const councillorName = ward.properties.councillor;
    const photoUrl = Photos.find(person => person.name === councillorName).photo;

    const contact = Contacts.find(c => c.person === councillorName);
    const emailLink = contact.email_link;
    const recipientIndex = emailLink.indexOf('Recipient=');
    const ampersandAfterRecipientIndex = emailLink.indexOf('&', recipientIndex + 1);
    const emailUsername = emailLink.substring(recipientIndex + 10, ampersandAfterRecipientIndex);
    const email = `${emailUsername}@winnipeg.ca`;

    return {
      ward,
      photoUrl,
      phone: contact.phone,
      email,
    }
  }
}
