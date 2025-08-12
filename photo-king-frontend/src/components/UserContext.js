
// user context using this tutorial: https://blog.logrocket.com/react-context-tutorial/

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import WebsocketService from "../services/WebsocketService";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const websocketServiceRef = useRef(WebsocketService);

    const updateUser = useCallback((update) => {
        setUser(update);
    }, []);

    const context = useMemo(() => ({ user, updateUser }), [user, updateUser]);

    useEffect(() => {
        // if user is logged in, connect to websocket
        if (user && !websocketServiceRef.current.isConnected) {
            (async () => {
                await websocketServiceRef.current.connect();
                websocketServiceRef.current.subscribe("/topic/update/" + user.id, updateUser);
            })();
        }

        // is user is logged out, disconnect websocket
        if (!user && websocketServiceRef.current.isConnected) {
            websocketServiceRef.current.disconnect();
        }

        // clean on unmount
        return () => {
            if (websocketServiceRef.current.isConnected) {
                websocketServiceRef.current.disconnect();
            }
        }
    }, [!!user]);

    return (
        <UserContext.Provider value={context}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);