import React from "react";

interface Props {
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    _class?: string
}

const _BaseButton: React.FC<Props> = ({
    children,
    onClick,
    _class
}) => {
    return (
        <button onClick={onClick} className={_class} >
            {children}
        </button>
    )
}
export default _BaseButton;