import { LatLng } from "leaflet";
import React, { SetStateAction, useState } from "react";
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
    isAfterRouteSearch: boolean;
    setPoly: React.Dispatch<SetStateAction<LatLng[][]>>;
    setRelayPoint: React.Dispatch<SetStateAction<relayPoint[]>>;
    onClickRouteSearch: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
    modal: {
        isShow: boolean;
        open: () => void;
        close: () => void;
        show: () => JSX.Element | null;
        setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
        setModalHander: (f: () => void) => () => void;
    }
    allButtons: (disabled: boolean) => void;
    middleFlag: number;
    setMiddleFlag: React.Dispatch<React.SetStateAction<number>>;
}


const DesitinationMap: React.FC<Props> = ({
    circle,
    relayPoint,
    poly,
    isAfterRouteSearch,
    setPoly,
    setRelayPoint,
    onClickRouteSearch,
    modal,
    allButtons,
    middleFlag,
    setMiddleFlag,
}) => {
    const AsyncModal = (valueGenerator: (r: (arg0: any) => void) => React.SetStateAction<React.ReactNode>) => new Promise<any>((r) => {
        modal.setContent(valueGenerator(r));
        modal.setModalHander(() => {
            modal.close();
            r(false);
        });
        modal.open();
    })


    const ClickMarker = () => {
        useMapEvents({
            click: async (e) => {
                if (isAfterRouteSearch && middleFlag === -1) {
                    return;
                }
                if (middleFlag === -1) {
                    relayPoint.push({ Point: e.latlng, Relay: false });
                } else {
                    relayPoint.splice(middleFlag, 0, { Point: e.latlng, Relay: true });
                    setMiddleFlag(middleFlag + 1);
                }
                setRelayPoint(relayPoint.map((e) => e));
            },
        })

        console.log('relayPoint', relayPoint); //DEBUG
        const counter = {
            value: 0,
        }
        const markerMaker = () => relayPoint.map((elem, index) => {
            if (!elem.Relay || true) { //XXX
                const svgIcon = L.divIcon({
                    html: `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 45" width="30" height="45" style="fill:rgba(0,0,0,0)">
                    <g stroke="none" fill="${elem.Relay ? 'red' : 'blue'}">
                        <path d="M 15 45 L 30 15 S 15 -15 0 15 L 15 45" />
                    </g>
                    <g fill="white" stroke="white" stroke-width="1">
                        <text text-anchor="middle" x="15" y="25">${elem.Relay ? '' : ++counter.value}</text>
                    </g>
                    </svg>`,
                    iconSize: [30, 45],
                    iconAnchor: [15, 45],
                    popupAnchor: [0, 0],
                    className: 'numberMarker'
                });
                return <Marker
                    position={elem.Point}
                    key={index}
                    icon={svgIcon}
                    eventHandlers={{
                        click: async (e) => {
                            if (isAfterRouteSearch) {
                                return;
                            }
                            const initValue = 0;
                            const numfalse = relayPoint.reduce(
                                (prevValue, currentValue) => currentValue.Relay ? prevValue : prevValue + 1,
                                initValue
                            );
                            console.log('numfalse', numfalse);
                            if (numfalse === 1) {
                                await AsyncModal(() =>
                                    <>
                                        <p>最後の目的地は削除できません<br />削除するには目的地選択で目的地リセットを押してください</p>
                                    </>
                                );
                                return;
                            }
                            const isok = await AsyncModal((r) =>
                                <>
                                    <p>この目的地を削除しますか？</p>
                                    <div>
                                        <button onClick={() => {
                                            modal.close();
                                            r(true);
                                        }}>OK</button>
                                    </div>
                                </>)
                            if (isok) {
                                console.log('index', index);
                                relayPoint.splice(index, 1);
                                setRelayPoint(relayPoint.map((e) => e));
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
                            weight={5}
                            pathOptions={path}
                            positions={elem}
                            key={index}
                            eventHandlers={{
                                click: async (e) => {
                                    const isok = await AsyncModal((r) =>
                                        <>
                                            <p>中継点を追加しますか？</p>
                                            <div>
                                                <button onClick={() => {
                                                    modal.close();
                                                    r(true);
                                                }}>OK</button>
                                            </div>
                                        </>
                                    );
                                    if (isok) {
                                        console.log('e.targe._latlngs', e.target._latlngs);
                                        const first = e.target._latlngs[0];
                                        const last = e.target._latlngs.at(-1);
                                        const firstindex = relayPoint.reduce((previous, current, index) => current.Point.equals(first) ? index : previous, -1);
                                        const lastindex = relayPoint.reduce((previous, current, index) => current.Point.equals(last) ? index : previous, -1);
                                        if (lastindex === -1) {
                                            console.error('こんなことは起こりません');
                                        }
                                        relayPoint.splice(firstindex + 1, lastindex - firstindex - 1);
                                        setRelayPoint(relayPoint.map((e) => e));
                                        setPoly([]);
                                        allButtons(true);
                                        setMiddleFlag(relayPoint.reduce((previous, current, index) => current.Point.equals(last) ? index : previous, -1));
                                        console.log('index', index);
                                    }
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
                maxZoom={21}
                maxNativeZoom={18}
            />
            <ClickMarker />
            <CircleMarker />
            <MultiPoly />
        </MapContainer >
    )
}
export default DesitinationMap;