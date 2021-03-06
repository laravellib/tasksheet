//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'
import { v4 as createUuid } from 'uuid'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import {
  ISheet,
  ISheetCell,
  ISheetRow, ISheetRowToDatabase
} from '@/state/sheet/types'

import { 
  setAllSheetCells,
  setAllSheetRows,
  updateSheet
} from '@/state/sheet/actions'
import { createHistoryStep } from '@/state/history/actions'

import { defaultCell, defaultRow } from '@/state/sheet/defaults'

import { resolveSheetRowLeaders } from '@/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Create Sheet Row
//-----------------------------------------------------------------------------
export const createSheetRows = (
  sheetId: string, 
  numberOfRowsToAdd: number, 
  insertAtRowId: ISheetRow['id'], 
  aboveOrBelow: 'ABOVE' | 'BELOW' = 'ABOVE'
): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    
    const {
      allSheets,
      allSheetColumns,
      allSheetCells,
      allSheetRows,
      allSheetViews
    } = getState().sheet

    // Get sheet
    const sheet = allSheets[sheetId]
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]
    const nextAllSheetCells = { ...allSheetCells }
    const nextAllSheetRows = { ...allSheetRows }
    const nextSheetRows = [ ...sheet.rows ] 
    const nextSheetVisibleRows = [ ...sheet.visibleRows ]
    const newRowsToDatabase: ISheetRowToDatabase[] = []
    const newRowIds: ISheetRow['id'][] = []
    const newCellIds: ISheetCell['id'][] = []
    
    // Get any open sheets this is a source sheet for
    const childSheets: ISheet['id'][] = []
    Object.keys(allSheets).forEach(currentSheetId => {
      const currentSheet = allSheets[currentSheetId]
      if(currentSheetId !== sheetId 
         && currentSheet.sourceSheetId !== null
         && [ sheet.id, sheet.sourceSheetId ].includes(currentSheet.sourceSheetId)
      ){ 
        childSheets.push(currentSheetId)
      }
    })

    // Get the index to insert the rows at
    const insertAtRowIdVisibleRowsIndex = nextSheetVisibleRows.indexOf(insertAtRowId) > -1 
      ? nextSheetVisibleRows.indexOf(insertAtRowId) 
      : 0

    // Get the correct sheetId for the new rows
    const newRowSheetId = sheet.sourceSheetId !== null ? sheet.sourceSheetId : sheetId
    
    // Get the unique column values for the group the row belongs to
    let columnCellValues: { [columnId: string]: Set<string> } = {}
    let columnsWithUniqueValue: { [columnId: string]: string } = {}
    activeSheetView.visibleColumns.forEach(columnId => {
      columnCellValues[columnId] = new Set() as Set<string>
    })
    let groupStartFlag = false
    let groupEndFlag = false
    let groupStartIndex = insertAtRowIdVisibleRowsIndex
    let groupEndIndex = insertAtRowIdVisibleRowsIndex
    while (!groupStartFlag) { // Loop back through visible rows until we get the index for the row break that starts the group
      if(sheet.visibleRows[groupStartIndex] === 'ROW_BREAK' || groupStartIndex === 0) {
        groupStartFlag = true
      }
      else {
        groupStartIndex--
      }
    }
    while (!groupEndFlag) { // Loop forward through visible rows until we get the index for the row break that ends the group
      if(sheet.visibleRows[groupEndIndex] === 'ROW_BREAK' || groupEndIndex > sheet.visibleRows.length - 1) {
        groupEndFlag = true
      }
      else {
        groupEndIndex++
      }
    }
    if(groupEndIndex - groupStartIndex > 2) { // Prevent unique values from being inserted if there is only one row in the group
      for(let i = groupStartIndex; i <= groupEndIndex; i++) { // Loop through each of the group rows and add the cell values to the columnCellValues
        const currentRowId = sheet.visibleRows[i]
        if(currentRowId !== 'ROW_BREAK') {
          const currentRow = allSheetRows[currentRowId]
          activeSheetView.visibleColumns.forEach(columnId => {
            if(columnId !== 'COLUMN_BREAK') {
              const currentCell = allSheetCells[currentRow.cells[columnId]]
              columnCellValues[columnId].add(currentCell.value)
            }
          })
        }
      }
      Object.keys(columnCellValues).forEach(columnId => { // Find the columns with a unique value
        const currentColumn = allSheetColumns[columnId]
        const currentColumnValues =  columnCellValues[columnId]
        if(currentColumnValues.size === 1 && !['FILES', 'PHOTOS'].includes(currentColumn.cellType)) {
          columnsWithUniqueValue[columnId] = columnCellValues[columnId].values().next().value
        }
      })
    }
    
    // Create the rows
    for(let i = 0; i < numberOfRowsToAdd; i++) {
      const newRow = defaultRow(newRowSheetId, createUuid(), sheet.columns)
      const newRowCellsToDatabase: ISheetCell[] = []
      Object.keys(newRow.cells).forEach((columnId: string) => {
        const cellId = newRow.cells[columnId]
        const column = allSheetColumns[columnId]
        const columnDefaultValue = column.defaultValue || columnsWithUniqueValue[columnId] || (column.cellType === 'BOOLEAN' ? 'Unchecked' : null)
        const newCell = defaultCell(sheetId, newRow.id, columnId, cellId, columnDefaultValue)
        nextAllSheetCells[cellId] = newCell
        newRowCellsToDatabase.push(newCell)
        newCellIds.push(newCell.id)
      })
      nextAllSheetRows[newRow.id] = newRow
      nextSheetRows.push(newRow.id)
      const rowIndexModifier = aboveOrBelow === 'ABOVE' ? i : i + 1
      nextSheetVisibleRows.splice(insertAtRowIdVisibleRowsIndex + rowIndexModifier, 0, newRow.id)
      const newRowToDatabase = {
        ...newRow,
        cells: newRowCellsToDatabase
      }
      newRowsToDatabase.push(newRowToDatabase)
      newRowIds.push(newRow.id)
    }
    
    // Get the next row leaders
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)

    // Actions
    const actions = (isHistoryStep: boolean = false) => {
      batch(() => {
        dispatch(setAllSheetCells(nextAllSheetCells))
        dispatch(setAllSheetRows(nextAllSheetRows))
        dispatch(updateSheet(sheetId, {
          visibleRowLeaders: nextSheetRowLeaders,
          rows: nextSheetRows,
          visibleRows: nextSheetVisibleRows,
          selections: sheet.selections
        }, true))
        sheet.sourceSheetId && dispatch(updateSheet(sheet.sourceSheetId, {
          rows: nextSheetRows
        }, true))
        childSheets && childSheets.forEach(childSheetId => {
          dispatch(updateSheet(childSheetId, {
            rows: nextSheetRows
          }, true))
        })
      })
      if(!isHistoryStep) {
        mutation.createSheetRows(newRowsToDatabase)
      }
      else {
        mutation.restoreSheetRows(newRowIds, newCellIds)
      }
    }

    // Undo actions
    const undoActions = () => {
      batch(() => {
        dispatch(setAllSheetRows(allSheetRows))
        dispatch(setAllSheetCells(allSheetCells))
        dispatch(updateSheet(sheetId, {
          visibleRowLeaders: sheet.visibleRowLeaders,
          rows: sheet.rows,
          visibleRows: sheet.visibleRows,
          selections: sheet.selections
        }, true))
        sheet.sourceSheetId && dispatch(updateSheet(sheet.sourceSheetId, {
          rows: sheet.rows
        }, true))
        childSheets && childSheets.forEach(childSheetId => {
          dispatch(updateSheet(childSheetId, {
            rows: sheet.rows
          }, true))
        })
      })
      mutation.deleteSheetRows(newRowIds)
    }

    // Create the history step
    dispatch(createHistoryStep({ actions, undoActions }))

    // Call the actions
    actions()
	}
}