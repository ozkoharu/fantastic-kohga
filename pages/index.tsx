import { NextPage } from "next";
import { useRouter } from "next/router";
import { createContext, useState } from "react";
import _BaseButton from "../component/atoms/button/_BaseButton";

const CreateUserUrl = 'http://saza.kohga.local:3001/createuser';
export const UserIdContext = createContext({} as {
    userId: string
    setUserId: React.Dispatch<React.SetStateAction<string>>
})

const WelcomePage: NextPage = () => {
    const router = useRouter();
    const [userId, setUserId] = useState<string>('')
    const onClickCarUse = async () => {
        router.push('/CarMenu'); //DEBUG
        try {
            const res = await fetch(CreateUserUrl);
            const data = await res.json();
            if (res.status === 200 && data.succeeded) {
                const id = data.userId;
                console.log('userId', id);
                setUserId(id);
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
            <UserIdContext.Provider value={{ userId, setUserId }}>
                <_BaseButton onClick={onClickCarUse} _class='button'>
                    車をつかう
                </_BaseButton>
                <_BaseButton _class="button">
                    車管理
                </_BaseButton>
            </UserIdContext.Provider>
        </>
    )
}
export default WelcomePage;