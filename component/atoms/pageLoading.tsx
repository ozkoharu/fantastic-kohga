import React from "react";
import { Grid } from "react-loader-spinner";

interface Props {
    isShow: boolean;
}

export const PageLoading: React.FC<Props> = ({
    isShow,
}) => {
    return (
        <>
            {
                isShow &&
                <div className='loader'>
                    <Grid />
                    <div className="nowloading">
                        Now Loading...
                    </div>
                </div>
            }
        </>
    )
}