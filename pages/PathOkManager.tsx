import { LatLng } from "leaflet";
import { NextPage } from "next";
import { MODERN_BROWSERSLIST_TARGET } from "next/dist/shared/lib/constants";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import _BaseButton from "../component/atoms/button/_BaseButton";
import { CheckBoxForm } from "../component/atoms/checkbox/checkBoxForm";
import { useModal } from "../component/hooks/useModal";
import { AdminIdContext } from "./_app";

const addPassableUrl = 'http://sazasub.kohga.local/addPassable';
const reqPassAdminUrl = 'http://sazasub.kohga.local/reqPassAdmin';
const delPassableUrl = 'http://sazasub.kohga.local/delPassable';

interface BaseApiResponse {
    succeeded: boolean
}

interface LatLngRadius {
    position: LatLng,
    radius: number,
}
interface LatLngRadiusID extends LatLngRadius {
    passableId: number,
}
interface ReqPassable {
    adminId: string,
}
interface ResPassable {
    succeeded: boolean,
    passableInfo?: LatLngRadiusID[],
}
interface ReqAddPassable {
    adminId: string,
    passPoints: LatLngRadius[]
}
interface ReqDelPassable {
    adminId: string,
    passId: number[],
}
interface ResDelPassable {
    succeeded: string,
    passPoints: LatLngRadiusID[],
}

export const DynamicCircleMap = dynamic(() => {
    return (
        import('../component/map/CircleMap')
    )
}, { ssr: false }
)

const PathOkManager: NextPage = () => {
    const modal = useModal();
    const router = useRouter();
    const [circle, setCircle] = useState<LatLngRadius[]>([]);
    const [radius, setRadius] = useState<number>(0);
    const [removeFlag, setRemoveFlag] = useState<boolean>(false);
    const { adminId } = useContext(AdminIdContext);
    const [lastNum, setLastNum] = useState<number>(0);
    const [removeCircleId, setRemoveCircleId] = useState<number[]>([]);
    const [removeCirle, setRemoveCircle] = useState<LatLngRadiusID[]>([]);

    const onClickBack = () => {
        router.push('/CarManager');
    }
    const kakutei = async () => {
        //????????????????????????
        //?????????????????????????????????
        //????????????????????????????????????
        console.log('lastnum', lastNum);
        const num = circle.length;
        console.log('?????????????????????????????????', num);
        const newPointsNum = lastNum - num;
        console.log('?????????????????????', newPointsNum);
        //circle???????????????num-lastNum????????????POST??????
        const newPoints = [];
        newPoints.push(...circle.slice(lastNum - num));
        console.log('newPoints', newPoints);
        console.log('circle', circle);

        const addPassableData = {
            adminId: adminId,
            passPoints: newPoints,
        }
        try {
            const res = await fetch(addPassableUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(addPassableData)
            });
            const result = await res.json() as BaseApiResponse;
            if (result.succeeded) {
                modal.setContent(
                    <>
                        <p>???????????????????????????????????????</p>
                    </>
                );
                modal.open();
            } else {
                modal.setContent(
                    <>
                        <p>???????????????????????????<br />????????????????????????????????????</p>
                    </>
                );
                modal.open();
            }
        } catch (e) {
            modal.setContent(
                <>
                    <p>???????????????</p>
                </>
            );
            modal.open();
        }
    }
    const onChangePathOk = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const cheked = e.currentTarget.checked;
        const passableinfo = [];
        const reqPassData: ReqPassable = {
            adminId: adminId
        }
        if (cheked) {
            try {
                const res = await fetch(reqPassAdminUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(reqPassData)
                });
                const result = await res.json() as ResPassable;
                if (result.succeeded) {
                    for (const elem of result.passableInfo || []) {
                        passableinfo.push(elem);
                    }
                    setLastNum(passableinfo.length);
                }
            } catch (e) {
                modal.setContent(
                    <>
                        <p>???????????????</p>
                    </>
                );
                modal.open();
            }
        }
        setCircle(passableinfo);
        setRemoveCircle(passableinfo);
    }
    const reqPassAdmin = async () => {
        const reqPassData: ReqPassable = {
            adminId: adminId
        };
        const temp = [];
        try {
            const res = await fetch(reqPassAdminUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reqPassData)
            });
            const result = await res.json() as ResPassable;
            if (result.succeeded) {
                for (const elem of result.passableInfo || []) {
                    temp.push(elem);
                }
                setLastNum(temp.length);
            } else {
                modal.setContent(
                    <>
                        <p>??????</p>
                    </>
                )
            }
        } catch (e) {
            modal.setContent(
                <>
                    <p>???????????????</p>
                </>
            );
            modal.open();
        }
        setCircle(temp);
        setRemoveCircle(temp);
    }
    const AsyncModal = (valueGenerator: (r: (arg0: any) => void) => React.SetStateAction<React.ReactNode>) => new Promise<any>((r) => {
        modal.setContent(valueGenerator(r));
        modal.setModalHander(() => {
            modal.close();
            r(false);
        });
        modal.open();
    })
    const removeCircle = async () => {
        if (removeFlag) {
            const DelPassableData: ReqDelPassable = {
                adminId: adminId,
                passId: removeCircleId,
            }
            const issave = await AsyncModal((r) =>
                <>
                    <p>??????????????????????????????</p>
                    <button onClick={() => {
                        modal.close();
                        r(true);
                    }}>OK</button>
                </>
            );
            if (issave) {
                try {
                    const res = await fetch(delPassableUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(DelPassableData)
                    });
                    const result = await res.json() as ResDelPassable;
                    if (result.succeeded) {
                        setRemoveCircle(result.passPoints);
                        modal.setContent(
                            <>
                                <p>???????????????????????????</p>
                            </>
                        );
                        modal.open();
                    } else {
                        modal.setContent(
                            <>
                                <p>???????????????????????????</p>
                            </>
                        );
                        modal.open();
                    }
                } catch (e) {
                    modal.setContent(
                        <>
                            <p>???????????????</p>
                        </>
                    );
                    modal.open();
                } finally {
                    setRemoveFlag(false);
                }
            } else {
                return;
            }
        }
    }

    return (
        <>
            {
                modal.show()
            }
            <_BaseButton onClick={kakutei}>
                ????????????????????????
            </_BaseButton>
            <label htmlFor="sel">???????????????</label>
            <input type="number" onChange={(e) => setRadius(e.target.valueAsNumber)} name="sel" id="sel" value={radius} />
            <CheckBoxForm name="pathOk" id="pathOk" onChange={onChangePathOk}>
                ????????????????????????
            </CheckBoxForm>
            <_BaseButton onClick={() => setRemoveFlag(true)}>
                ?????????????????????
            </_BaseButton>
            <_BaseButton onClick={onClickBack}>
                ??????
            </_BaseButton>
            {
                removeFlag ? <_BaseButton onClick={removeCircle}>??????</_BaseButton> : null
            }

            <DynamicCircleMap
                circle={circle}
                setCircle={setCircle}
                radius={radius}
                setRadius={setRadius}
                removeFlag={removeFlag}
                removeCircleId={removeCircleId}
                setRemoveCircleId={setRemoveCircleId}
                removeCircle={removeCirle}
                setRemoveCircle={setRemoveCircle}
            />
        </>
    )
}
export default PathOkManager;