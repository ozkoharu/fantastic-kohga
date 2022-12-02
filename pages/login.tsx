import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { useModal } from "../component/hooks/useModal";
import { AdminIdContext } from "./_app";

interface ReqAdmin {
    adminName: string,
    adminPass: string,
}
interface ResAdmin {
    succeeded: boolean,
    adminId?: string,
}

const AdminUrl = 'http://saza.kohga.local:3001/loginAdmin';

const Login = () => {
    const router = useRouter();
    const modal = useModal();
    const { adminId, setAdminId } = useContext(AdminIdContext);
    const [input, setInput] = useState<string>('');
    const [passwd, setPasswd] = useState<string>('');

    const PostAdminData: ReqAdmin = {
        adminName: input,
        adminPass: passwd,
    }

    const onClickLogin = async () => {
        try {
            const res = await fetch(AdminUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(PostAdminData)
            });
            const result = await res.json() as ResAdmin;
            if (result.succeeded) {
                console.log('result.adminId', result.adminId);
                if (result.adminId !== undefined) {
                    setAdminId(result.adminId);
                }
                console.log('login', adminId);
                router.push('/CarManager');
            } else {
                console.log('失敗');
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
    const onClickCansel = () => {
        router.push('/');
    }

    return (
        <>
            {
                modal.show()
            }
            <h1>ログイン画面</h1>
            <div>
                <label htmlFor="name" id="name">名前</label>
                <input type="text" onChange={(e) => setInput(e.target.value)} name="name" id="name" value={input} />

                <label htmlFor="pass" id="pass">パスワード</label>
                <input type="password" onChange={(e) => setPasswd(e.target.value)} name="pass" id="pass" value={passwd} />
            </div>
            <div>
                <button onClick={onClickLogin}>ログイン</button>
                <button onClick={onClickCansel}>キャンセル</button>
            </div>
            <Link href={'/passwd'}>
                <a>パスワード変更はこちら</a>
            </Link>
        </>
    )
}
export default Login;