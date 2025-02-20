mapboxgl.accessToken = 'pk.eyJ1IjoibG9sbHliaXQiLCJhIjoiY203Y3l2aWI5MG1ocTJqb2Q5cW5ybHc2biJ9.u4WzpF3ydaJiIssN9W9Rpw';

// const map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/streets-v12',
//     center: [-71.09415, 42.36027],
//     zoom: 12,
//     minZoom: 5,
//     maxZoom: 18
// });

// const svg = d3.select('#map')
//     .append('svg')
//     .style('position', 'absolute')
//     .style('top', '0')
//     .style('left', '0')
//     .style('width', '100%')
//     .style('height', '100%')
//     .style('pointer-events', 'none');

// let stations = [];
// let departures = new Map();
// let arrivals = new Map();

// let timeFilter = -1;
// const timeSlider = document.getElementById('timeSlider');
// const selectedTime = document.getElementById('selectedTime');
// const anyTimeLabel = document.getElementById('anyTime');

// function formatTime(minutes) {
//     if (minutes === -1) return "";
//     const date = new Date(0, 0, 0, 0, minutes);
//     return date.toLocaleString('en-US', { timeStyle: 'short' });
// }

// function updateTimeDisplay() {
//     timeFilter = Number(timeSlider.value);

//     if (timeFilter === -1) {
//         selectedTime.textContent = '';
//         anyTimeLabel.style.display = 'block';
//     } else {
//         selectedTime.textContent = formatTime(timeFilter);
//         anyTimeLabel.style.display = 'none';
//     }

//     console.log("Time filter updated:", timeFilter);
// }

// function getCoords(station) {
//     if (!station.lon || !station.lat) return { cx: -100, cy: -100 };
//     const point = map.project([+station.lon, +station.lat]);
//     return { cx: point.x, cy: point.y };
// }

// function updatePositions(radiusScale) {
//     svg.selectAll('circle')
//         .attr('cx', d => getCoords(d).cx)
//         .attr('cy', d => getCoords(d).cy)
//         .attr('r', d => radiusScale(d.totalTraffic));
// }

// map.on('load', () => {
//     map.addSource('boston_route', {
//         type: 'geojson',
//         data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson'
//     });

//     map.addLayer({
//         id: 'bike-lanes',
//         type: 'line',
//         source: 'boston_route',
//         paint: {
//             'line-color': '#32D400',
//             'line-width': 5,
//             'line-opacity': 0.6
//         }
//     });

//     map.addSource('cambridge_route', {
//         type: 'geojson',
//         data: 'https://raw.githubusercontent.com/cambridgegis/cambridgegis_data/main/Recreation/Bike_Facilities/RECREATION_BikeFacilities.geojson'
//     });

//     map.addLayer({
//         id: 'bike-lanes-2',
//         type: 'line',
//         source: 'cambridge_route',
//         paint: {
//             'line-color': '#808080',
//             'line-width': 5,
//             'line-opacity': 0.6
//         }
//     });

//     const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';
//     d3.json(jsonurl).then(jsonData => {
//         stations = jsonData.data.stations;

//         const trafficUrl = 'https://dsc106.com/labs/lab07/data/bluebikes-traffic-2024-03.csv';
//         d3.csv(trafficUrl).then(trips => {
//             console.log("Loaded Traffic Data:", trips.length);
//             departures = d3.rollup(trips, v => v.length, d => d.start_station_id);
//             arrivals = d3.rollup(trips, v => v.length, d => d.end_station_id);

//             stations = stations.map(station => {
//                 let id = station.short_name;
//                 station.departures = departures.get(id) ?? 0;
//                 station.arrivals = arrivals.get(id) ?? 0;
//                 station.totalTraffic = station.departures + station.arrivals;
//                 return station;
//             });

//             console.log("Updated Stations with Traffic Data:", stations);

//             const radiusScale = d3.scaleSqrt()
//                 .domain([0, d3.max(stations, d => d.totalTraffic)])
//                 .range([0, 25]);

//             const circles = svg.selectAll('circle')
//                 .data(stations)
//                 .enter()
//                 .append('circle')
//                 .attr('fill', 'steelblue')
//                 .attr('fill-opacity', 0.6)
//                 .attr('stroke', 'white')
//                 .attr('stroke-width', 1)
//                 .attr('opacity', 0.8)
//                 .each(function(d) {
//                     d3.select(this)
//                         .append('title')
//                         .text(`${d.totalTraffic} trips (${d.departures} departures, ${d.arrivals} arrivals)`);
//                 })
//                 .style('pointer-events', 'auto'); 

//             updatePositions(radiusScale);

//             map.on('move', () => updatePositions(radiusScale));
//             map.on('zoom', () => updatePositions(radiusScale));
//             map.on('resize', () => updatePositions(radiusScale));
//             map.on('moveend', () => updatePositions(radiusScale));

//             timeSlider.addEventListener('input', updateTimeDisplay);

//             updateTimeDisplay();

//         }).catch(error => {
//             console.error("Error loading CSV:", error);
//         });
//     }).catch(error => {
//         console.error("Error loading JSON:", error);
//     });
// })

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-71.09415, 42.36027],
    zoom: 12,
    minZoom: 5,
    maxZoom: 18
});

const svg = d3.select('#map')
    .append('svg')
    .style('position', 'absolute')
    .style('top', '0')
    .style('left', '0')
    .style('width', '100%')
    .style('height', '100%')
    .style('pointer-events', 'none');

let stations = [];
let departures = new Map();
let arrivals = new Map();
let trips = [];

let filteredTrips = [];
let filteredArrivals = new Map();
let filteredDepartures = new Map();
let filteredStations = [];

let timeFilter = -1;
const timeSlider = document.getElementById('timeSlider');
const selectedTime = document.getElementById('selectedTime');
const anyTimeLabel = document.getElementById('anyTime');

function minutesSinceMidnight(date) {
  return date.getHours() * 60 + date.getMinutes();
}

function filterTripsbyTime() {
  filteredTrips = timeFilter === -1
    ? trips
    : trips.filter((trip) => {
        const startedMinutes = minutesSinceMidnight(trip.started_at);
        const endedMinutes = minutesSinceMidnight(trip.ended_at);
        return (
          Math.abs(startedMinutes - timeFilter) <= 60 ||
          Math.abs(endedMinutes - timeFilter) <= 60
        );
      });

  filteredDepartures = d3.rollup(filteredTrips, v => v.length, d => d.start_station_id);
  filteredArrivals = d3.rollup(filteredTrips, v => v.length, d => d.end_station_id);

  filteredStations = stations.map(station => {
    const clonedStation = { ...station };
    let id = clonedStation.short_name;
    clonedStation.departures = filteredDepartures.get(id) ?? 0;
    clonedStation.arrivals = filteredArrivals.get(id) ?? 0;
    clonedStation.totalTraffic = clonedStation.departures + clonedStation.arrivals;
    return clonedStation;
  });

  updateVisualization();
}

function formatTime(minutes) {
    if (minutes === -1) return "";
    const date = new Date(0, 0, 0, 0, minutes);
    return date.toLocaleString('en-US', { timeStyle: 'short' });
}

function updateTimeDisplay() {
    timeFilter = Number(timeSlider.value);

    if (timeFilter === -1) {
        selectedTime.textContent = '';
        anyTimeLabel.style.display = 'block';
    } else {
        selectedTime.textContent = formatTime(timeFilter);
        anyTimeLabel.style.display = 'none';
    }

    console.log("Time filter updated:", timeFilter);
    filterTripsbyTime();
}

function getCoords(station) {
    if (!station.lon || !station.lat) return { cx: -100, cy: -100 };
    const point = map.project([+station.lon, +station.lat]);
    return { cx: point.x, cy: point.y };
}

function updatePositions(radiusScale) {
    svg.selectAll('circle')
        .attr('cx', d => getCoords(d).cx)
        .attr('cy', d => getCoords(d).cy)
        .attr('r', d => radiusScale(d.totalTraffic));
}

function updateVisualization() {
  const radiusScale = d3.scaleSqrt()
    .domain([0, d3.max(filteredStations, d => d.totalTraffic)])
    .range(timeFilter === -1 ? [0, 25] : [3, 50]);

  svg.selectAll('circle')
    .data(filteredStations)
    .attr('r', d => radiusScale(d.totalTraffic))
    .each(function(d) {
      d3.select(this).select('title')
        .text(`${d.totalTraffic} trips (${d.departures} departures, ${d.arrivals} arrivals)`);
    });

  updatePositions(radiusScale);
}

map.on('load', () => {
    map.addSource('boston_route', {
        type: 'geojson',
        data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson'
    });

    map.addLayer({
        id: 'bike-lanes',
        type: 'line',
        source: 'boston_route',
        paint: {
            'line-color': '#32D400',
            'line-width': 5,
            'line-opacity': 0.6
        }
    });

    map.addSource('cambridge_route', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/cambridgegis/cambridgegis_data/main/Recreation/Bike_Facilities/RECREATION_BikeFacilities.geojson'
    });

    map.addLayer({
        id: 'bike-lanes-2',
        type: 'line',
        source: 'cambridge_route',
        paint: {
            'line-color': '#808080',
            'line-width': 5,
            'line-opacity': 0.6
        }
    });

    const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';
    d3.json(jsonurl).then(jsonData => {
        stations = jsonData.data.stations;

        const trafficUrl = 'https://dsc106.com/labs/lab07/data/bluebikes-traffic-2024-03.csv';
        d3.csv(trafficUrl).then(tripsData => {
            trips = tripsData.map(trip => ({
                ...trip,
                started_at: new Date(trip.start_time),
                ended_at: new Date(trip.end_time)
            }));

            console.log("Loaded Traffic Data:", trips.length);
            departures = d3.rollup(trips, v => v.length, d => d.start_station_id);
            arrivals = d3.rollup(trips, v => v.length, d => d.end_station_id);

            stations = stations.map(station => {
                let id = station.short_name;
                station.departures = departures.get(id) ?? 0;
                station.arrivals = arrivals.get(id) ?? 0;
                station.totalTraffic = station.departures + station.arrivals;
                return station;
            });

            console.log("Updated Stations with Traffic Data:", stations);

            filteredStations = [...stations];
            filterTripsbyTime(); 

            const radiusScale = d3.scaleSqrt()
                .domain([0, d3.max(filteredStations, d => d.totalTraffic)])
                .range(timeFilter === -1 ? [0, 25] : [3, 50]);

            const circles = svg.selectAll('circle')
                .data(filteredStations)
                .enter()
                .append('circle')
                .attr('fill', 'steelblue')
                .attr('fill-opacity', 0.6)
                .attr('stroke', 'white')
                .attr('stroke-width', 1)
                .attr('opacity', 0.8)
                .each(function(d) {
                    d3.select(this)
                        .append('title')
                        .text(`${d.totalTraffic} trips (${d.departures} departures, ${d.arrivals} arrivals)`);
                })
                .style('pointer-events', 'auto'); 

            updatePositions(radiusScale);

            map.on('move', () => updatePositions(radiusScale));
            map.on('zoom', () => updatePositions(radiusScale));
            map.on('resize', () => updatePositions(radiusScale));
            map.on('moveend', () => updatePositions(radiusScale));

            timeSlider.addEventListener('input', updateTimeDisplay);

            updateTimeDisplay();

        }).catch(error => {
            console.error("Error loading CSV:", error);
        });
    }).catch(error => {
        console.error("Error loading JSON:", error);
    });
});

