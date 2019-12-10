import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import Routing from './Routing'
import './App.css'
import api from './service/apiService'

export const AuthContext = React.createContext<[boolean, Dispatch<SetStateAction<boolean>>] | undefined>(undefined)

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.auth
            .me()
            .then(res => {
                setIsAuthenticated(res !== undefined)
                setLoading(false)
            })
            .catch(err => {
                setIsAuthenticated(false)
                setLoading(false)
            })
    }, [])
    return loading ? (
        <div>Loading...</div>
    ) : (
        <AuthContext.Provider value={[isAuthenticated, setIsAuthenticated]}>
            <div className='dashboard bp3-dark' id='main'>
                <Routing />
            </div>
        </AuthContext.Provider>
    )
}

export default App
