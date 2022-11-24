import { LatLng } from "leaflet";
import { NextPage } from "next";
import React, { useState } from "react";
import { Circle, MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { useModal } from "../hooks/useModal";

interface LatLngRadius {
    Position: LatLng,
    radius: number,
}


const position = new LatLng(38.72311671577611, 141.0346841825174);
const zoomlebel = 18;


//サークル

const CircleMap = () => {
    const modal = useModal();
    const [circle, setCircle] = useState<LatLngRadius[]>([]);
    const [radius, setRadius] = useState<number>(0);
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
                    const newValue = [...prevValue, { Position: e.latlng, radius: radius }]
                    return newValue;
                })
            }
        });
        return (
            <React.Fragment>
                {
                    circle.map((e, index) =>
                        <Circle
                            center={e.Position}
                            pathOptions={{ fillColor: "blue" }}
                            radius={e.radius}
                            key={index}
                            stroke={false}
                            eventHandlers={{
                                contextmenu: async (e) => {
                                    const isok = await AsyncModal((r) =>
                                        <>
                                            <p>この領域を削除しますか？</p>
                                            <button onClick={() => {
                                                modal.close();
                                                r(true);
                                            }}></button>
                                        </>);
                                    if (isok) {
                                        const index = circle.indexOf({ Position: e.latlng, radius: radius });
                                        setCircle(circle.splice(index, 1));
                                        //きっとうまくいく際描画
                                    }
                                }
                            }}></Circle>
                    )
                }
            </React.Fragment>
        )
    }


    return (
        <MapContainer center={position} zoom={zoomlebel} scrollWheelZoom={false} doubleClickZoom={false} >
            <TileLayer
                attribution='&opy; <a href="http://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a> contributors'
                url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
                maxZoom={21}
                maxNativeZoom={18}
            />
            <ClickCircle />
        </MapContainer>
    )
}
export default CircleMap;