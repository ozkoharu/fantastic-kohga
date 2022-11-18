import React from "react";

interface Props {
    name?: string;
    id?: string;
    onChange?: (e: any) => void;
    children?: React.ReactNode;
    disabled?: boolean
}

export const CheckBoxForm: React.FC<Props> = ({
    name,
    id,
    onChange,
    children,
    disabled,
}) => {
    return (
        <>
            <input type={"checkbox"} onChange={onChange} id={id} name={name} disabled={disabled} />
            <label htmlFor={id}>{children}</label>
        </>
    )
}