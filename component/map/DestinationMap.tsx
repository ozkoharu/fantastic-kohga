import e from "express";
import { LatLng } from "leaflet";
import React, { SetStateAction } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents, Circle, Polyline } from "react-leaflet";


const position = new LatLng(38.72311671577611, 141.0346841825174);
const zoomlebel = 18;
const path = { color: "green" }
interface Props {
    circle: LatLngRadius[];
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
        return (
            <React.Fragment>
                {

                    relayPoint.map((elem, index) =>
                        elem.Relay ? <></> :
                            <Marker
                                position={elem.Point}
                                key={index}
                                eventHandlers={{
                                    contextmenu: (e) => {
                                        if (confirm('この目的地を削除しますか？')) {
                                            let index = relayPoint.indexOf({ Point: e.latlng, Relay: false });
                                            relayPoint.slice(index, 1);
                                            //ここで再描画
                                        }
                                    }
                                }}
                            ></Marker>
                    )
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
                            center={elem.Position}
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