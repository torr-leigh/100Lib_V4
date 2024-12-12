var map = L.map('map').setView([44.0063, -120.3803], 7);

var Thunderforest_Landscape = L.tileLayer('https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey={apikey}', {
    attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    apikey: 'a041926a9b604bc6979e65c2a5942767',
    maxZoom: 22
});
Thunderforest_Landscape.addTo(map);

// Style for Oregon boundary
var myStyle = {
    color: "#8A51FD",  
    weight: 2,
    fillOpacity: 0
};

// Add Oregon state boundary GeoJSON
fetch('data/Oregon_State_Boundary.json') 
    .then(response => response.json())
    .then(geojsonData => {
        L.geoJSON(geojsonData, {
            style: myStyle,
        }).addTo(map);
    })
    .catch(error => console.error('Error loading state boundary:', error));

// Function to determine marker color based on progress
function getColor(progress) {
    switch (progress) {
        case "Installed":
            return "#33DB39"; // Green for Installed
        case "Upcoming Opening":
            return "#CF598C"; // Pink for Upcoming Opening
        case "In Design":
            return "#738CF2"; // Blue for In Design
        default:
            return "#F4E799"; // Yellow for null or other values
    }
}

// Variable to hold the library layer
let libraryLayer;

// Fetch and add the library layer GeoJSON
fetch('data/Oregon_Public_Libraries_-_Master_List.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('GeoJSON Data:', data); // Debugging: Verify the fetched data

        // Remove the existing layer if it exists
        if (libraryLayer) {
            map.removeLayer(libraryLayer);
        }

        // Create the GeoJSON layer for libraries
        libraryLayer = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                // Define marker options
                var libraryMarker = {
                    radius: 7,
                    fillColor: getColor(feature.properties.Progress),
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                };

                // Create a circle marker with the options
                var marker = L.circleMarker(latlng, libraryMarker);

                // Build the popup content
                let popupContent = `
                    <div style="font-size: 1.2em; font-weight: bold; margin-bottom: 5px;">
                        <span style="font-size: 1.5em;">Library Information</span>
                    </div>
                    <div style="line-height: 1.4;">
                `;
                for (const [key, value] of Object.entries(feature.properties)) {
                    if (key === "Website" && value) {
                        popupContent += `<b>${key}:</b> <a href="${value}" target="_blank">${value}</a><br>`;
                    } else {
                        popupContent += `<b>${key}:</b> ${value || "N/A"}<br>`;
                    }
                }
                popupContent += "</div>";

                // Bind the popup to the marker
                marker.bindPopup(popupContent);

                // Debugging: Confirm marker creation
                console.log('Marker created for:', feature.properties);

                return marker;
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error loading library layer:', error));

/*
var map = L.map('map').setView([44.0063, -120.3803], 7);


var Thunderforest_Landscape = L.tileLayer('https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey={apikey}', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: 'a041926a9b604bc6979e65c2a5942767',
	maxZoom: 22
});
Thunderforest_Landscape.addTo(map);


// style for Or boundary
var myStyle = {
    "color": "#8A51FD",  
    "weight": 2,
    "fillOpacity": 0
};

//___add geojson from data folder to map
//oregon state boundary file
fetch('data/Oregon_State_Boundary.json') 
.then(response => response.json())
.then(geojsonData => {
    var geojson = L.geoJSON(geojsonData, {
        style: myStyle,
    }).addTo(map);
})
.catch(error => console.error('Error: ', error));


// style for libraries layer
// path: data/OrLib_Dir_final.geojson

function getColor(progress) {
    switch (progress) {
        case "Installed":
            return "#33DB39"; // Green for Installed
        case "Upcoming Opening":
            return "#CF598C"; // Pink for Upcoming Opening
        case "In Design":
            return "#738CF2"; // Blue for In Design
        default:
            return "#F4E799"; // Yellow for null or other values
    }
}
    
   
//pulling in orlib dir geojson
// data/Oregon_Public_Libraries_-_Master_List.geojson
fetch('data/Oregon_Public_Libraries_-_Master_List.geojson')
.then(response => response.json())
.then(data => {
    console.log(data); 
    libraryLayer = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            // Define marker options
            var libraryMarker = {
                radius: 7, // Adjust the size of the circle
                fillColor: getColor(feature.properties.Progress), // Call function to get color
                color: "#000", // Border color
                weight: 1, // Border width
                opacity: 1, // Border opacity
                fillOpacity: 0.8 // Fill opacity
            };
            // Create a circle marker with the options
            var marker = L.circleMarker(latlng, libraryMarker);
            
            // Build the popup content by iterating through the feature's properties
            let popupContent = `
                <div style="font-size: 1.2em; font-weight: bold; margin-bottom: 5px;">
                    <span style="font-size: 1.5em;">Library Information</span>
                </div>
                <div style="line-height: 1.4;">
            `;
            for (const [key, value] of Object.entries(feature.properties)) {
                if (key === "Website" && value) {
                    // Display as a clickable link for the "Website" field
                    popupContent += `<b>${key}:</b> <a href="${value}" target="_blank">${value}</a><br>`;
                } else {
                    // Display other fields as regular text
                    popupContent += `<b>${key}:</b> ${value || "N/A"}<br>`;
                }
            }
            popupContent += "</div>";
            // Bind the popup to the marker
            marker.bindPopup(popupContent);
            return marker;
        }
    }).addTo(map);
})
.catch(error => console.error('Error: ', error));


fetch('data/Oregon_Public_Libraries_-_Master_List.geojson')
.then(response => response.json())
.then(data => {
    console.log(data); 

    // Remove the layer if it already exists
    if (libraryLayer) {
        map.removeLayer(libraryLayer);
    }

    libraryLayer = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            var libraryMarker = {
                radius: 7,
                fillColor: getColor(feature.properties.Progress),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            return L.circleMarker(latlng, libraryMarker);

            var marker = L.circleMarker(latlng, libraryMarker);

            let popupContent = `
                <div style="font-size: 1.2em; font-weight: bold; margin-bottom: 5px;">
                    <span style="font-size: 1.5em;">Library Information</span>
                </div>
                <div style="line-height: 1.4;">
            `;
            for (const [key, value] of Object.entries(feature.properties)) {
                if (key === "Website" && value) {
                    popupContent += `<b>${key}:</b> <a href="${value}" target="_blank">${value}</a><br>`;
                } else {
                    popupContent += `<b>${key}:</b> ${value || "N/A"}<br>`;
                }
            }
            popupContent += "</div>";

            marker.bindPopup(popupContent);

            // Ensure pop-up opens on click
            marker.on('click', function () {
                marker.openPopup();
            });

            return marker;
        }
    }).addTo(map);
})
.catch(error => console.error('Error: ', error));


*/

