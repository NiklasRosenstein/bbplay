import { authInstance } from "./axiosInstances"
import { AxiosResponse } from "axios"

export interface User {
    username: string
}

export const login = (username: string, password: string): Promise<AxiosResponse<{ token: string }>> => authInstance.post("/auth", { username, password })

export const logout = () => authInstance.delete("/auth")

export const me = (): Promise<AxiosResponse<User>> => authInstance.get('/auth')