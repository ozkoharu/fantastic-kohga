import '../styles/global.css';
import '../styles/modal.css';
import "leaflet/dist/leaflet.css";
import type { AppProps } from 'next/app';
import { createContext, useState } from 'react';


export const UserIdContext = createContext({} as {
  userId: string
  setUserId: React.Dispatch<React.SetStateAction<string>>
})

function MyApp({ Component, pageProps }: AppProps) {
  const [userId, setUserId] = useState<string>('');
  return (
    <>
      <UserIdContext.Provider value={{ userId, setUserId }}>
        <Component {...pageProps} />
      </UserIdContext.Provider>
    </>
  )

}
export default MyApp
