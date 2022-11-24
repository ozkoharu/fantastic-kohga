import { NextPage } from "next";
import { useRouter } from "next/router";
import _BaseButton from "../component/atoms/button/_BaseButton";

const AllCarWatch = () => {
    const router = useRouter();
    const onClickBack = () => {
        router.push('/CarManager');
    }
    return (
        <>
            <h1>くるな一覧</h1>
            <_BaseButton onClick={onClickBack}>
                戻る
            </_BaseButton>
        </>
    )
}
export default AllCarWatch;