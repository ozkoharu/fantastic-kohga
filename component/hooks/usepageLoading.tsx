import React, { createContext, useContext } from "react";
import { Grid } from "react-loader-spinner";
import { LoadingContext } from "../../pages/_app";

export type usePageLoadingType = {
    isShow: boolean;
    setLoading: (value: boolean) => void;
}

export type PageLoadingType = {
    isShow: boolean;
    show: () => void;
    close: () => void;
}

export const usePageLoading = (): PageLoadingType => {
    const { isShow, setLoading } = useContext(LoadingContext);

    const show = () => {
        setLoading(true);
    }
    const close = () => {
        setLoading(false);
    }
    return { isShow, show, close };
}