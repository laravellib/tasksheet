//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { ISheetCellTypesSharedProps } from '@desktop/Sheet/SheetCell'

import { updateSheetCell } from '@/state/sheet/actions'

import SheetCellContainer from '@desktop/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellBoolean = ({
  sheetId,
  cell
}: ISheetCellTypesSharedProps) => {
  
  const dispatch = useDispatch()
  
  const handleChange = (checked: boolean) => {
    const nextCellValue = checked ? 'Checked' : ''
    dispatch(updateSheetCell(cell.id, { value: nextCellValue }, { value: cell.value }))
  }
  
  return (
    <SheetCellContainer
      testId="SheetCellBoolean"
      sheetId={sheetId}
      cell={cell}
      beginEditing={() => null}
      completeEditing={() => null}
      onlyRenderChildren
      value={cell.value}>
      <Container>
        <StyledInput 
          type="checkbox"
          checked={cell.value === 'Checked'}
          onChange={(e) => handleChange(e.target.checked)}/>
      </Container>
    </SheetCellContainer>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledInput = styled.input`
  margin: auto;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellBoolean