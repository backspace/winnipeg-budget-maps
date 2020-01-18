const fs = require('fs');

const Libraries = require('../data/libraries.json');

const processedLibraries = Libraries.data.map(row => {
  const name = row[8];
  return {
    name,
    lat: parseFloat(row[19][1]),
    lon: parseFloat(row[19][2]),
  };
});

fs.writeFileSync('app/data/libraries.json', JSON.stringify(processedLibraries));


const IndoorPools = require('../data/indoor-pools.json');
const OutdoorPools = require('../data/outdoor-pools.json');

const processedIndoorPools = IndoorPools.data.map(row => {
  const name = row[8];
  return {
    name,
    lat: parseFloat(row[45][1]),
    lon: parseFloat(row[45][2]),
  }
});

const processedOutdoorPools = OutdoorPools.data.map(row => {
  const name = row[8];
  return {
    name,
    lat: parseFloat(row[37][1]),
    lon: parseFloat(row[37][2]),
  }
});

fs.writeFileSync('app/data/pools.json', JSON.stringify(processedIndoorPools.concat(processedOutdoorPools)));
