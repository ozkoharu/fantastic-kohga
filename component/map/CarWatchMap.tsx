import { LatLng } from "leaflet";
import React from "react";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import L from 'leaflet';


interface Props {
    poly: LatLng[][];
    dest: LatLng[];
}

const position = new LatLng(38.72311671577611, 141.0346841825174);
const zoomlebel = 18;
const path = { color: "green" }

const CarWatchMap: React.FC<Props> = ({
    poly,
    dest,
}) => {

    const PointMarker = () => {
        const counter = {
            value: 0
        }
        const markerMaker = () => dest.map((elem, index) => {
            const svgIcon = L.divIcon({
                html: `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 45" width="30" height="45" style="fill:rgba(0,0,0,0)">
                <g stroke="none" fill="blue">
                    <path d="M 15 45 L 30 15 S 15 -15 0 15 L 15 45" />
                </g>
                <g fill="white" stroke="white" stroke-width="1">
                    <text text-anchor="middle" x="15" y="25">${++counter.value}</text>
                </g>
                </svg>`,
                iconSize: [30, 45],
                iconAnchor: [15, 45],
                popupAnchor: [0, 0],
                className: 'numberMarker'
            });
            return <Marker
                position={elem}
                key={index}
                icon={svgIcon}
            ></Marker>
        });
        return (
            <React.Fragment>
                {
                    markerMaker()
                }
            </React.Fragment>
        )
    }


    const MultiPoly = () => {
        return (
            <React.Fragment>
                {
                    poly.map((elem, index) =>
                        <Polyline
                            weight={10}
                            pathOptions={path}
                            positions={elem}
                            key={index}
                        ></Polyline>
                    )
                }
            </React.Fragment>
        )
    }
    return (
        <MapContainer center={position} zoom={zoomlebel} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="http://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a> contributors'
                url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
                maxZoom={21}
                maxNativeZoom={18}
            />
            <MultiPoly />
            <PointMarker />
        </MapContainer>
    )
}
export default CarWatchMap;