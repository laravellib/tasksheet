//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@app/state'
import { 
  ISheetCell, 
  ISheetColumnType,
  ISheetNote
} from '@app/state/sheet/types'

import SheetCellAutosizeTextarea from '@app/bundles/Sheet/SheetCellAutosizeTextarea'
import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCellNotes = ({
  cellId,
  isCellSelected,
  updateCellValue,
  value,
  ...passThroughProps
}: ISheetCellNotesProps) => {

  const autosizeTextarea = useRef(null)
  const [ localIsCellEditing, setLocalIsCellEditing ] = useState(false)
  
  useEffect(() => {
    if(localIsCellEditing) {
      const autosizeTextareaLength = autosizeTextarea.current.value && autosizeTextarea.current.value.length || 0
      autosizeTextarea.current.focus()
      autosizeTextarea.current.setSelectionRange(autosizeTextareaLength,autosizeTextareaLength)
    }
  }, [ localIsCellEditing ])
  
  const sheetCellNotes = useSelector((state: IAppState) => state.sheet.allSheetCellNotes[cellId] && state.sheet.allSheetCellNotes[cellId].map((sheetNoteId: ISheetNote['id']) => {
    return state.sheet.allSheetNotes[sheetNoteId]
  }))
  
  const handleCellEditingStart = () => {
    setLocalIsCellEditing(true)
  }
  
  const handleCellEditingEnd = () => {
    setLocalIsCellEditing(false)
  }

  const handleCurrentNoteValueChange = (nextCellValue: string) => {
    updateCellValue(nextCellValue)
  }

  return (
    <SheetCellContainer
      testId="SheetCellNotes"
      cellId={cellId}
      focusCell={() => handleCellEditingStart()}
      isCellSelected={isCellSelected}
      onCloseCell={() => handleCellEditingEnd()}
      onlyRenderChildren
      updateCellValue={updateCellValue}
      value={value}
      {...passThroughProps}>
      <CurrentNoteContainer>
        {localIsCellEditing
          ? <SheetCellAutosizeTextarea
              ref={autosizeTextarea}
              onChange={(e: any) => handleCurrentNoteValueChange(e.target.value)}
              value={value}/>
          : <CurrentNote>
              {value}
            </CurrentNote>
        }
      </CurrentNoteContainer>
      {sheetCellNotes && sheetCellNotes.length >1 &&
        <NotesContainer>
          Notes
        </NotesContainer>
      }
    </SheetCellContainer>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetCellNotesProps {
  sheetId: string
  cell: ISheetCell
  cellId: string
  columnType: ISheetColumnType
  isCellSelected: boolean
  updateCellValue(nextCellValue: string): void
  value: string
}

const CurrentNoteContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0.15rem 0.25rem;
`

const CurrentNote = styled.div`
`

const NotesContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 100%;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  background-color: rgb(245, 245, 245);
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellNotes
