import { createContext, useEffect, useState } from "react";
//import { doctors } from "../assets/pictures/assets_frontend/assets";

export const AppContext = createContext()
export const AppContextProvider = (props)=>{
     const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const currencySymbol = '$'
     

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') || false)
    const [userData, setUserData] = useState(false)

    const getDoctorsData = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/doctor/list`)
            const data = await response.json()
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                console.log(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const loadUserProfileData = async () => {
        try {
            const response = await fetch('/api/user/get-profile', {
                headers: { token }
            })
            const data = await response.json()
            if (data.success) {
                setUserData(data.userData)
            } else {
                console.log(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getDoctorsData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        } else {
            setUserData(false)
        }
    }, [token])

    const value={
        doctors,getDoctorsData, currencySymbol,
        token, setToken,
        userData, setUserData, loadUserProfileData,
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
    
}
export default AppContextProvider