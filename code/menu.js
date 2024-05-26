
const Button = document.getElementById('List');
const ButtonElement = document.getElementById('Button');
ButtonElement.addEventListener("click", openMenu);
function openMenu() {
    if (Button.style.display != 'block') {
        Button.style.display = 'block';
    } else {
        Button.style.display = 'none';
    }
    console.log('clicked');
}





const mapAttribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

let map = L.map('BreweryMap').setView([59.745, -1.18], 2);
let tile = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { mapAttribution }).addTo(map);
let markerGroup = new L.LayerGroup();
map.addLayer(markerGroup);





async function show_breweries() {
    const BreweriesURL = "https://api.openbrewerydb.org/breweries";

    try {
        let locationResponse = await fetch(BreweriesURL);
        let breweries = await locationResponse.json();

        breweries.forEach(brewery => {
            if (brewery.latitude && brewery.longitude) {
                let marker = L.marker([brewery.latitude, brewery.longitude]).addTo(map);
                marker.bindPopup(`<b>${brewery.name}</b><br>${brewery.street}<br>${brewery.city}, ${brewery.state}`).openPopup();
                markerGroup.addLayer(marker);
            }
        });
    } catch (error) {
        console.error("Error fetching breweries:", error);
        alert("Failed to load breweries data.");
    }
}







async function show_me() {
    let searchTerm = document.getElementById("Search").value.trim();
    if (!searchTerm) {
        alert("ACHTUNG!! NO LOCATION FOUND!!");
        return;
    }

    const API_URL = `https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}`;
    const Brewery_URL = `https://api.openbrewerydb.org/breweries?by_state=${searchTerm}`;

    try {
        let locationResponse = await fetch(API_URL);
        let breweryResponse = await fetch(Brewery_URL);
        let breweries = await locationResponse.json();
        let breweryData = await breweryResponse.json();

        console.log(breweries);
        console.log(breweryData);

        if (breweryData.length > 0) {
            markerGroup.clearLayers();

            breweryData.forEach(e => {
                if (e.latitude && e.longitude) {
                    let marker = L.marker([e.latitude, e.longitude]).addTo(map);
                    marker.bindPopup(`<b>${e.name}</b><br>${e.street}<br>${e.city}, ${e.state}`).openPopup();
                    markerGroup.addLayer(marker);
                    map.setView([e.latitude, e.longitude], 7);
                    
                }
            });
        } else {
            alert("No breweries found in state.");
        }
    } catch (error) {
        console.error("Error fetching brewery info or position:", error);
        alert("Unable to retrieve data.");
    }
}