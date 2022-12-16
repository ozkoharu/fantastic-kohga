import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import _BaseButton from "component/atoms/button/_BaseButton";
import { useModal } from "component/hooks/useModal";
import { AdminIdContext } from "pages/_app";

const EndAdminUrl = 'http://sazasub.kohga.local/terminateAdmin';

interface ReqEndAdmin {
    adminId: string
}
interface ResEndAdmin {
    succeeded: boolean
}

const CarManager: NextPage = () => {
    const router = useRouter();
    const modal = useModal();
    const { adminId } = useContext(AdminIdContext);
    //adminIdを持ってるかどうかでページの表示を切り替えてください
    //戻を押した時にadmin終了POST
    const patOkManager = () => {
        router.push('/PathOkManager');
    }
    const AllCarWatch = () => {
        router.push('/AllCarWatch');
    }

    const EndAdminData = {
        adminId: adminId
    }
    const EndAdmin = async () => {
        try {
            const res = await fetch(EndAdminUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(EndAdminData)
            });
            const result = await res.json();
            if (result.succeeded) {
                router.push('/');
            } else {
                modal.setContent(
                    <>
                        <p>もう一度ボタンを押してください</p>
                    </>
                );
                modal.open();
            }
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
            <h1>管理ページ</h1>
            <_BaseButton onClick={patOkManager}>
                通行可能領域管理
            </_BaseButton>
            <_BaseButton onClick={AllCarWatch}>
                車一覧
            </_BaseButton>
            <_BaseButton onClick={EndAdmin}>
                管理者終了
            </_BaseButton>
        </>
    )
}
export default CarManager;
