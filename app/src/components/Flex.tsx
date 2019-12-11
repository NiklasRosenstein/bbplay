import React from 'react'
import styled from 'styled-components'

export interface FlexProps {
    direction?: 'column' | 'row'
    justify?: 'center' | 'flex-start' | 'flex-end' | 'space-evenly' | 'space-around' | 'space-between'
    align?: 'center' | 'flex-start' | 'flex-end' | 'space-evenly' | 'space-around' | 'space-between'
    fluid?: boolean
    style?: object
    wrap?: boolean
    children?: React.ReactNode | React.ReactNode[]
    className?: string
}

const StyledFlex = styled.div`
    display: flex;
    width: ${(props: FlexProps) => (props.fluid ? '100%' : '')};
    height: ${(props: FlexProps) => (props.fluid ? '100%' : '')};
    flex-direction: ${(props: FlexProps) => props.direction || 'row'};
    align-items: ${(props: FlexProps) => props.align || 'flex-start'};
    justify-content: ${(props: FlexProps) => props.justify || 'flex-start'};
    flex-wrap: ${(props: FlexProps) => (props.wrap ? 'wrap' : '')};
`

const Flex = ({ wrap, direction, justify, children, fluid, style, align, className }: FlexProps) => (
    <StyledFlex
        className={className}
        align={align}
        wrap={wrap}
        direction={direction}
        justify={justify}
        style={style}
        fluid={fluid}
    >
        {children}
    </StyledFlex>
)

export default Flex
