import { NextPage } from "next";
import Link from "next/link";

const EndPage: NextPage = () => {

    return (
        <>
            <header>
                <h1>終わり</h1>
            </header>
            <div className="end-page">
                <h2>
                    ご利用ありがとうございました。<br></br>
                    またのご利用をお待ちしております。
                </h2>
                <Link href='/' className="end-btn">TOPへ</Link>
            </div>
        </>
    )
}
export default EndPage;