const gtfs = require('gtfs-stream');
const fs = require('fs');

const intersect = require('@turf/intersect').default;
const lineToPolygon = require('@turf/line-to-polygon').default;
const cleanCoords = require('@turf/clean-coords').default;

const multiLineString = require('@turf/helpers').multiLineString;

const collect = require('get-stream');

const routeToPaths = {}, routeToShapeIds = {};
const wardToRoutes = {};
const cutRoutes = [1, 2, 3, 10, 68, 79, 82, 83, 84, 85, 89, 92, 93, 94, 95, 97, 98];

const Wards = require('../app/data/wards.json');

async function process() {
  const data = await collect.array(fs.createReadStream('./data/google_transit.zip').pipe(gtfs.enhanced()));

  data.forEach(entity => {
    if (entity.type === 'trip' && cutRoutes.includes(entity.data.route_id)) {
      const route = entity.data.route_id;
      if (!routeToPaths[route]) {
        routeToPaths[route] = [];
        routeToShapeIds[route] = new Set();
      }

      if (!routeToShapeIds[route].has(entity.data.shape_id)) {
        routeToShapeIds[route].add(entity.data.shape_id);
        routeToPaths[route].push(entity.data.path);
      }
   }
  });

  Wards.features.forEach(ward => {
    wardToRoutes[ward.properties.name] = [];
  })

  Object.keys(routeToPaths).forEach(routeString => {
    const combinedPaths = cleanCoords(multiLineString(routeToPaths[routeString]), { mutate: true });
    fs.writeFileSync(`public/route-paths/${routeString}.json`, JSON.stringify(combinedPaths));

    Wards.features.forEach(ward => {
      const anyPathsIntersectWard = routeToPaths[routeString].some(path => {
        return intersect(lineToPolygon(path), ward);
      });

      if (anyPathsIntersectWard) {
        wardToRoutes[ward.properties.name].push(routeString);
      }
    });
  });

  fs.writeFileSync('app/data/ward-routes.json', JSON.stringify(wardToRoutes));
}

process();
