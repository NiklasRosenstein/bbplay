import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    background-color: rgb(48, 64, 75);
    height: calc(100% - 60px);
    width: 100%;
    overflow: auto;
    padding: 1rem;
`
export default ({ children }: { children: React.ReactNode }) => <Container>{children}</Container>
