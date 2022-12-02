import { LatLng } from "leaflet";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useModal } from "../component/hooks/useModal";
import { UserIdContext } from "./_app";
import _BaseButton from "../component/atoms/button/_BaseButton";
import e from "express";

interface ReqMonitorCarData {
    userId: string
}
interface ResMonitorCarData {
    succeeded: boolean,
    route: LatLng[][],
    dest?: LatLng[],
    arrival?: boolean,
    finish?: boolean,
    nowPoint?: LatLng,
    battery?: number,
    status?: boolean,
}
interface ReqProceedRouteData {
    userId: string,
}
interface ResProceedRouteData {
    succeeded: boolean,
}
interface ReqEndRoute {
    userId: string
}
interface ResEndRoute {
    succeeded: boolean
}


export const DynamicCarWatchMap = dynamic(() => {
    return (
        import('../component/map/CarWatchMap')
    )
},
    { ssr: false }
)

const CarWatchUrl = 'http://saza.kohga.local:3001/monitorCar';
const NextUrl = 'http://saza.kohga.local:3001/proceedRoute';
const endRouteUrl = 'http://saza.kohga.local:3001/endRoute';

const CarWatch: NextPage = () => {
    const router = useRouter();
    const modal = useModal();
    const { userId, setUserId } = useContext(UserIdContext);
    const [poly, setPoly] = useState<LatLng[][]>([]);
    const [dest, setDest] = useState<LatLng[]>([]);
    const [battery, setBattery] = useState<number>(0);
    const [timerId, setTimerId] = useState<NodeJS.Timeout>();


    const AsyncModal = (valueGenerator: (r: (arg0: any) => void) => React.SetStateAction<React.ReactNode>) => new Promise<any>((r) => {
        modal.setContent(valueGenerator(r));
        modal.setModalHander(() => {
            modal.close();
            r(false);
        });
        modal.open();
    })

    useEffect(() => {
        firstPost();
    }, []);


    const Data: ReqMonitorCarData = {
        userId: userId
    };

    const firstPost = async () => {
        try {
            const res = await fetch(CarWatchUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(Data)
            });
            const result = await res.json() as ResMonitorCarData;
            if (result.succeeded) {
                if (result.route !== undefined) setPoly(result.route);
                if (result.dest !== undefined) setDest(result.dest);
                if (result.battery !== undefined) setBattery(result.battery);
                console.log('result route', result.route);
                console.log('result dest', result.dest);
                console.log('result battery', result.battery);
                console.log('result arrival', result.arrival);
                console.log('result finish', result.finish);
                console.log('result',)
                if (result.status) {
                    modal.setContent(
                        <>
                            <p>車が死にました</p>
                        </>
                    )
                    modal.open();
                    return;
                }
            } else {
                modal.setContent(
                    <>
                        <p>firstpost失敗</p>
                    </>
                )
                modal.open();
            }
        } catch (e) { } finally {
            console.log('settimeout');
            setTimerId(setTimeout(firstPost, 1000));
        }
    }

    const onClickNextRoute = async () => {
        const NextRouteData: ReqProceedRouteData = {
            userId: userId
        }
        console.log('onClickNextRoutetimerId', timerId);
        clearTimeout(timerId);
        const target = (document.getElementById('nextButton') as HTMLButtonElement);
        target.disabled = true;
        const isok = await AsyncModal((r) =>
            <>
                <p>車両を次の目的地へ進めますか？</p>
                <div>
                    <button onClick={() => {
                        modal.close();
                        r(true);
                    }}>OK</button>
                </div>
            </>
        );

        try {
            if (isok) {
                const res = await fetch(NextUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(NextRouteData)
                });
                const result = await res.json() as ResProceedRouteData;
                console.log('result', result);
                if (result.succeeded) {
                    modal.setContent(
                        <>
                            <p>次の目的地に進みました</p>
                        </>
                    )
                    modal.open();
                }
            }
        } catch (e) {
            modal.setContent(
                <>
                    <p>通信エラー</p>
                </>
            );
            modal.open();
        } finally {
            target.disabled = false;
            firstPost();
        }
    }
    const syousai = async () => {
        console.log('syousaitimerId', timerId);
        clearTimeout(timerId);
        await AsyncModal((r) =>
            <>
                <p>バッテリー{battery === undefined ? '------' : String(battery)}%{battery < 30 ? 'バッテリーやべーよ' : ''}</p>
                <p>経路進捗33333%</p>
            </>
        );
        firstPost();
    }
    const CarEnd = async () => {
        clearTimeout(timerId);
        console.log('carendtimerId', timerId);
        const endisOk = await AsyncModal((r) =>
            <>
                <p>車を使うのを本当にやめますか？</p>
                <button onClick={() => {
                    modal.close();
                    r(true);
                }}>OK</button>
            </>
        );
        if (!endisOk) {
            firstPost();
            return;
        }
        try {
            const EndPostData: ReqEndRoute = {
                userId: userId
            }
            const res = await fetch(endRouteUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(EndPostData)
            });
            const result = await res.json() as ResEndRoute;
            if (result.succeeded) {
                clearTimeout(timerId); //ここ動いてる？
                router.push('/CarMenu');
                return;
            } else {
                modal.setContent(
                    <>
                        <p>失敗</p>
                    </>
                );
                modal.open();
            }
        } catch (e) {
            modal.setContent(
                <>
                    <p>通信エラー</p>
                </>
            )
        } finally {
            firstPost();
        }

    }

    const onClickCarMenu = () => {
        clearTimeout(timerId);
        router.push('/CarMenu');
    }

    return (
        <>
            {
                modal.show()
            }
            <_BaseButton onClick={onClickNextRoute} id="nextButton">
                次の目的地に行く
            </_BaseButton>
            <_BaseButton onClick={syousai} id="statusButton">
                詳細
            </_BaseButton>
            <_BaseButton onClick={CarEnd} id="stopCarButton">
                車を使うのを止める
            </_BaseButton>
            <_BaseButton onClick={onClickCarMenu}>
                車メニューに戻る
            </_BaseButton>
            <DynamicCarWatchMap poly={poly} dest={dest} />
        </>
    );
}
export default CarWatch;