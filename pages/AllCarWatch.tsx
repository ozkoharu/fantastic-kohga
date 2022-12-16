import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import _BaseButton from "component/atoms/button/_BaseButton";
import { useModal } from "component/hooks/useModal";
import { AdminIdContext } from "pages/_app";

const getCarInfoUrl = 'http://sazasub.kohga.local/getCarInfo';

const AllCarWatch: NextPage = () => {
    const modal = useModal();
    const router = useRouter();
    const { adminId } = useContext(AdminIdContext);

    const onClickBack = () => {
        router.push('/CarManager');
    }
    const getCarInfo = async () => {
        try {
            const res = await fetch(getCarInfoUrl);
            const result = await res.json();
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
    return (
        <>
            {
                modal.show()
            }
            <h1>くるな一覧</h1>
            <_BaseButton onClick={onClickBack}>
                戻る
            </_BaseButton>
            <_BaseButton onClick={getCarInfo}>
                ひょうじ
            </_BaseButton>
        </>
    )
}
export default AllCarWatch;
