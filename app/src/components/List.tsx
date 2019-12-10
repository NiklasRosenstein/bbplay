import React from 'react'
import styled from 'styled-components'
import { Card, ICardProps } from '@blueprintjs/core'

const StyledListContainer = styled.div`
    height: 100%;
    width: 100%;
    overflow: auto;
    margin-top: 1rem;
`
const ListContainer = ({ children }: { children: React.ReactNode }) => (
    <StyledListContainer>{children}</StyledListContainer>
)

const StyledCard = styled(Card)`
    font-size: 20px;
    margin: 1rem;
`

interface IListCardProps extends ICardProps {
    children: React.ReactNode
}

const ListCard = ({ children, ...props }: IListCardProps) => <StyledCard {...props}>{children}</StyledCard>

export { ListContainer, ListCard }
