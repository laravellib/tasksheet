//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@app/state'
import { ISheet } from '@app/state/sheet/types'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCellStyleButton = ({
  sheetId,
  icon,
  sheetStylesSet,
  updateSheetStylesSet
}: SheetActionCellStyleButtonProps) => {
  
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)
  const allSheetRows = useSelector((state: IAppState) => state.sheet.allSheetRows)
  const selections = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections)

  const sheetActiveSheetViewId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].activeSheetViewId)
  const sheetViewVisibleColumns = useSelector((state: IAppState) => state.sheet.allSheetViews && state.sheet.allSheetViews[sheetActiveSheetViewId] && state.sheet.allSheetViews[sheetActiveSheetViewId].visibleColumns)
  const sheetViewVisibleRows = useSelector((state: IAppState) => state.sheet.allSheetViews && state.sheet.allSheetViews[sheetActiveSheetViewId] && state.sheet.allSheetViews[sheetActiveSheetViewId].visibleRows)
  
  const addOrDeleteFromSet = sheetStylesSet && sheetStylesSet.has(selections.rangeStartCellId) ? 'DELETE' : 'ADD'

  const handleContainerClick = () => {
    const {
      rangeStartCellId,
      rangeStartColumnId,
      rangeStartRowId,
      rangeEndCellId,
      rangeEndColumnId,
      rangeEndRowId,
    } = selections

    // Range
    if(rangeEndCellId) {
      const rangeStartColumnIndex = sheetViewVisibleColumns.findIndex(visibleColumnId => visibleColumnId === rangeStartColumnId)
      const rangeStartRowIndex = sheetViewVisibleRows.findIndex(visibleRowId => visibleRowId === rangeStartRowId)
      const rangeEndColumnIndex = sheetViewVisibleColumns.findIndex(visibleColumnId => visibleColumnId === rangeEndColumnId)
      const rangeEndRowIndex = sheetViewVisibleRows.findIndex(visibleRowId => visibleRowId === rangeEndRowId)
      const nextSheetStylesSet = new Set([ ...sheetStylesSet ])

      for(let rowIndex = rangeStartRowIndex; rowIndex <= rangeEndRowIndex; rowIndex++) {
        const rowId = sheetViewVisibleRows[rowIndex]
        if(rowId !== 'ROW_BREAK') {
          const row = allSheetRows[rowId]
          for(let columnIndex = rangeStartColumnIndex; columnIndex <= rangeEndColumnIndex; columnIndex++) {
            const columnId = sheetViewVisibleColumns[columnIndex]
            if(columnId !== 'COLUMN_BREAK') {
              const cellId = row.cells[columnId]
              addOrDeleteFromSet === 'ADD' ? nextSheetStylesSet.add(cellId) : nextSheetStylesSet.delete(cellId)
            }
          }
        }
      }
      updateSheetStylesSet(nextSheetStylesSet)
    }
    // Cell
    else if(rangeStartCellId) {
      const nextSheetStylesSet = new Set([ ...sheetStylesSet ])
      addOrDeleteFromSet === 'ADD' ? nextSheetStylesSet.add(rangeStartCellId) : nextSheetStylesSet.delete(rangeStartCellId)
      updateSheetStylesSet(nextSheetStylesSet)
    }
  }

  return (
    <Container
      containerBackgroundColor={userColorPrimary}
      onClick={handleContainerClick}>
      <Icon 
        icon={icon}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionCellStyleButtonProps {
  sheetId: ISheet['id']
  icon: string
  sheetStylesSet: Set<string>
  updateSheetStylesSet(nextSheetStylesSet: Set<string>): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  margin-right: 0.375rem;
  cursor: pointer;  
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(210, 210, 210);
  color: rgb(80, 80, 80);
  text-decoration: none;
  border-radius: 3px;
  padding: 0.4rem;
  transition: all 0.05s;
  &:hover {
    background-color: ${ ({ containerBackgroundColor }: IContainer) => containerBackgroundColor};
    color: rgb(240, 240, 240);
  }
`
interface IContainer {
  containerBackgroundColor: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCellStyleButton
