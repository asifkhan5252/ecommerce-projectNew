// Make sure this is in a file like AuthContext.js
// import { json } from "body-parser";
import { useState, useContext, createContext, useEffect } from "react";

const authContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: "",
    });
    useEffect(() => {
        const data=localStorage.getItem('auth')
        if(data){
            const parsedata=JSON.parse(data)
            setAuth({
                ...auth,
                user:parsedata.user,
                token:parsedata.token,
            })
        }
     
    }, [])
    

    return (
        <authContext.Provider value={[auth, setAuth]}>
            {children}
        </authContext.Provider>
    );
};

export const useAuth = () => useContext(authContext);

// export { useAuth, AuthProvider };
