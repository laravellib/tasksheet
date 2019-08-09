//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useState } from 'react'
import styled from 'styled-components'

import { SheetActiveUpdates, SheetColumn, SheetColumns, SheetColumnUpdates } from '@app/state/sheet/types'

import SheetHeader from '@app/bundles/Sheet/SheetHeader'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetHeaders = ({
  columns,
  handleContextMenu,
  sheetVisibleColumns,
  updateSheetActive,
  updateSheetColumn
}: SheetHeadersProps) => {

  const [ isResizing, setIsResizing ] = useState(false)
  const handleResizeEnd = (columnId: SheetColumn['id'], columnWidthChange: number) => {
    const column = columns[columnId]
    updateSheetColumn(columnId, { width: column.width + columnWidthChange })
  }

  return (
    <Container>
      {sheetVisibleColumns.map((columnId: string, index: number) => (
        <SheetHeader
          key={columnId}
          column={columns[columnId]}
          handleContextMenu={handleContextMenu}
          isLast={index === sheetVisibleColumns.length - 1}
          isResizing={isResizing}
          onResizeStart={() => setIsResizing(true)}
          onResizeEnd={(columnWidthChange: number) => handleResizeEnd(columnId, columnWidthChange)}
          updateSheetActive={updateSheetActive}
          updateSheetColumn={updateSheetColumn}/>))}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetHeadersProps {
  columns: SheetColumns
  handleContextMenu(e: MouseEvent, type: string, id: string): void
  sheetVisibleColumns: SheetColumn['id'][]
  updateSheetActive(updates: SheetActiveUpdates): void
  updateSheetColumn(columnId: string, updates: SheetColumnUpdates): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`  
  z-index: 1000;
  position: sticky;
  top: 0;
  left: 0;
  height: 3.5vh;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetHeaders
