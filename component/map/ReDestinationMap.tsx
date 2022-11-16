import { LatLng } from "leaflet";
import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";

const position = new LatLng(38.72311671577611, 141.0346841825174);
const zoomlebel = 18;

const ReDestinationMap = () => {
    return (
        <MapContainer center={position} zoom={zoomlebel} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="http://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a> contributors'
                url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
            />
        </MapContainer>
    )
}
export default ReDestinationMap;