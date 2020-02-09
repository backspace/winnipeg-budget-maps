const fs = require('fs');

const Wards = require('../app/data/wards.json');
const geojsonBounds = require('geojson-bounds');

Wards.features.forEach(ward => {
  ward.properties.extent = geojsonBounds.extent(ward);
});

Wards.properties = {
  extent: geojsonBounds.extent(Wards)
};

const Notes = require('../data/notes.json');

fs.writeFileSync('app/data/wards.json', JSON.stringify(Wards, null, 2));

const inside = require('point-in-geopolygon');

const processedLibraries = extractRows(require('../data/libraries.json').data, 'library', 19);
const processedIndoorPools = extractRows(require('../data/indoor-pools.json').data, 'indoor-pool', 45);
const processedOutdoorPools = extractRows(require('../data/outdoor-pools.json').data, 'outdoor-pool', 37);
const processedWadingPools = extractRows(require('../data/wading-pools.json').data, 'wading-pool', 28);
const processedArenas = extractRows(require('../data/arenas.json').data, 'arena', 15);

const fireAndParamedicStations = require('../data/fire-paramedic.json').data;

const processedFireStations = extractRows(fireAndParamedicStations.filter(row => row[10] === 'Fire Only'), 'fire-station', 12, 9).map(station => {
  station.name = `${station.name} Fire Hall`;
  return station;
});

const processedFireAndParamedicStations = extractRows(fireAndParamedicStations.filter(row => row[10] === 'Fire Paramedic Combined'), 'fire-paramedic-station', 12, 9).map(station => {
  station.name = `${station.name} Fire and Paramedic Station`;
  return station;
});

const processedFitnessCentres = extractRows(require('../data/fitness-leisure.json').data, 'fitness', 24).filter(centre => centre.name === 'Peguis Trail Fitness Centre');

const closedWadingPools = [];
const remainingWadingPools = [...processedWadingPools];

while (closedWadingPools.length < 38) {
  let minimumDistance = Number.MAX_VALUE;
  let closestPair;

  for (let i = 0; i < remainingWadingPools.length - 1; i++) {
    for (let j = i + 1; j < remainingWadingPools.length; j++) {
      const p = remainingWadingPools[i], q = remainingWadingPools[j];
      const distance = calculateDistance(p, q);

      if (distance < minimumDistance) {
        minimumDistance = distance;
        closestPair = [p, q];
      }
    }
  }

  const removing = closestPair[0];
  closedWadingPools.push(removing);

  const removingIndex = remainingWadingPools.indexOf(removing);
  remainingWadingPools.splice(removingIndex, 1);
}

closedWadingPools.forEach((pool, index) => {
  const closureYear = 2020 + index%4;
  pool.syntheticClosureDateString = `${closureYear}-07-01 23:00:00`;
});


fs.writeFileSync('app/data/facilities.json', JSON.stringify(
  processedLibraries.concat(
    processedIndoorPools,
    processedOutdoorPools,
    processedWadingPools,
    processedArenas,
    processedFireStations,
    processedFireAndParamedicStations,
    processedFitnessCentres
  ),
  null, 2));


const gtfs = require('gtfs-stream');

let glenwayFound = false;

fs.createReadStream('./data/google_transit.zip')
  .pipe(gtfs.enhanced())
  .on('data', entity => {
    if (entity.type === 'trip' && entity.data.block_id === 'b_3-11-2' && !glenwayFound) {
      glenwayFound = true;
      fs.writeFileSync('app/data/glenway.json', JSON.stringify(entity.data.path));
    }
  });

function calculateDistance(a, b) {
  return Math.sqrt(
    Math.pow(b.lat - a.lat, 2) +
    Math.pow(b.lon - a.lon, 2)
  )
}

function extractRows(rows, type, positionColumn, nameColumn = 8) {
  return rows.map(row => {
    const name = row[nameColumn], lat = parseFloat(row[positionColumn][1]), lon = parseFloat(row[positionColumn][2]);
    return {
      name,
      lat,
      lon,
      type,
      notes: Notes[name],
      ward: Wards.features.find(ward => inside.polygon(ward.geometry.coordinates[0], [lon, lat])).properties.name,
    };
  });}
