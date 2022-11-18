import React from "react";

interface Props {
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    _class?: string
    id?: string
}

const _BaseButton: React.FC<Props> = ({
    children,
    onClick,
    _class,
    id,
}) => {
    return (
        <button onClick={onClick} className={_class} id={id}>
            {children}
        </button>
    )
}
export default _BaseButton;