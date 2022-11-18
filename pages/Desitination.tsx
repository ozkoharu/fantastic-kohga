import { useRouter } from "next/router";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useState, SetStateAction, useContext, useEffect } from "react";
import _BaseButton from "../component/atoms/button/_BaseButton";
import { circle, LatLng } from "leaflet";
import { CheckBoxForm } from "../component/atoms/checkbox/checkBoxForm";
import { UserIdContext } from "./_app";
import { useModal } from "../component/hooks/useModal";



interface Props {
    event: React.Dispatch<SetStateAction<number>>
}
export type LatLangRadius = {
    position: LatLng;
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

interface Request {
    userId: string
}
interface LatLangRadiusID extends LatLangRadius {
    passableId: number
}
interface Response {
    succeeded: boolean,
    passableInfo?: LatLangRadiusID[]
}
interface PostRoute {
    userId: string,
    data: LatLng[]
}
interface PostRouteResponse {
    succeeded: boolean,
    route: LatLng[]
}
interface PostRouting {
    userId: string,
    data: LatLng[][],
    junkai: boolean
}
interface resRouting {
    succeeded: boolean,
    message?: string,
}
const PostAstarUrl = 'http://saza.kohga.local:3001/astar';
const PostOkRouteUrl = 'http://saza.kohga.local:3001/reqPassable';
const PostRoutingUrl = 'http://saza.kohga.local:3001/execRoute';

export const DynamicMapNoSSR = dynamic(() => {
    return (
        import('../component/map/DestinationMap')
    )
},
    { ssr: false }
)
const Desitination: NextPage = () => {

    const { userId } = useContext(UserIdContext);
    const modal = useModal();
    console.log('userId', userId);
    const [relayPoint, setRelayPoint] = useState<relayPoint[]>([]);
    const [viewCircle, setViewCircle] = useState<LatLangRadius[]>([]);
    const [poly, setPoly] = useState<LatLng[][]>([[]]);
    const [junkai, setJunkai] = useState<boolean>(false);
    const [isAfterRouteSearch, setIsAfterRouteSearch] = useState<boolean>(false);
    const [isRouting, setIsRouting] = useState<boolean>(false);
    const [middleFlag, setMiddleFlag] = useState<number>(-1);
    const router = useRouter();
    const PostUserId: Request = {
        userId: userId
    }

    useEffect(() => {
        console.log('userId', userId);
        if (userId === '') {
            modal.setModalHander(() => router.push('/'));
            modal.setContent(
                <>
                    <h1>チートは辞めてください</h1>
                </>
            )
            modal.open();
        }

    }, [])
    const allButtons = (disabled: boolean) => {
        (document.getElementById('saveButton') as HTMLButtonElement).disabled = disabled;
        (document.getElementById('backButton') as HTMLButtonElement).disabled = disabled;
        (document.getElementById('routingButton') as HTMLButtonElement).disabled = disabled;
        (document.getElementById('junkai') as HTMLInputElement).disabled = disabled;
        const middlebutton = document.getElementById('middleButton');
        if (middlebutton !== null) {
            (middlebutton as HTMLButtonElement).disabled = disabled;
        }
    }

    const onClickRouteSearch = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (relayPoint.length === 0) return;
        const target = e ? e.currentTarget : null;
        target && (target.disabled = true);

        const internalRelayPoint = relayPoint.map((e) => e);
        if (junkai) {
            internalRelayPoint.push(relayPoint[0]);
        }
        const points = [[(internalRelayPoint.shift() as relayPoint).Point]];
        const temp: LatLng[] = [];
        for (const elem of internalRelayPoint) {
            if (temp.length === 0) {
                temp.push(points.at(-1)?.at(-1) as LatLng);
            }
            temp.push(elem.Point);
            if (!elem.Relay) {
                points.push(temp.map(e => e));
                temp.length = 0;
            }
        }
        void points.shift();
        console.log('points', points);

        const promises: Promise<globalThis.Response>[] = [];
        for (const elem of points) {
            const PostRouteData: PostRoute = {
                userId: userId,
                data: elem
            };
            const resPromise = fetch(PostAstarUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(PostRouteData)
            });
            promises.push(resPromise);
        }
        try {
            const results = await Promise.all(promises);
            const prepoly: LatLng[][] = [];
            for (const elem of results) {
                const result: PostRouteResponse = await elem.json();
                if (result.succeeded === true) {
                    prepoly.push(result.route);
                } else {
                    throw new Error('経路探索に失敗しました');
                }
            }
            console.log('prepoly', prepoly);
            setPoly(prepoly);
            setIsAfterRouteSearch(true);
        } catch (e) {
            modal.setContent(
                <>
                    <h1>経路探索に失敗しました</h1>
                </>
            )
            modal.open();
            console.log(e);
        } finally {
            target && (target.disabled = false);
        }
    }
    const onClickBack = () => {
        router.push('/CarMenu');
    }
    const onClickTurtial = () => {

    }
    const onClickRouteReset = () => {
        setRelayPoint([]);
        setPoly([]);
    }
    const onChangePathOk = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.currentTarget.checked;
        const passableinfo = [];
        if (checked) {
            try {
                const res = await fetch(PostOkRouteUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(PostUserId)
                });
                const result = await res.json() as Response;
                console.log('result', result);
                if (result.succeeded) {
                    for (const elem of result.passableInfo || []) {
                        passableinfo.push(elem);
                    }
                } else {
                    modal.setContent(
                        <>
                            <h1>失敗しました</h1>
                        </>
                    )
                }
            } catch (e) {
                modal.setContent(
                    <>
                        <h1>通信エラー</h1>
                    </>
                )
                console.log(e);
            }
        }
        setViewCircle(passableinfo);
    }
    const RouteSave = () => {

    }
    const onClickBackPage = () => {
        setPoly([]);
        setRelayPoint(relayPoint.reduce((previous, current) => {
            if (!current.Relay) {
                previous.push(current);
            }
            return previous;
        }, [] as relayPoint[]))
        setIsAfterRouteSearch(false);
    }
    const onClickJunkai = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJunkai(e.currentTarget.checked);
    }
    const routing = async (e: React.MouseEvent<HTMLButtonElement>) => {
        //ボタンが押されて経路情報が入っていたらPOST
        const PostRoutingData: PostRouting = {
            userId: userId,
            data: poly,
            junkai: junkai,
        }
        const target = e.currentTarget;
        target.disabled = true;
        try {
            if (poly !== undefined) {
                const res = await fetch(PostRoutingUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(PostRoutingData)
                });
                const result = await res.json() as resRouting;
                console.log('result.message', result.message);
                console.log('result.succeeded', result.succeeded);
                setIsRouting(result.succeeded);
            } else {
                modal.setContent(
                    <>
                        <h1>経路を入力してください</h1>
                    </>
                );
            }

        } catch (e) {
            modal.setContent(
                <>
                    <h1>通信エラー</h1>
                </>
            )
        } finally {
            if (isRouting) router.push('/CarWatch');
            target.disabled = false;
        }
    }
    const onClickMiddlePoint = async () => {
        allButtons(true);
        console.log('relayPoint', relayPoint);
        await onClickRouteSearch(null as unknown as React.MouseEvent<HTMLButtonElement>);
        allButtons(false);
        setMiddleFlag(-1);
    }


    const afterButtons = (
        <>
            {
                middleFlag === -1 ? null : <_BaseButton onClick={onClickMiddlePoint} _class="button" id="middleButton">中継点確定</_BaseButton>
            }
            <_BaseButton onClick={RouteSave} _class="button" id="saveButton">
                保存
            </_BaseButton>
            <_BaseButton onClick={onClickBackPage} _class="button" id="backButton">
                目的地選択に戻る
            </_BaseButton>
            <_BaseButton onClick={routing} _class="button" id="routingButton">
                この経路で車を動かす
            </_BaseButton>
            <CheckBoxForm name='junkai' id="junkai" onChange={() => setJunkai(!junkai)}>
                巡回ルート
            </CheckBoxForm>
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
            <_BaseButton onClick={onClickRouteReset} _class="button">
                目的地リセット
            </_BaseButton>
            <CheckBoxForm name="junkai" id="junkai" onChange={onClickJunkai}>
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
            {
                modal.show()
            }
            <DynamicMapNoSSR
                setRelayPoint={setRelayPoint}
                circle={viewCircle}
                relayPoint={relayPoint}
                poly={poly}
                setPoly={setPoly}
                isAfterRouteSearch={isAfterRouteSearch}
                onClickRouteSearch={onClickRouteSearch}
                modal={modal}
                allButtons={allButtons}
                middleFlag={middleFlag}
                setMiddleFlag={setMiddleFlag}
            />
        </>
    );


}
export default Desitination;