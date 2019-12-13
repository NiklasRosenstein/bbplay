import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    background-color: rgb(48, 64, 75);
    height: ${(props: { hasFooter: boolean }) => (props.hasFooter ? 'calc(100% - 60px)' : '100%')};
    width: 100%;
    overflow: auto;
    padding: 1rem;
`
export default ({ children, hasFooter }: { children: React.ReactNode; hasFooter?: boolean }) => (
    <Container hasFooter={hasFooter || false}>{children}</Container>
)
