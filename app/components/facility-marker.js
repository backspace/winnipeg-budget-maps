import Component from '@glimmer/component';
import L from 'leaflet';

export default class FacilityMarkerComponent extends Component {
  get svgFilename() {
    return {
      'arena': 'arena',
      'indoor-pool': 'swimming',
      'library': 'library',
      'outdoor-pool': 'swimming',
      'wading-pool': 'wading-pool',
    }[this.args.facility.type];
  }

  get length() {
    if (this.args.facility.type === 'wading-pool') {
      return this.args.markerLength/2;
    } else {
      return this.args.markerLength;
    }
  }

  get icon() {
    return L.icon({
      iconUrl: `/icons/${this.svgFilename}.svg`,
      iconSize: L.point(this.length, this.length),
    });
  }
}
