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

const Libraries = require('../data/libraries.json');

const processedLibraries = Libraries.data.map(row => {
  const name = row[8], lat = parseFloat(row[19][1]), lon = parseFloat(row[19][2]);
  return {
    name,
    lat,
    lon,
    type: 'library',
    ward: Wards.features.find(ward => inside.polygon(ward.geometry.coordinates[0], [lon, lat])).properties.name,
  };
});

const IndoorPools = require('../data/indoor-pools.json');
const OutdoorPools = require('../data/outdoor-pools.json');
const WadingPools = require('../data/wading-pools.json');

const processedIndoorPools = IndoorPools.data.map(row => {
  const name = row[8], lat = parseFloat(row[45][1]), lon = parseFloat(row[45][2]);
  return {
    name,
    lat,
    lon,
    type: 'indoor-pool',
    ward: Wards.features.find(ward => inside.polygon(ward.geometry.coordinates[0], [lon, lat])).properties.name,
  }
});

const processedOutdoorPools = OutdoorPools.data.map(row => {
  const name = row[8], lat = parseFloat(row[37][1]), lon = parseFloat(row[37][2]);
  return {
    name,
    lat,
    lon,
    type: 'outdoor-pool',
    ward: Wards.features.find(ward => inside.polygon(ward.geometry.coordinates[0], [lon, lat])).properties.name,
  }
});

const processedWadingPools = WadingPools.data.map(row => {
  const name = row[8], lat = parseFloat(row[28][1]), lon = parseFloat(row[28][2]);
  return {
    name,
    lat,
    lon,
    type: 'wading-pool',
    ward: Wards.features.find(ward => inside.polygon(ward.geometry.coordinates[0], [lon, lat])).properties.name,
  }
});

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

const Arenas = require('../data/arenas.json');

const processedArenas = Arenas.data.map(row => {
  const name = row[8], lat = parseFloat(row[15][1]), lon = parseFloat(row[15][2]);
  return {
    name,
    lat,
    lon,
    type: 'arena',
    ward: Wards.features.find(ward => inside.polygon(ward.geometry.coordinates[0], [lon, lat])).properties.name,
  }
});

fs.writeFileSync('app/data/facilities.json', JSON.stringify(processedLibraries.concat(processedIndoorPools, processedOutdoorPools, processedWadingPools, processedArenas), null, 2));

function calculateDistance(a, b) {
  return Math.sqrt(
    Math.pow(b.lat - a.lat, 2) +
    Math.pow(b.lon - a.lon, 2)
  )
}
