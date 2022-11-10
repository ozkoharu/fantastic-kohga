import React from "react";

interface Props {
    name?: string;
    id?: string;
    onChange?: (e: any) => void;
    children?: React.ReactNode;
}

export const CheckBoxForm: React.FC<Props> = ({
    name,
    id,
    onChange,
    children,
}) => {
    return (
        <>
            <input type={"checkbox"} onChange={onChange} id={id} name={name} />
            <label htmlFor={id}>{children}</label>
        </>
    )
}