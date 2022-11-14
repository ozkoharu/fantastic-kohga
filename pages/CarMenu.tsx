import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";

import _BaseButton from "../component/atoms/button/_BaseButton";
import { CheckBoxForm } from "../component/atoms/checkbox/checkBoxForm";
import { UserIdContext } from "./_app";

const CarMenu: NextPage = () => {
    const router = useRouter();
    const { userId } = useContext(UserIdContext);
    const onClickDesitination = () => {
        router.push('/Desitination');
    }
    const onClickExistsRoute = () => {

    }
    const onClickCarWatch = () => {

    }
    const onClickEndPage = () => {
        router.push('/EndPage');
    }
    const onClickJunkai = () => {

    }
    console.log('CarMenu_userId', userId);
    return (
        <>
            <_BaseButton onClick={onClickDesitination} _class="button">
                新規ルート作成
            </_BaseButton>
            <_BaseButton onClick={onClickExistsRoute} _class="button">
                既存ルート選択
            </_BaseButton>
            <_BaseButton onClick={onClickCarWatch} _class="button">
                車を見る
            </_BaseButton>
            <_BaseButton onClick={onClickEndPage} _class="button">
                終わり
            </_BaseButton>

        </>
    )
}
export default CarMenu;