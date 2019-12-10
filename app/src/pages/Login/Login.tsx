import React, { useState, useContext } from 'react'
import logo from '../../assets/bushbash-logo.png'
import { Button, InputGroup } from '@blueprintjs/core'
import api from '../../service/apiService'
import { authInstance } from '../../service/axiosInstances'
import { AuthContext } from '../../App'
import styled from 'styled-components'
import PageContainer from '../../components/PageContainer'

const InnerContainer = styled.div`
    display: block;
    border: 2px dashed rgb(198, 213, 228);
    height: 100%;
    img {
        display: block;
        margin: auto;
        margin-bottom: 1em;
    }
`

const LoginCard = styled.div`
    max-width: 200px;
    margin: auto;
`

const LoginForm = styled.form`
    input,
    button {
        display: block;
        margin: auto;
        margin-top: 0.2em;
    }
    button {
        width: 100%;
        margin-top: 1em;
        text-align: center;
    }
`
const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [, setIsAuthenticated] = useContext(AuthContext)!

    const login = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const { data } = await api.auth.login(username, password)
            localStorage.setItem('token', data.token)
            authInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
            setIsAuthenticated(true)
        } catch (e) {
            console.error(e)
        }
    }

    const handleChange = (setState: React.Dispatch<React.SetStateAction<string>>) => (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setState(e.target.value)
    }
    return (
        <PageContainer>
            <InnerContainer>
                <LoginCard className='login-screen-inner2'>
                    <img src={logo} alt='logo' />
                    <LoginForm className='login-form' onSubmit={login}>
                        <InputGroup
                            small
                            placeholder='Username'
                            value={username}
                            autoFocus
                            onChange={handleChange(setUsername)}
                        />
                        <InputGroup
                            type='password'
                            small
                            placeholder='Password'
                            value={password}
                            onChange={handleChange(setPassword)}
                        />
                        <Button text='Login' type='submit' className='bp3-intent-primary' />
                    </LoginForm>
                </LoginCard>
            </InnerContainer>
        </PageContainer>
    )
}

export default Login
