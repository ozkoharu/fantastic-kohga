import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { UserIdContext } from "./_app";

const CarWatch: NextPage = () => {
    const router = useRouter();
    const { userId, setUserId } = useContext(UserIdContext);

    return (
        <>
            <h1>車を見るページ</h1>
        </>
    )
}
export default CarWatch;