//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { ISheet, IAllSheetColumns, SheetFilter, SheetFilterUpdates } from '@app/state/sheet/types'

import SheetActionDropdownSelectedOption from '@app/bundles/Sheet/SheetActionDropdownSelectedOption'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionFilterExistingFilter = ({
  sheetId,
  columns,
  deleteSheetFilter,
  filter,
  updateSheetFilter
}: SheetActionFilterExistingFilterProps) => {
    
    return (
      <SheetActionDropdownSelectedOption
        isLocked={filter.isLocked}
        onOptionUpdate={(updates) => updateSheetFilter(sheetId, filter.id, updates)}
        onOptionDelete={() => deleteSheetFilter(filter.id)}>
        <Container>
          {columns[filter.columnId].name} {filter.type} {filter.value}
        </Container>
      </SheetActionDropdownSelectedOption>
    )
  }

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionFilterExistingFilterProps {
  columns: IAllSheetColumns
  deleteSheetFilter(filterId: SheetFilter['id']): void
  updateSheetFilter(sheetId: ISheet['id'], filterId: SheetFilter['id'], updates: SheetFilterUpdates): void
  filter: SheetFilter
  sheetId: ISheet['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: flex;
  align-items: center;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionFilterExistingFilter