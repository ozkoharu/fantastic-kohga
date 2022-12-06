import '../styles/styles.scss';
import "leaflet/dist/leaflet.css";
import type { AppProps } from 'next/app';
import React, { createContext, useState } from 'react';
import { usePageLoadingType } from '../component/hooks/usepageLoading';
import { PageLoading } from '../component/atoms/pageLoading';


export const UserIdContext = createContext({} as {
  userId: string
  setUserId: React.Dispatch<React.SetStateAction<string>>
});
export const AdminIdContext = createContext({} as {
  adminId: string,
  setAdminId: React.Dispatch<React.SetStateAction<string>>
});
export const LoadingContext = createContext<usePageLoadingType>({} as usePageLoadingType);

function MyApp({ Component, pageProps }: AppProps) {
  const [userId, setUserId] = useState<string>('');
  const [adminId, setAdminId] = useState<string>('');
  const [isShow, setLoading] = useState<boolean>(false);
  return (
    <>
      <UserIdContext.Provider value={{ userId, setUserId }}>
        <AdminIdContext.Provider value={{ adminId, setAdminId }}>
          <LoadingContext.Provider value={{ isShow, setLoading }}>
            <PageLoading isShow={isShow} />
            <Component {...pageProps} />
          </LoadingContext.Provider>
        </AdminIdContext.Provider>
      </UserIdContext.Provider>
    </>
  )

}
export default MyApp
