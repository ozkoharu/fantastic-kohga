import React, { Children, useState } from "react";

export const useModal = (init: boolean = false) => {
    const [isShow, setShow] = useState<boolean>(init);
    const [content, setContent] = useState<React.ReactNode>(<></>);

    const open = () => {
        setShow(true);
    }
    const close = () => {
        setShow(false);
    }

    const show = () => {
        return (
            isShow ?
                <div className="modalContainer" onClick={() => close()}>
                    <div className="modalBody">
                        {content}
                    </div>
                </div>
                :
                null
        );
    }
    return { isShow, open, close, show, setContent };
}