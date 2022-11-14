import React, { Children, useState } from "react";

export const useModal = () => {
    const [isShow, setShow] = useState<boolean>(true);

    const open = () => {
        setShow(true);
    }
    const close = () => {
        setShow(false);
    }

    const content = (children: React.ReactNode) => {
        return (
            isShow ?
                <div className="modalContainer">
                    <div className="modalBody">
                        {children}
                    </div>
                </div>
                :
                null
        );
    }
    return { isShow, open, close, content };
}