import { LatLng } from "leaflet";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import _BaseButton from "component/atoms/button/_BaseButton";
import { useModal } from "component/hooks/useModal";
import { DynamicCarWatchMap } from "pages/CarWatch";
import { UserIdContext } from "pages/_app";

interface ReqRouteData {
    userId: string;
    routeName: string;
}
interface ResRouteData {
    succeeded: boolean;
    route?: LatLng[][];
    dest?: LatLng[]
}
interface ReqRouteNameData {
    userId: string;
}
interface PassableNames {
    routeName?: string;
    available?: boolean;
}
interface ResRouteNameData {
    succeeded: boolean;
    passableNames?: PassableNames[];
}
interface ReqPathRoutingData {
    userId: string,
    data: LatLng[][],
    junkai: boolean,
}
interface ResPathRoutingData {
    succeeded: boolean,
    message?: string,
}
const PostReqRouteUrl = 'http://sazasub.kohga.local/reqRoute';
const PostReqRouteNameUrl = 'http://sazasub.kohga.local/routeName';
const PostPathRoutingUrl = 'http://sazasub.kohga.local/execRoute';

const ExistsPage: NextPage = () => {
    const router = useRouter();
    const modal = useModal();
    const { userId, setUserId } = useContext(UserIdContext);
    const [poly, setPoly] = useState<LatLng[][]>([]);
    const [dest, setDest] = useState<LatLng[]>([]);
    const [junkai, setJunkai] = useState<boolean>(false);
    const [onlyRouteName, setOnltRouteName] = useState('');
    const [passbleNameList, setPassbleNameList] = useState<PassableNames[]>([]);
    useEffect(() => {
        FirstPost();
    }, []);

    const FirstPost = async () => {
        const PostRouteNameData: ReqRouteNameData = {
            userId: userId
        }
        try {
            const res = await fetch(PostReqRouteNameUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(PostRouteNameData)
            });
            const result = await res.json() as ResRouteNameData;
            if (result.succeeded) {
                if (result.passableNames !== undefined) setPassbleNameList(result.passableNames);
                console.log('result', result);
                console.log('result.passableNameList', result.passableNames);
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

    const onClickBackCarMenu = () => {
        router.push('/CarMenu');
    }
    const reqRoute = async () => {
        const ReqRouteData: ReqRouteData = {
            userId: userId,
            routeName: onlyRouteName,
        };
        try {
            const res = await fetch(PostReqRouteUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(ReqRouteData)
            });
            const result = await res.json() as ResRouteData;
            if (result.succeeded) {
                console.log('keirohyouji', result);
                if (result.route !== undefined) setPoly(result.route);
                if (result.dest !== undefined) setDest(result.dest);

            } else {
                modal.setContent(
                    <>
                        <p>経路がありません<br />残念でしたー！失敗！！</p>
                    </>
                )
                modal.open();
            }
            console.log('result', result);
        } catch (e) {
            modal.setContent(
                <>
                    <p>通信エラー</p>
                </>
            );
            modal.open();
        }
    }
    const onClickRouting = async () => {
        //経路実行APIをやって
        console.log('routing');
        try {
            const PostData: ReqPathRoutingData = {
                userId: userId,
                data: poly,
                junkai: junkai,
            }
            const res = await fetch(PostPathRoutingUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(PostData)
            });
            const result = await res.json() as ResPathRoutingData;
            console.log('resultPathrouitng', result);
            if (result.succeeded) {
                router.push('/CarWatch');
            } else {
                modal.setContent(
                    <>
                        <p>受理できません<br />しばらくしてからもう一度やり直してください</p>
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

    return (
        <>
            {
                modal.show()
            }
            <_BaseButton onClick={onClickBackCarMenu}>
                車メニューに戻る
            </_BaseButton>
            <select id="sel" name="sel"
                onChange={(e) => {
                    console.log('e.target.value', e.target.value);
                    setOnltRouteName(e.target.value);
                }}
            >
                <option value={""} disabled selected hidden >ルートを選んでください</option>
                {
                    passbleNameList ? passbleNameList.map((routename, index) => <option value={routename.routeName} key={index} disabled={!routename.available}>{routename.routeName}</option>)
                        : null
                }
            </select>
            <_BaseButton onClick={reqRoute}>
                経路表示
            </_BaseButton>
            <_BaseButton onClick={onClickRouting}>
                この経路で車を動かす
            </_BaseButton>
            <DynamicCarWatchMap poly={poly} dest={dest} />
        </>
    )
}
export default ExistsPage;