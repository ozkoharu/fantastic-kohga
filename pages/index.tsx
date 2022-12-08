import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import _BaseButton from "../component/atoms/button/_BaseButton";
import { useModal } from "../component/hooks/useModal";
import { UserIdContext } from "./_app";
const CreateUserUrl = 'http://sazasub.kohga.local/createUser';


const WelcomePage: NextPage = () => {
    const router = useRouter();
    const { userId, setUserId } = useContext(UserIdContext);
    const modal = useModal();


    const onClickCarUse = async (e: React.MouseEvent<HTMLButtonElement>) => {
        //router.push('/CarMenu'); //DEBUG
        const target = e.currentTarget;
        target.disabled = true;

        //await new Promise((r) => setTimeout(() => r(0), 10000));
        try {
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

                <_BaseButton onClick={onClickCarUse} _class='button' id="use">
                    車をつかう
                </_BaseButton>
                <_BaseButton _class="button" onClick={onClickCarManager} id="kanri">
                    車管理
                </_BaseButton>
            </UserIdContext.Provider>
        </>
    )
}
export default WelcomePage;