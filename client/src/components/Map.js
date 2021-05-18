import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';
import {useState} from "react";

const containerStyle = {
    maxWidth: '600px',
    height: '400px',
    margin: 'auto',
};

const Map = ({userLat, userLong, places}) => {
    const center = {
        lat: userLat,
        lng: userLong
    };

    console.log(places)
    const [state, setState] = useState({})

    // const onClose = () => {
    //     if (state.showingInfoWindow) {
    //         setState({
    //             showingInfoWindow: false,
    //             activeMarker: null
    //         });
    //     }
    // };

    const getMarkers = () => {
        return places.map(place => {
            let marker;
            const onLoad = (loadedMarker) => {
                marker = loadedMarker;
            }
            const onMarkerClick = () => {
                console.log(marker)
                setState({
                    activeMarker: marker,
                    showingInfoWindow: true
                });
            }
            const {location} = place.geometry;
            console.log(location)
            return (
                <Marker
                    key={place.name}
                    onLoad={onLoad}
                    onClick={onMarkerClick}
                    position={location}
                    title={place.name}
                />
            )
        })
    };

    return (<LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_KEY}
    >
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
        >
            {getMarkers()}
            {/*{state.activeMarker &&*/}
            {/*<InfoWindow*/}
            {/*    marker={state.activeMarker}*/}
            {/*    visible={state.showingInfoWindow}*/}
            {/*    onClose={onClose}*/}
            {/*>*/}
            {/*    <div>*/}
            {/*        <h4>{state.activeMarker?.title}</h4>*/}
            {/*    </div>*/}
            {/*</InfoWindow>*/}
            {/*}*/}
        </GoogleMap>
    </LoadScript>);
};

export default Map;
