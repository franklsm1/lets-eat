import React from 'react'
import {
    Marker,
    GoogleMap,
    withScriptjs,
    withGoogleMap,
} from 'react-google-maps'
import { compose, withProps } from 'recompose';
import { GOOGLE_MAP_URL } from '../constants'

const Map = compose(
    withProps({
        googleMapURL: GOOGLE_MAP_URL,
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px`, maxWidth: `600px`, margin: `auto` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)(({lat, long}) =>
    <GoogleMap
        defaultZoom={13}
        defaultCenter={{ lat, lng: long }}
    >
        <Marker position={{ lat, lng: long }} />
    </GoogleMap>
);

export default Map;
