import facilities from '../data/facilities';
import moment from 'moment';

const facilityCuts = {};

const libraries = facilities.filter(f => f.type === 'library');
const sundayLibraryClosures = ['Millennium Library', 'Henderson Library', 'Pembina Trail Library', 'St. Boniface Library', 'Sir William Stephenson Library'];

libraries.forEach(library => {
  const name = library.name;
  facilityCuts[name] = {
    'End evening hours earlier at 8pm': moment(new Date(2020, 8, 1)),
  };

  if (sundayLibraryClosures.includes(name)) {
    facilityCuts[name]['Close on Sundays'] = moment(new Date(2020, 8, 1));
  }
});

const laterPoolOpenings = ['Margaret Grant Pool', 'St. James Civic Centre Pool', 'Seven Oaks Pool'];

laterPoolOpenings.forEach(pool => {
  facilityCuts[pool] = {
    'Delay winter morning openings to 11:30am': moment(new Date(2021, 0, 1)),
  };
});

export default facilityCuts;
