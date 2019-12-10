import React, { useContext } from 'react'
import { Button } from '@blueprintjs/core'
import logo from '../assets/bushbash-logo.png'
import api from '../service/apiService'
import { AuthContext } from '../App'
import styled from 'styled-components'

const NavbarContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    width: 100vw;
    background-color: rgb(40, 45, 51);
    border-bottom: 1px solid white;
`

const Branding = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    img {
        height: 40px;
    }
`

const Controls = styled.div`
    margin-right: 1rem;
`

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useContext(AuthContext)!

    const logout = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        await api.auth.logout()
        setIsAuthenticated(false)
    }
    return (
        <NavbarContainer>
            <Branding>
                <img src={logo} alt='logo' />
                <span>bbplay</span>
            </Branding>
            <Controls>{isAuthenticated && <Button text='Logout' onClick={logout} />}</Controls>
        </NavbarContainer>
    )
}
export default Navbar
