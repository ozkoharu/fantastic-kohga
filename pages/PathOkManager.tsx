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
        //通行可能領域保存
        //最新のやつだけ送りたい
        //正気か？モーダルが欲しい
        console.log('lastnum', lastNum);
        const num = circle.length;
        console.log('現在打たれている点のわ', num);
        const newPointsNum = lastNum - num;
        console.log('新しい領域の数', newPointsNum);
        //circleの後ろからnum-lastNum個の点をPOSTする
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
                        <p>通行可能領域を変更しました</p>
                    </>
                );
                modal.open();
            } else {
                modal.setContent(
                    <>
                        <p>変更に失敗しました<br />もう一度設定してください</p>
                    </>
                );
                modal.open();
            }
        } catch (e) {
            modal.setContent(
                <>
                    <p>通信エラー</p>
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
                        <p>通信エラー</p>
                    </>
                );
                modal.open();
            }
        }
        setCircle(passableinfo);
        setRemoveCircle(passableinfo);
    }
    const removeCircle = async () => {
        if (removeFlag) {
            const DelPassableData: ReqDelPassable = {
                adminId: adminId,
                passId: removeCircleId,
            }
            try {
                const res = await fetch(delPassableUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(DelPassableData)
                });
                const result = await res.json() as BaseApiResponse;
                if (result.succeeded) {
                    modal.setContent(
                        <>
                            <p>削除に成功しました</p>
                        </>
                    );
                    modal.open();
                } else {
                    modal.setContent(
                        <>
                            <p>削除に失敗しました</p>
                        </>
                    );
                    modal.open();
                }
            } catch (e) {
                modal.setContent(
                    <>
                        <p>通信エラー</p>
                    </>
                );
                modal.open();
            }
        }
    }


    return (
        <>
            {
                modal.show()
            }
            <_BaseButton onClick={kakutei}>
                通行可能領域確定
            </_BaseButton>
            <label htmlFor="sel">半径を入力</label>
            <input type="number" onChange={(e) => setRadius(e.target.valueAsNumber)} name="sel" id="sel" value={radius} />
            <CheckBoxForm name="pathOk" id="pathOk" onChange={onChangePathOk}>
                通行可能領域表示
            </CheckBoxForm>
            <_BaseButton onClick={() => setRemoveFlag(true)}>
                領域削除モード
            </_BaseButton>
            <_BaseButton onClick={onClickBack}>
                戻る
            </_BaseButton>
            {
                removeFlag ? <_BaseButton onClick={removeCircle}>削除</_BaseButton> : null
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