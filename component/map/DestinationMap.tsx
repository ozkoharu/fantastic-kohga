import { LatLng } from "leaflet";
import React, { SetStateAction } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents, Circle, Polyline } from "react-leaflet";
import { LatLangRadius } from "../../pages/Desitination";
import { relayPoint } from "../../pages/Desitination";
import L from 'leaflet';

const position = new LatLng(38.72311671577611, 141.0346841825174);
const zoomlebel = 18;
const path = { color: "green" }


interface Props {
    circle: LatLangRadius[];
    relayPoint: relayPoint[];
    poly: LatLng[][];
    setPoly: React.Dispatch<SetStateAction<LatLng[][]>>;
    setRelayPoint: React.Dispatch<SetStateAction<relayPoint[]>>;
}

const DesitinationMap: React.FC<Props> = ({
    circle,
    relayPoint,
    poly,
    setPoly,
    setRelayPoint,
}) => {

    const ClickMarker = () => {
        useMapEvents({
            click(e) {
                setRelayPoint((prevValue) => {
                    const newValue = [...prevValue, { Point: e.latlng, Relay: false }]
                    return newValue;
                });
            },
        })

        console.log('relayPoint', relayPoint); //DEBUG
        const markerMaker = () => relayPoint.map((elem, index) => {
            if (!elem.Relay) {
                const svgIcon = L.divIcon({
                    html: `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 45" width="30" height="45" style="fill:rgba(0,0,0,0)">
                    <g stroke="none" fill="blue">
                        <path d="M 15 45 L 30 15 S 15 -15 0 15 L 15 45" />
                    </g>
                    <g fill="white" stroke="white" stroke-width="1">
                        <text text-anchor="middle" x="15" y="25">${index + 1}</text>
                    </g>
                    </svg>`,
                    iconSize: [30, 45],
                    iconAnchor: [15, 45],
                    popupAnchor: [0, 0],
                    className: 'numberMarker'
                });
                return <Marker position={elem.Point}
                    key={index}
                    icon={svgIcon}
                    eventHandlers={{
                        contextmenu: (e) => {
                            if (confirm('この目的地を削除しますか？')) {
                                let index = relayPoint.indexOf({ Point: e.latlng, Relay: false });
                                relayPoint.slice(index, 1);
                                //ここで再描画

                            }
                        }
                    }}
                />
            }
        });
        return (
            <React.Fragment>
                {
                    markerMaker()
                }
            </React.Fragment>
        )
    }

    const CircleMarker = () => {
        return (
            <React.Fragment>
                {
                    circle.map((elem, index) =>
                        <Circle
                            center={elem.position}
                            pathOptions={{ fillColor: "blue" }}
                            radius={elem.radius}
                            key={index}
                            stroke={false}
                        ></Circle>
                    )
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
                            eventHandlers={{
                                click: (e) => {

                                }
                            }}
                        ></Polyline>
                    )
                }
            </React.Fragment>
        )
    }


    return (
        <MapContainer center={position} zoom={zoomlebel} scrollWheelZoom={false} doubleClickZoom={false} >
            <TileLayer
                attribution='&copy; <a href="http://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a> contributors'
                url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
            />
            <ClickMarker />
            <CircleMarker />
            <MultiPoly />
        </MapContainer >
    )
}
export default DesitinationMap;