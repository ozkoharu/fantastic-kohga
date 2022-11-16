import React, { Children, useRef, useState } from "react";

export const useModal = () => {
    const [isShow, setShow] = useState<boolean>(false);
    const [content, setContent] = useState<React.ReactNode>(<></>);


    const open = () => {
        setShow(true);
    }
    const close = () => {
        setShow(false);
    }

    const modalHandler = useRef<() => void>(() => close());
    const setModalHander = (f: () => void) => modalHandler.current = f;

    const show = () => {
        return (
            isShow ?
                <div className="modalContainer" onClick={() => modalHandler.current()}>
                    <div className="modalBody">
                        {content}
                        <div>
                            <button onClick={() => modalHandler.current()}>閉じる</button>
                        </div>
                    </div>
                </div>
                :
                null
        );
    }
    return { isShow, open, close, show, setContent, setModalHander };
}