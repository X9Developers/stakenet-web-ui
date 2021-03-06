import React from 'react'
import styled from 'styled-components'

export const CardBodyWrapper = styled.div`
  position: relative;
  max-width: 1200px;
  width: 100%;
  background: ${({ theme }) => `linear-gradient(to right, ${theme.bg4} , ${theme.bg3});`};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 5px;
  min-height: 700px;
  /* padding: 1rem; */
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function CardBody({ children }: { children: React.ReactNode }) {
  return <CardBodyWrapper>{children}</CardBodyWrapper>
}
