const fs = require('fs');

const Wards = require('../app/data/wards.json');
const geojsonBounds = require('geojson-bounds');

Wards.features.forEach(ward => {
  ward.properties.extent = geojsonBounds.extent(ward);
});

Wards.properties = {
  extent: geojsonBounds.extent(Wards)
};

fs.writeFileSync('app/data/wards.json', JSON.stringify(Wards));

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

fs.writeFileSync('app/data/facilities.json', JSON.stringify(processedLibraries.concat(processedIndoorPools, processedOutdoorPools)));
