import React from 'react'
import styled from "styled-components"

const SvgDefsWrapper = styled.svg`
    visibility: hidden;
    position: absolute;
    width: 0px;
    height: 0px;
    display: none;
`

export default function SvgDefs() {
    return (
        <SvgDefsWrapper width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">
            <defs>
                <filter id="hexRoundingSM">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                    <feComposite in="SourceGraphic" in2="hexRoundingSM" operator="atop" />
                </filter>
                <filter id="hexRoundingMD">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                    <feComposite in="SourceGraphic" in2="hexRoundingMD" operator="atop" />
                </filter>
                <filter id="hexRoundingLG">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                    <feComposite in="SourceGraphic" in2="hexRoundingLG" operator="atop" />
                </filter>
            </defs>
        </SvgDefsWrapper>
    )
}