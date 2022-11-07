import { NextPage } from "next";
import { useRouter } from "next/router";
import _BaseButton from "../component/atoms/button/_BaseButton";

const CreateUserUrl = 'http://saza.kohga.local:3001/createuser';

const WelcomePage: NextPage = () => {
    const router = useRouter();
    const onClickCarUse = async () => {
        try {
            const res = await fetch(CreateUserUrl);
            if (res.status === 200 || (await res.json()).succeeded) {
                const id = (await res.json()).data.userId;
                console.log('userId', id);
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
            <_BaseButton onClick={onClickCarUse} _class='button'>
                車をつかう
            </_BaseButton>
            <_BaseButton _class="button">
                車管理
            </_BaseButton>
        </>
    )
}
export default WelcomePage;