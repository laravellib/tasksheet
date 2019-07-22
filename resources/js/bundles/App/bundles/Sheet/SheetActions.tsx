//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { Columns } from '@app/state/sheet/types'

import SheetActionSort from '@app/bundles/Sheet/SheetActionSort'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActions = ({
  columns,
  sheetActionsHeight
}: SheetActionsProps) => {
  return (
    <Container
      sheetActionsHeight={sheetActionsHeight}>
      <SheetActionSort
        columns={columns}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionsProps {
  columns: Columns
  sheetActionsHeight: number
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 10;
  width: 100%;
  position: sticky;
  top: 0;
  height: ${ ({ sheetActionsHeight }: ContainerProps) => (sheetActionsHeight * 100) + 'vh'};
  padding: 0 0.125rem;
  display: flex;
  align-items: center;
  background-color: rgb(250, 250, 250);
  border-bottom: 1px solid rgb(180, 180, 180);
`
interface ContainerProps {
  sheetActionsHeight: number
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActions
