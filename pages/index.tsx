import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import _BaseButton from "../component/atoms/button/_BaseButton";
import { useModal } from "../component/hooks/useModal";
import { LoadingContext, UserIdContext } from "./_app";
import mv_path from '../assets/movies/backmovie.mp4';
const CreateUserUrl = 'http://saza.kohga.local:3001/createUser';

export const MV = () => {
    const removePoster = () => {
        const mv = document.querySelector('video');
        mv?.classList.remove('bg-img');
    };
    return (
        <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="bg-img"
            onCanPlay={removePoster}>
            <source
                src={mv_path}
                type="video/mp4"
            />
            <p>このブラウザは動画の再生に対応していません</p>
        </video >
    )
}


const WelcomePage: NextPage = () => {
    const router = useRouter();
    const { userId, setUserId } = useContext(UserIdContext);
    const { isShow, setLoading } = useContext(LoadingContext);
    const modal = useModal();


    const onClickCarUse = async (e: React.MouseEvent<HTMLButtonElement>) => {
        //router.push('/CarMenu'); //DEBUG
        const target = e.currentTarget;
        target.disabled = true;

        //await new Promise((r) => setTimeout(() => r(0), 10000));
        try {
            setLoading(true);
            const res = await fetch(CreateUserUrl);
            const data = await res.json();
            if (res.status === 200 && data.succeeded) {
                const id = data.userId;
                setUserId(id);
                console.log('userId', userId);

                router.push('/CarMenu');
            } else {

                modal.setContent(
                    <>
                        <p>ユーザーIDが取れませんでした</p>
                    </>
                )
                modal.open();
            }
        } catch (e) {
            modal.setContent(
                <>
                    <p>通信エラーです</p>
                </>
            )
            modal.open();
            console.log('e', e);
        } finally {
            target.disabled = false;
            setLoading(false);
        }
    }
    const onClickCarManager = () => {
        router.push('/login');
    }
    return (
        <>
            {
                modal.show()
            }
            <UserIdContext.Provider value={{ userId, setUserId }}>
                <div className="top-page">
                    <MV />
                    <_BaseButton onClick={onClickCarUse} _class='button top-btn' id="use">
                        Start
                    </_BaseButton>
                    <_BaseButton _class="go-manage" onClick={onClickCarManager} id="kanri">
                        車管理
                    </_BaseButton>
                </div>

            </UserIdContext.Provider>
        </>
    )
}
export default WelcomePage;