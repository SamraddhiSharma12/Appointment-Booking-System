import { createContext } from "react";
import { doctors } from "../assets/pictures/assets_frontend/assets";

export const AppContext = createContext()
export const AppContextProvider = (props)=>{
    const currencySymbol = '$'
    const value={
        doctors, currencySymbol
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider