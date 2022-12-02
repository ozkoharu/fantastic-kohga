import { LatLng } from "leaflet";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import _BaseButton from "../component/atoms/button/_BaseButton";
import { CheckBoxForm } from "../component/atoms/checkbox/checkBoxForm";
import { useModal } from "../component/hooks/useModal";
import { AdminIdContext } from "./_app";

const SavePathCircleUrl = 'http://saza.kohga.local:3001/addPassable';
const getPathOkUrl = 'http://saza.kohga.local:3001/reqPassAdmin';
const EndAdminUrl = 'http://saza.kohga.local:3001/terminateAdmin';


interface ReqEndAdmin {
    adminId: string
}
interface ResEndAdmin {
    succeeded: boolean
}
interface LatLngRadius {
    position: LatLng,
    radius: number,
}
interface LatLngRadiusID extends LatLngRadius {
    passableId: number,
}
interface IsPassable {
    succeeded: boolean,
    passableInfo?: LatLngRadiusID[]
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

    const onClickBack = () => {
        router.push('/CarManager');
    }
    const kakutei = async () => {
        console.log('cirle', circle);
    }
    const onChangePathOk = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const cheked = e.currentTarget.checked;
        const passableinfo = [];
        if (cheked) {
            try {
                const res = await fetch(getPathOkUrl);
                const result = await res.json() as IsPassable;

                if (result.succeeded) {
                    if (result.passableInfo !== undefined) {
                        for (const elem of result.passableInfo) {
                            passableinfo.push(elem);
                        }
                    }
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
    }
    const RemoveCircle = () => {
        console.log('remove');
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
            <_BaseButton onClick={RemoveCircle}>
                領域削除モード
            </_BaseButton>
            <_BaseButton onClick={onClickBack}>
                戻る
            </_BaseButton>

            <DynamicCircleMap
                circle={circle}
                setCircle={setCircle}
                radius={radius}
                setRadius={setRadius}
                removeFlag={removeFlag}
                setRemoveFlag={setRemoveFlag}
            />
        </>
    )
}
export default PathOkManager;