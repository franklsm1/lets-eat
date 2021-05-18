import {Client} from "@googlemaps/google-maps-services-js";

const client = new Client({});

export const getNearbyRestaurants = (latLong) => {
    return client.placesNearby({
        params: {
            location: latLong,
            radius: 8047, // ~ 5 miles represented as meters
            type: "restaurant",
            key: process.env.GOOGLE_MAPS_API_KEY
        }
    })
        .then(response => response.data.results)
        .catch(err => console.log(err));
};
