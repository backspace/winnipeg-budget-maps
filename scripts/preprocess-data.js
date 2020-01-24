const fs = require('fs');

const Wards = require('../app/data/wards.json');
const geojsonBounds = require('geojson-bounds');

Wards.features.forEach(ward => {
  ward.properties.extent = geojsonBounds.extent(ward);
});

Wards.properties = {
  extent: geojsonBounds.extent(Wards)
};

fs.writeFileSync('app/data/wards.json', JSON.stringify(Wards, null, 2));

const inside = require('point-in-geopolygon');

const processedLibraries = extractRows(require('../data/libraries.json').data, 'library', 19);
const processedIndoorPools = extractRows(require('../data/indoor-pools.json').data, 'indoor-pool', 45);
const processedOutdoorPools = extractRows(require('../data/outdoor-pools.json').data, 'outdoor-pool', 37);
const processedWadingPools = extractRows(require('../data/wading-pools.json').data, 'wading-pool', 28);
const processedArenas = extractRows(require('../data/arenas.json').data, 'arena', 15);


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


fs.writeFileSync('app/data/facilities.json', JSON.stringify(processedLibraries.concat(processedIndoorPools, processedOutdoorPools, processedWadingPools, processedArenas), null, 2));

function calculateDistance(a, b) {
  return Math.sqrt(
    Math.pow(b.lat - a.lat, 2) +
    Math.pow(b.lon - a.lon, 2)
  )
}

function extractRows(rows, type, positionColumn) {
  return rows.map(row => {
    const name = row[8], lat = parseFloat(row[positionColumn][1]), lon = parseFloat(row[positionColumn][2]);
    return {
      name,
      lat,
      lon,
      type,
      ward: Wards.features.find(ward => inside.polygon(ward.geometry.coordinates[0], [lon, lat])).properties.name,
    };
  });}
