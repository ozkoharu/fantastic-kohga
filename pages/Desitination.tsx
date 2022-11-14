import { useRouter } from "next/router";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useState, SetStateAction, useContext } from "react";
import ReactDOM from "react-dom";
import _BaseButton from "../component/atoms/button/_BaseButton";
import DesitinationMap from "../component/map/DestinationMap";
import { circle, LatLng } from "leaflet";
import { CheckBoxForm } from "../component/atoms/checkbox/checkBoxForm";
import { UserIdContext } from ".";

interface Props {
    event: React.Dispatch<SetStateAction<number>>
}
export type LatLangRadius = {
    Position: LatLng;
    radius: number;
}
export type relayPoint = {
    Point: LatLng;
    Relay: boolean;
}
export type PostDataSearch = {
    "userId": string;
    "junkai": boolean;
    "data": LatLng[];
    "relay": boolean[];
}
const PostAstarUrl = 'http://saza.kohga.local:3001/astar';
const PostOkRouteUrl = 'http://saza.kohga.local:3001/getPassable';

export const DynamicMapNoSSR = dynamic(() => {
    return (
        import('../component/map/DestinationMap')
    )
},
    { ssr: false }
)
const Desitination: NextPage = () => {
    const { userId } = useContext(UserIdContext);
    const [relayPoint, setRelayPoint] = useState<relayPoint[]>([]);
    const [viewCircle, setViewCircle] = useState<LatLangRadius[]>([]);
    const [poly, setPoly] = useState<LatLng[][]>([[]]);
    const [junkai, setJunkai] = useState<boolean>(false);
    const [pathOk, setPathOk] = useState<boolean>(false);
    const [isAfterRouteSearch, setIsAfterRouteSearch] = useState<boolean>(false);
    const router = useRouter();

    const onClickRouteSearch = async () => {
        const relayFlag = relayPoint.map((e) => e.Relay);
        const dataPoint = relayPoint.map((e) => e.Point);

        const PostData: PostDataSearch = {
            "userId": userId,
            "junkai": junkai,
            "data": dataPoint,
            "relay": relayFlag,
        }
        //fetch処理
        try {
            const res = await fetch(PostAstarUrl, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(PostData)
            });

            //resultにはJSONを解決したオブジェクトが入ってる
            const result = await res.json();
            console.log('result', result);
            if ('succeeded' in result && result.succeeded === true || true) { //FIXME
                setIsAfterRouteSearch(true);
            } else {
                //失敗しましたモーダル表示
                alert('経路探索を失敗しました');
            }

        } catch (e) {
            console.log('e', e);
        }
        // router.push('/AddRoutePage')//DEBUG
    }
    const onClickBack = () => {
        router.push('/CarMenu');
    }
    const onClickTurtial = () => {

    }
    const onClickRouteRiset = () => {
        setRelayPoint([]);
    }
    const onChangePathOk = () => {

        setPathOk(!pathOk);
    }
    const RouteSave = () => {

    }
    const onClickBackPage = () => {

        setIsAfterRouteSearch(false);
    }


    const afterButtons = (
        <>
            <CheckBoxForm name='junkai' id="junkai" onChange={() => setJunkai(!junkai)}>
                巡回ルート
            </CheckBoxForm>
            <_BaseButton onClick={RouteSave} _class="button">
                保存
            </_BaseButton>
            <_BaseButton onClick={onClickRouteSearch} _class="button">
                経路探索
            </_BaseButton>
            <_BaseButton onClick={onClickBackPage} _class="button">
                目的地選択に戻る
            </_BaseButton>
        </>
    );
    const beforeButtons = (
        <>
            <_BaseButton onClick={onClickRouteSearch} _class="button">
                経路探索
            </_BaseButton>
            <_BaseButton onClick={onClickBack} _class="button">
                戻る
            </_BaseButton>
            <_BaseButton onClick={onClickTurtial} _class="button">
                チュートリアルを開く
            </_BaseButton>
            <_BaseButton onClick={onClickRouteRiset} _class="button">
                目的地リセット
            </_BaseButton>
            <CheckBoxForm name="junkai" id="junkai" onChange={() => setJunkai(!junkai)}>
                巡回ルート
            </CheckBoxForm>
            <CheckBoxForm name="pathOk" id="pathOk" onChange={onChangePathOk}>
                通行可能領域表示
            </CheckBoxForm>

        </>
    );

    return (
        <>
            {
                isAfterRouteSearch ? afterButtons : beforeButtons
            }
            <DynamicMapNoSSR
                setRelayPoint={setRelayPoint}
                circle={viewCircle}
                relayPoint={relayPoint}
                poly={poly}
                setPoly={setPoly}
            />
        </>
    );


}
export default Desitination;