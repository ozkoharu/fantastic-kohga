import { LatLng } from "leaflet";
import { NextPage } from "next";
import React, { SetStateAction, useState } from "react";
import { Circle, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useModal } from "../hooks/useModal";

interface LatLngRadius {
    position: LatLng,
    radius: number,
}
interface LatLngRadiusID extends LatLngRadius {
    passableId: number
}
interface Props {
    circle: LatLngRadius[],
    setCircle: React.Dispatch<React.SetStateAction<LatLngRadius[]>>
    radius: number,
    setRadius: React.Dispatch<React.SetStateAction<number>>,
    removeFlag: boolean,
    setRemoveFlag: React.Dispatch<React.SetStateAction<boolean>>,
}
const position = new LatLng(38.72311671577611, 141.0346841825174);
const zoomlebel = 18;


//サークル

const CircleMap: React.FC<Props> = ({
    circle,
    setCircle,
    radius,
    setRadius,
    removeFlag,
    setRemoveFlag,
}) => {
    const modal = useModal();

    const AsyncModal = (valueGenerator: (r: (arg0: any) => void) => React.SetStateAction<React.ReactNode>) => new Promise<any>((r) => {
        modal.setContent(valueGenerator(r));
        modal.setModalHander(() => {
            modal.close();
            r(false);
        });
        modal.open();
    });

    const ClickCircle = () => {
        useMapEvents({
            click(e) {
                setCircle((prevValue) => {
                    const newValue = [...prevValue, { position: e.latlng, radius: radius }]
                    return newValue;
                });
            }
        });
        return (
            <React.Fragment>
                {
                    circle.map((e, index) =>
                        <Circle
                            center={e.position}
                            pathOptions={{ fillColor: "blue" }}
                            radius={e.radius}
                            key={index}
                            stroke={false} />
                    )
                }
            </React.Fragment>
        )
    }
    const RemoveCircle = () => {
        return (
            <React.Fragment>
                {
                    circle.map((e, index) =>
                        <Circle
                            center={e.position}
                            pathOptions={{ fillColor: "red" }}
                            radius={e.radius}
                            key={index}
                            stroke={false}
                        />
                    )
                }
            </React.Fragment>
        )
    }


    return (
        <>
            {
                modal.show()
            }
            <MapContainer center={position} zoom={zoomlebel} scrollWheelZoom={false} doubleClickZoom={false} >
                <TileLayer
                    attribution='&opy; <a href="http://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a> contributors'
                    url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
                    maxZoom={21}
                    maxNativeZoom={18}
                />
                {
                    removeFlag ? <RemoveCircle /> : <ClickCircle />
                }
            </MapContainer>
        </>

    )
}
export default CircleMap;