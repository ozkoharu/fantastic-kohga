import React from "react";

interface Props {
    type?: string;
    name?: string;
    id?: string;
    value?: string;
    onChange: (e: any) => void;
}


const BaseTextForm: React.FC<Props> = ({
    type = 'text',
    name,
    id,
    onChange,
    value = '',

}) => {
    return (
        <input
            type={type}
            onChange={onChange}
            name={name}
            id={id}
            value={value}
        />
    );
}
export default BaseTextForm;