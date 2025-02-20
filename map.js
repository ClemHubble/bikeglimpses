mapboxgl.accessToken = 'pk.eyJ1IjoibG9sbHliaXQiLCJhIjoiY203Y3l2aWI5MG1ocTJqb2Q5cW5ybHc2biJ9.u4WzpF3ydaJiIssN9W9Rpw';

const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v12', 
    center: [-71.09415, 42.36027], 
    zoom: 12, 
    minZoom: 5, 
    maxZoom: 18 
});

map.on('load', () => {
    map.addSource('boston_route', {
        type: 'geojson',
        data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson?...'
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
});

map.on('load', () => {
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
});