import { NextPage } from "next";
import { useRouter } from "next/router";
import _BaseButton from "../component/atoms/button/_BaseButton";

const CarMenu: NextPage = () => {
    const router = useRouter();
    const onClickDestination = () => {

    }
    const onClickExistsRoute = () => {

    }
    const onClickCarWatch = () => {

    }
    const onClickEndPage = () => {

    }
    return (
        <>
            <_BaseButton onClick={onClickDestination} _class="button">
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