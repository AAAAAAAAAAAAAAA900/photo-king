
// user context using this tutorial: https://blog.logrocket.com/react-context-tutorial/

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import WebsocketService from "../utilities/WebsocketService";

const UserContext = createContext(null);
let externalSetUser = null; // to clear user outside react components

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    externalSetUser = setUser;
    const websocketServiceRef = useRef(WebsocketService);

    const updateUser = useCallback((update) => {
        setUser(update);
    }, []);

    // For websocket subscription
    const incommingUserUpdateCallback = useCallback((update) => {
        const updateObj = JSON.parse(update.body);
        setUser((prevUser) => {
            const updatedUser = { ...prevUser };
            for (const property in updateObj) {
                updatedUser[property] = updateObj[property];
            }
            return updatedUser;
        });
    }, []);
    const context = useMemo(() => ({ user, updateUser }), [user, updateUser]);

    useEffect(() => {
        // if user is logged in, connect to websocket
        if (user && !websocketServiceRef.current.isConnected) {
            (async () => {
                await websocketServiceRef.current.connect();
                websocketServiceRef.current.subscribe("/topic/update/" + user.id, incommingUserUpdateCallback);
            })();
        }

        // is user is logged out, disconnect websocket
        if (!user && websocketServiceRef.current) {
            websocketServiceRef.current.disconnect();
        }

        // clean on unmount
        return () => {
            if (websocketServiceRef.current) {
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

export const clearUser = () => {
    if (externalSetUser)
        externalSetUser(null);
}

export const useUser = () => useContext(UserContext);