import { Router } from "express";
import { NextPage } from "next";
import { useRouter } from "next/router";
import _BaseButton from "../component/atoms/button/_BaseButton";

const CarManager = () => {
    const router = useRouter();

    const patOkManager = () => {
        router.push('/PathOkManager');
    }
    const AllCarWatch = () => {
        router.push('/AllCarWatch');
    }

    return (
        <>
            <h1>管理ページ</h1>
            <_BaseButton onClick={patOkManager}>
                通行可能領域管理
            </_BaseButton>
            <_BaseButton onClick={AllCarWatch}>
                車一覧
            </_BaseButton>
        </>
    )
}
export default CarManager;