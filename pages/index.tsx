import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import _BaseButton from "../component/atoms/button/_BaseButton";
import { useModal } from "../component/hooks/useModal";
import { UserIdContext } from "./_app";

const CreateUserUrl = 'http://saza.kohga.local:3001/createuser';

const WelcomePage: NextPage = () => {
    const router = useRouter();
    const [isopen, setIsOpne] = useState(true);
    const { userId, setUserId } = useContext(UserIdContext);
    const modalRef = useRef<HTMLUListElement>(null);
    const modal = useModal();


    const onClickCarUse = async () => {
        //router.push('/CarMenu'); //DEBUG
        try {
            const res = await fetch(CreateUserUrl);
            const data = await res.json();
            if (res.status === 200 && data.succeeded) {
                const id = data.userId;
                setUserId(id);

                console.log('userId', userId);

                router.push('/CarMenu');
            } else {
                alert('ユーザーIDとれなかったよ')
            }
        } catch (e) {
            console.log('e', e);
        }
    }
    return (
        <>
            {
                modal.content(
                    <>
                        <p>モーダル</p>
                        <button onClick={() => modal.close()}>閉じる</button>
                    </>
                )
            }
            <UserIdContext.Provider value={{ userId: 'ababaaba', setUserId: setUserId }}>

                <_BaseButton onClick={onClickCarUse} _class='button'>
                    車をつかう
                </_BaseButton>
                <_BaseButton _class="button" onClick={() => modal.open()}>
                    車管理
                </_BaseButton>
            </UserIdContext.Provider>
        </>
    )
}
export default WelcomePage;