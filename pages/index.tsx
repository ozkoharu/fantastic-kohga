import { NextPage } from "next";
import { useRouter } from "next/router";

const CreateUserUrl = 'http://saza.kohga.local:3001/createuser';

const WelcomePage = () => {
    const router = useRouter();
    const onClickCarUse = async () => {
        try {
            const res = await fetch(CreateUserUrl);
            if (res.status === 200 || (await res.json()).succeeded) {
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
            <button onClick={onClickCarUse}>車をつかう</button>
            <button>車管理</button>
        </>
    )
}
export default WelcomePage;