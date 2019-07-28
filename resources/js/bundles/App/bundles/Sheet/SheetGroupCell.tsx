//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo } from 'react'
import { areEqual } from 'react-window'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetGroupCell = memo(({
  style
}: SheetGroupCellProps) => (
    <Container style={style}/>
), areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetGroupCellProps {
  style: {}
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  cursor: default;
  padding: 0.15rem 0.25rem;
  font-size: 0.9rem;
  user-select: none;
  background-color: rgb(170, 170, 170);
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetGroupCell
