// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level for sf
// This gets inserted into the div with an id of 'map' in index.html
var myMap = L.map("map", {
    center: [40.7, -73.95],
    zoom: 11
  });
  
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

  // Store our link
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//  Get color radius call to link
d3.json(link, function(data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // set different color of magnitude
    function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }
  // set radius from magnitude
    function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }
    // GeoJSON layer
    L.geoJson(data, {
      // Make circles
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      // circle style
      style: styleInfo,
      // popup for each marker
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
    }).addTo(myMap);
  
    //  object legend
    var legend = L.control({
      position: "bottomright"
    });
  
    // legend details 
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
  
      var grades = [0, 1, 2, 3, 4, 5];
      var colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
      ];
  
      // for loop
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };
  
    // add legend to map
    legend.addTo(myMap);
  });
