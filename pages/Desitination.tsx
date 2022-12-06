import { useRouter } from "next/router";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useState, SetStateAction, useContext, useEffect } from "react";
import _BaseButton from "../component/atoms/button/_BaseButton";
import { circle, LatLng } from "leaflet";
import { CheckBoxForm } from "../component/atoms/checkbox/checkBoxForm";
import { LoadingContext, UserIdContext } from "./_app";
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
interface postRouteSave {
    userId: string,
    routeName: string,
    data: LatLng[][],
    junkai: boolean,
}
interface reqRouteSave {
    succeeded: boolean,
    routeName?: string,
}
const PostAstarUrl = 'http://saza.kohga.local:3001/astar';
const PostOkRouteUrl = 'http://saza.kohga.local:3001/reqPassable';
const PostRoutingUrl = 'http://saza.kohga.local:3001/execRoute';
const PostRouteSaveUrl = 'http://saza.kohga.local:3001/saveRoute';

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
    const [middleFlag, setMiddleFlag] = useState<number>(-1);
    const { isShow, setLoading } = useContext(LoadingContext);
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

    }, []);

    useEffect(() => {
        document.getElementById('beforepathOk')?.click();
    }, [])

    const allButtons = (disabled: boolean) => {
        if (isAfterRouteSearch) {
            (document.getElementById('saveButton') as HTMLButtonElement).disabled = disabled;
            (document.getElementById('backButton') as HTMLButtonElement).disabled = disabled;
            (document.getElementById('routingButton') as HTMLButtonElement).disabled = disabled;
            (document.getElementById('junkai') as HTMLInputElement).disabled = disabled;

            const middlebutton = document.getElementById('middleButton');
            if (middlebutton !== null) {
                (middlebutton as HTMLButtonElement).disabled = disabled;
            }
        } else {
            (document.getElementById('beforeRouteSearch') as HTMLButtonElement).disabled = disabled;
            (document.getElementById('beforeTurtial') as HTMLButtonElement).disabled = disabled;
            (document.getElementById('beforeReset') as HTMLButtonElement).disabled = disabled;
            (document.getElementById('beforeBack') as HTMLButtonElement).disabled = disabled;
            (document.getElementById('beforejunkai') as HTMLInputElement).disabled = disabled;
        }

    }

    const onClickRouteSearch = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (relayPoint.length === 0) {
            modal.setContent(
                <>
                    <p>少なとも一つの目的地を選択してください</p>
                </>
            )
            modal.open();
            return;
        }
        allButtons(true);

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
            setLoading(true);
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
            allButtons(false);
            setLoading(false);
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
                setLoading(true);
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
        setLoading(false);
        setViewCircle(passableinfo);
    }

    const AsyncModal = (valueGenerator: (r: (arg0: any) => void) => React.SetStateAction<React.ReactNode>) => new Promise<any>((r) => {
        modal.setContent(valueGenerator(r));
        modal.setModalHander(() => {
            modal.close();
            r(false);
        });
        modal.open();
    })

    const RouteSave = async () => {
        const pathname = await (async () => {
            while (1) {
                const pathname = await AsyncModal((r) =>
                    <>
                        <p>経路名を入力してください</p>
                        <div>
                            <input type="text" id="pathname" required />
                            <button onClick={() => {
                                r((document.getElementById('pathname') as HTMLInputElement).value);
                                modal.close();
                            }}>OK</button>
                        </div>

                    </>
                );
                if (pathname === false) return false;
                if (pathname === '') continue;
                const issave = await AsyncModal((r) =>
                    <>
                        <p>{pathname}</p>
                        <p>これで保存していいですか</p>
                        <button onClick={() => {
                            modal.close();
                            r(true);
                        }}>OK</button>
                    </>
                );
                if (issave) return pathname;
            }
        })();
        console.log('pathname', pathname);
        if (pathname === false) return;
        const PostRouteSave: postRouteSave = {
            userId: userId,
            routeName: pathname,
            data: poly,
            junkai: junkai,
        };

        try {
            const res = await fetch(PostRouteSaveUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(PostRouteSave)
            });
            const result = await res.json() as reqRouteSave;
            if (result.succeeded) {
                modal.setContent(
                    <>
                        <p>{result.routeName}</p>
                        <p>保存できました</p>
                    </>
                )
                modal.open();
            } else {
                modal.setContent(
                    <>
                        <p>経路が保存できませんでした<br />経路を選び直しもう一度経路探索してください</p>
                    </>
                )
                modal.open();
            }
        } catch {
            modal.setContent(
                <>
                    <p>通信エラー</p>
                </>
            )
        }
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
        console.log(PostRoutingData);
        const target = e.currentTarget;
        target.disabled = true;
        try {

            const res = await fetch(PostRoutingUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(PostRoutingData)
            });
            const result = await res.json() as resRouting;
            if (result.succeeded) {
                router.push('/CarWatch');
            } else {
                console.log('result.message', result.message);
                modal.setContent(
                    <>
                        <p>失敗しました</p>
                    </>
                )
            }
            console.log('result.succeeded', result.succeeded);
        } catch (e) {
            modal.setContent(
                <>
                    <h1>通信エラー</h1>
                </>
            )
        } finally {
            target.disabled = false;
        }
    }
    const onClickMiddlePoint = async () => {
        allButtons(true);
        console.log('relayPoint', relayPoint);
        const { headTrue } = relayPoint.reduce((prev, cur) => {
            if (prev.ishead && cur.Relay) {
                prev.headTrue.push(cur);
            } else {
                prev.ishead = false;
            }
            return prev;
        }, { ishead: true, headTrue: [] as relayPoint[] });
        relayPoint.splice(0, headTrue.length);
        relayPoint.push(...headTrue);
        await onClickRouteSearch(null as unknown as React.MouseEvent<HTMLButtonElement>);
        allButtons(false);
        setMiddleFlag(-1);
    }


    const afterButtons = (
        <>
            {
                middleFlag === -1 ? null : <_BaseButton onClick={onClickMiddlePoint} _class="button" id="middleButton">中継点確定</_BaseButton>
            }
            <_BaseButton onClick={RouteSave} _class="button dest-btn" id="saveButton">
                保存
            </_BaseButton>
            <_BaseButton onClick={routing} _class="button dest-btn" id="routingButton">
                この経路で車を動かす
            </_BaseButton>
            <_BaseButton onClick={onClickBackPage} _class="button dest-btn" id="backButton">
                目的地選択に戻る
            </_BaseButton>
            <CheckBoxForm name="junkai" id="junkai" onChange={onClickJunkai} disabled={true}>
                巡回ルート
            </CheckBoxForm>
            <CheckBoxForm name="pathOk" id="pathOk" onChange={onChangePathOk}>
                通行可能領域表示
            </CheckBoxForm>
        </>
    );
    const beforeButtons = (
        <>
            <_BaseButton onClick={onClickRouteSearch} _class="button dest-btn" id="beforeRouteSearch">
                経路探索
            </_BaseButton>
            <_BaseButton onClick={onClickTurtial} _class="button tutorial-btn" id="beforeTurtial">
                チュートリアルを開く
            </_BaseButton>
            <_BaseButton onClick={onClickRouteReset} _class="button dest-btn" id="beforeReset">
                目的地リセット
            </_BaseButton>
            <_BaseButton onClick={onClickBack} _class="button map-exit-btn" id="beforeBack">
                戻る
            </_BaseButton>
            <CheckBoxForm name="beforejunkai" id="beforejunkai" onChange={onClickJunkai} >
                巡回ルート
            </CheckBoxForm>
            <CheckBoxForm name="beforepathOk" id="beforepathOk" onChange={onChangePathOk}>
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
            <div className="map">
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
            </div>
        </>
    );
}
export default Desitination;