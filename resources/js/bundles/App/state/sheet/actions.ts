//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'
import { v4 as createUuid } from 'uuid'

import clone from '@/utils/clone'
import { mutation } from '@app/api'

import { AppState } from '@app/state'
import { 
  Sheet, SheetFromServer, SheetUpdates,
  SheetActiveUpdates, 
  SheetCell, SheetCells, SheetCellUpdates,
  SheetColumn, SheetColumns, SheetColumnUpdates,
  SheetRows, SheetRowUpdates, 
  SheetFilter, SheetFilters, SheetFilterUpdates,
  SheetGroup, SheetGroups, SheetGroupUpdates,
  SheetSort, SheetSorts, SheetSortUpdates,
  SheetRow
} from '@app/state/sheet/types'
import { FileType, File as TFile, Folder } from '@app/state/folder/types'
import { ThunkAction, ThunkDispatch } from '@app/state/types'

import { createFile, updateFile, updateFiles, updateFolders } from '@app/state/folder/actions'
import { createHistoryStep } from '@app/state/history/actions'
import { updateTabs } from '@app/state/tab/actions'

import { resolveVisibleRows } from '@app/state/sheet/resolvers'

import { defaultCell, defaultColumn, defaultRow } from '@app/state/sheet/defaults'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type SheetActions = 
  LoadSheet | UpdateSheet | 
  UpdateSheetActive |
  UpdateSheetCell | UpdateSheetCells | 
  UpdateSheetColumn | UpdateSheetColumns | 
  DeleteSheetFilter | UpdateSheetFilter | UpdateSheetFilters |
  DeleteSheetGroup | UpdateSheetGroup | UpdateSheetGroups |
  UpdateSheetRow | UpdateSheetRows | 
  DeleteSheetSort | UpdateSheetSort | UpdateSheetSorts 

//-----------------------------------------------------------------------------
// Create Sheet
//-----------------------------------------------------------------------------
export const createSheet = (folderId: Folder['id']): ThunkAction => {
  return async (dispatch: ThunkDispatch) => {
    const newSheetId = createUuid()
    const newFile: TFile = {
      id: createUuid(),
      folderId: folderId,
      name: null,
      type: 'SHEET',
      typeId: newSheetId,
      isPreventedFromSelecting: true
    }
    dispatch(createFile(folderId, newFile))
    mutation.createSheet(newSheetId).then(() => {
      dispatch(updateFile(newFile.id, { isPreventedFromSelecting: false }, true))
    })
  }
}

//-----------------------------------------------------------------------------
// Create Sheet From Csv
//-----------------------------------------------------------------------------
export const createSheetFromCsv = (folderId: Folder['id'], fileToUpload: File): ThunkAction => {
  return async (dispatch: ThunkDispatch) => {
    const newSheetId = createUuid()
    const newFile: TFile = {
      id: createUuid(),
      folderId: folderId,
      name: fileToUpload.name.split('.').slice(0, -1).join(''), // fileToUpload name without the extension
      type: 'SHEET',
      typeId: newSheetId,
      isPreventedFromSelecting: true
    }
    dispatch(createFile(folderId, newFile))
    mutation.createSheetFromCsv(newSheetId, fileToUpload).then(() => {
      dispatch(updateFile(newFile.id, { isPreventedFromSelecting: false }, true))
    })
  }
}

//-----------------------------------------------------------------------------
// Create Sheet Column
//-----------------------------------------------------------------------------
export const createSheetColumn = (sheetId: Sheet['id'], newColumnVisibleColumnsIndex: number): ThunkAction => {
  return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      sheets,
      cells,
      columns,
      rows
    } = getState().sheet
    const sheet = sheets[sheetId]
    const sheetVisibleColumns = sheet.visibleColumns.length === 0 ? clone(sheet.columns) : clone(sheet.visibleColumns)
    // Create sheet column
    const newColumn = defaultColumn(sheetId, newColumnVisibleColumnsIndex)
    // Update the sheet's visible columns
    const nextSheetVisibleColumns = [
      ...sheetVisibleColumns.slice(0, newColumnVisibleColumnsIndex),
      newColumn.id,
      ...sheetVisibleColumns.slice(newColumnVisibleColumnsIndex)
    ]
    // For each row, add a cell 
    let nextSheetCells: SheetCells = clone(cells)
    let nextSheetRows: SheetRows = clone(rows)
    let newCells: SheetCell[] = []
    sheet.rows.forEach(rowId => {
      const newCell = defaultCell(sheetId, rowId, newColumn.id, createUuid())
      nextSheetCells[newCell.id] = newCell
      nextSheetRows[rowId].cells = { ...nextSheetRows[rowId].cells, [newCell.columnId]: newCell.id }
      newCells.push(newCell)
    })
    // Make the updates
    batch(() => {
      dispatch(updateSheetColumns({
        ...columns,
        [newColumn.id]: newColumn
      }))
      dispatch(updateSheet(sheetId, {
        visibleColumns: nextSheetVisibleColumns
      }))
      dispatch(updateSheetCells(nextSheetCells))
      dispatch(updateSheetRows(nextSheetRows))
    })
    // Save to server
    mutation.createSheetColumn(newColumn, newCells)
  }
}

//-----------------------------------------------------------------------------
// Create Sheet Column Break
//-----------------------------------------------------------------------------
export const createSheetColumnBreak = (sheetId: Sheet['id'], newColumnVisibleColumnsIndex: number): ThunkAction => {
  return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      sheets,
    } = getState().sheet
    const sheet = sheets[sheetId]
    const sheetVisibleColumns = sheet.visibleColumns.length === 0 ? clone(sheet.columns) : clone(sheet.visibleColumns)
    // Update the sheet's visible columns
    const nextSheetVisibleColumns = [
      ...sheetVisibleColumns.slice(0, newColumnVisibleColumnsIndex),
      'COLUMN_BREAK',
      ...sheetVisibleColumns.slice(newColumnVisibleColumnsIndex)
    ]
    // Make the updates
    const sheetUpdates = { visibleColumns: nextSheetVisibleColumns }
    batch(() => {
      dispatch(updateSheet(sheetId, sheetUpdates))
    })
    // Save to server
    mutation.updateSheet(sheetId, sheetUpdates)
  }
}


//-----------------------------------------------------------------------------
// Create Sheet Filter
//-----------------------------------------------------------------------------
export const createSheetFilter = (sheetId: string, newFilter: SheetFilter): ThunkAction => {
  return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      sheets,
      cells,
      filters,
      groups,
      rows,
      sorts
    } = getState().sheet
    const sheet = sheets[sheetId]
    const nextFilters = { ...filters, [newFilter.id]: newFilter }
    const nextSheetFilters = [ ...sheet.filters, newFilter.id ]
    const nextSheetVisibleRows = resolveVisibleRows({ ...sheet, filters: nextSheetFilters }, rows, cells, nextFilters, groups, sorts)
    batch(() => {
      dispatch(updateSheetFilters({ ...filters, [newFilter.id]: newFilter }))
      dispatch(updateSheetReducer(sheetId, {
        filters: nextSheetFilters,
        visibleRows: nextSheetVisibleRows
      }))
    })
    mutation.createSheetFilter(newFilter)
  }
}

//-----------------------------------------------------------------------------
// Create Sheet Group
//-----------------------------------------------------------------------------
export const createSheetGroup = (sheetId: string, newGroup: SheetGroup): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      sheets,
      cells,
      filters,
      groups,
      rows,
      sorts,
    } = getState().sheet
    const sheet = sheets[sheetId]
    const nextGroups = { ...groups, [newGroup.id]: newGroup }
    const nextSheetGroups = [ ...sheet.groups, newGroup.id ]
    const nextSheetVisible = resolveVisibleRows({ ...sheet, groups: nextSheetGroups }, rows, cells, filters, nextGroups, sorts)
    batch(() => {
      dispatch(updateSheetGroups({ ...groups, [newGroup.id]: newGroup }))
      dispatch(updateSheetReducer(sheetId, {
        groups: nextSheetGroups,
        visibleRows: nextSheetVisible
      }))
    })
    mutation.createSheetGroup(newGroup)
	}
}
//-----------------------------------------------------------------------------
// Create Sheet Row
//-----------------------------------------------------------------------------
export const createSheetRow = (sheetId: string, sourceSheetId: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      sheets,
      cells,
      rows,
    } = getState().sheet
    const sheet = sheets[sheetId]
    const newRow = defaultRow(sourceSheetId !== null ? sourceSheetId : sheetId, createUuid(), sheet.columns)
    const nextCells = { ...cells }
    Object.keys(newRow.cells).forEach((columnId: string, index: number) => {
      const cellId = newRow.cells[columnId]
      nextCells[cellId] = defaultCell(sheetId, newRow.id, sheet.columns[index], cellId)
    })
    const nextRows = { ...rows, [newRow.id]: newRow }
    const nextSheetRows = [ ...sheet.rows, newRow.id ]
    const nextSheetVisibleRows = [ newRow.id, ...sheet.visibleRows ]
    batch(() => {
      dispatch(updateSheetRows(nextRows))
      dispatch(updateSheetCells(nextCells))
      dispatch(updateSheetReducer(sheetId, {
        rows: nextSheetRows,
        visibleRows: nextSheetVisibleRows
      }))
    })
    mutation.createSheetRow({
      ...newRow,
      cells: Object.keys(newRow.cells).map(columnId => nextCells[newRow.cells[columnId]])
    })
	}
}

//-----------------------------------------------------------------------------
// Create Sheet Sort
//-----------------------------------------------------------------------------
export const createSheetSort = (sheetId: string, newSort: SheetSort): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      sheets,
      cells,
      filters,
      groups,
      rows,
      sorts,
    } = getState().sheet
    const sheet = sheets[sheetId]
    const nextSorts = { ...sorts, [newSort.id]: newSort }
    const nextSheetSorts = [ ...sheet.sorts, newSort.id ]
    const nextSheetVisibleRows = resolveVisibleRows({ ...sheet, sorts: nextSheetSorts }, rows, cells, filters, groups, nextSorts)
    batch(() => {
      dispatch(updateSheetSorts({ ...sorts, [newSort.id]: newSort }))
      dispatch(updateSheetReducer(sheetId, {
        sorts: nextSheetSorts,
        visibleRows: nextSheetVisibleRows
      }))
    })
    mutation.createSheetSort(newSort)
	}
}


//-----------------------------------------------------------------------------
// Create Sheet View
//-----------------------------------------------------------------------------
export const createSheetView = (sheetId: string, viewName: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      folder: { activeFolderPath, files, folders },
      sheet: { sheets, filters, groups, sorts },
      tab: { tabs }
    } = getState()
    const sourceSheet = sheets[sheetId]
    const fileId = Object.keys(files).find(fileId => files[fileId].typeId === sheetId)
    const folderId = activeFolderPath[activeFolderPath.length - 1]
    const newFileId = createUuid()
    const newSheetViewId = createUuid()
    // Filters
    const newFilters: SheetFilters = {}
    const newSheetViewFilters: SheetFilter['id'][] = []
    sourceSheet.filters.forEach(filterId => {
      const newFilterId = createUuid()
      newFilters[newFilterId] = { ...filters[filterId], id: newFilterId, sheetId: newSheetViewId, isLocked: true }
    })
    // Groups
    const newGroups: SheetGroups = {}
    const newSheetViewGroups: SheetGroup['id'][] = []
    sourceSheet.groups.forEach(groupId => {
      const newGroupId = createUuid()
      newGroups[newGroupId] = { ...groups[groupId], id: newGroupId, sheetId: newSheetViewId, isLocked: true }
    })
    // Sorts
    const newSorts: SheetSorts = {}
    const newSheetViewSorts: SheetSort['id'][] = []
    sourceSheet.sorts.forEach(sortId => {
      const newSortId = createUuid()
      newSorts[newSortId] = { ...sorts[sortId], id: newSortId, sheetId: newSheetViewId, isLocked: true }
    })
  // Update sheets
    dispatch(loadSheetReducer(
      {
        id: newSheetViewId,
        sourceSheetId: sourceSheet.id,
        fileType: sourceSheet.fileType,
        columns: clone(sourceSheet.columns),
        filters: newSheetViewFilters,
        groups: newSheetViewGroups,
        rows: clone(sourceSheet.rows),
        sorts: newSheetViewSorts,
        visibleColumns: clone(sourceSheet.visibleColumns),
        visibleRows: clone(sourceSheet.visibleRows),
      },
      null, // Cells
      null, // Columns
      newFilters, // Filters
      newGroups, // Groups
      null, // Rows
      newSorts, // Sorts
    ))
    // Update folders and files
    const newFile = {
      ...files[fileId],
      id: newFileId,
      folderId: folderId,
      type: 'SHEET_VIEW' as FileType, 
      name: viewName,
      typeId: newSheetViewId
    }
    dispatch(updateFiles({
      ...files,
      [newFileId]: newFile
    }))
    dispatch(updateFolders({
      ...folders,
      [folderId]: {
        ...folders[folderId],
        files: [ ...folders[folderId].files, newFileId ]
      }
    }))
    // Update open tabs
    dispatch(updateTabs([ ...tabs, newFileId]))
    // Create the file on the server
    mutation.createFile(newFile)
    // Create the sheet view on the server
    mutation.createSheetView({
      id: newSheetViewId,
      sourceSheetId: sourceSheet.id,
      visibleColumns: sourceSheet.visibleColumns,
      filters: newFilters,
      groups: newGroups,
      sorts: newSorts
    })
	}
}

//-----------------------------------------------------------------------------
// Delete Sheet Column
//-----------------------------------------------------------------------------
export const deleteSheetColumn = (sheetId: string, columnId: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      sheets,
      cells,
      columns,
      rows,
    } = getState().sheet
    const sheet = sheets[sheetId]
    // Columns
    const { [columnId]: deletedColumn, ...nextColumns } = columns
    // Rows
    const nextRows: SheetRows = clone(rows)
    sheet.rows.forEach(rowId => {
      const { [columnId]: deletedCell, ...nextCells } = nextRows[rowId].cells
      nextRows[rowId].cells = nextCells
    })
    // Cells
    const nextCells: SheetCells = {}
    Object.keys(cells).forEach(cellId => {
      const cell = cells[cellId]
      if(cell.columnId !== columnId) { nextCells[cellId] = cell }
    })
    // Sheet Columns
    const nextSheetColumns = sheet.columns.filter(sheetColumnId => sheetColumnId !== columnId)
    const nextSheetVisibleColumns = sheet.visibleColumns.filter(sheetColumnId => sheetColumnId !== columnId)
    const actions = () => {
      batch(() => {
        dispatch(updateSheetCells(nextCells))
        dispatch(updateSheetColumns(nextColumns))
        dispatch(updateSheetRows(nextRows))
        dispatch(updateSheetReducer(sheetId, {
          columns: nextSheetColumns,
          visibleColumns: nextSheetVisibleColumns
        }))
      })
      mutation.deleteSheetColumn(columnId)
      mutation.updateSheet(sheetId, { visibleColumns: nextSheetVisibleColumns })
    }
    actions()
	}
}

//-----------------------------------------------------------------------------
// Delete Sheet Column Break
//-----------------------------------------------------------------------------
export const deleteSheetColumnBreak = (sheetId: string, columnBreakIndex: number): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      sheets
    } = getState().sheet
    const sheet = sheets[sheetId]
    // Sheet Columns
    const nextSheetVisibleColumns = sheet.visibleColumns.filter((_, index) => index !== columnBreakIndex)
    const actions = () => {
      batch(() => {
        dispatch(updateSheetReducer(sheetId, {
          visibleColumns: nextSheetVisibleColumns
        }))
      })
      mutation.updateSheet(sheetId, { visibleColumns: nextSheetVisibleColumns })
    }
    actions()
	}
}

//-----------------------------------------------------------------------------
// Delete Sheet Filter
//-----------------------------------------------------------------------------
export const DELETE_SHEET_FILTER = 'DELETE_SHEET_FILTER'
interface DeleteSheetFilter {
	type: typeof DELETE_SHEET_FILTER
}

export const deleteSheetFilter = (sheetId: string, filterId: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      sheets,
      cells,
      filters,
      groups,
      rows,
      sorts
    } = getState().sheet
    const sheet = sheets[sheetId]
    const { [filterId]: deletedFilter, ...nextFilters } = filters
    const nextSheetFilters = sheet.filters.filter(sheetFilterId => sheetFilterId !== filterId)
    const nextSheetVisibleRows = resolveVisibleRows({ ...sheet, filters: nextSheetFilters}, rows, cells, nextFilters, groups, sorts)
    batch(() => {
      dispatch(updateSheetFilters(nextFilters))
      dispatch(updateSheetReducer(sheetId, {
        filters: nextSheetFilters,
        visibleRows: nextSheetVisibleRows
      }))
    })
    mutation.deleteSheetFilter(filterId)
	}
}

//-----------------------------------------------------------------------------
// Delete Sheet Group
//-----------------------------------------------------------------------------
export const DELETE_SHEET_GROUP = 'DELETE_SHEET_GROUP'
interface DeleteSheetGroup {
	type: typeof DELETE_SHEET_GROUP
}

export const deleteSheetGroup = (sheetId: string, groupId: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      sheets,
      cells,
      filters,
      groups,
      rows,
      sorts
    } = getState().sheet
    const sheet = sheets[sheetId]
    const { [groupId]: deletedGroup, ...nextGroups } = groups
    const nextSheetGroups = sheet.groups.filter(sheetGroupId => sheetGroupId !== groupId)
    const nextSheetVisibleRows = resolveVisibleRows({ ...sheet, groups: nextSheetGroups}, rows, cells, filters, nextGroups, sorts)
    batch(() => {
      dispatch(updateSheetGroups(nextGroups))
      dispatch(updateSheetReducer(sheetId, {
        groups: nextSheetGroups,
        visibleRows: nextSheetVisibleRows
      }))
    })
    mutation.deleteSheetGroup(groupId)
	}
}

//-----------------------------------------------------------------------------
// Delete Sheet Sort
//-----------------------------------------------------------------------------
export const DELETE_SHEET_SORT = 'DELETE_SHEET_SORT'
interface DeleteSheetSort {
	type: typeof DELETE_SHEET_SORT
}

export const deleteSheetSort = (sheetId: string, sortId: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      sheets,
      cells,
      filters,
      groups,
      rows,
      sorts,
    } = getState().sheet
    const sheet = sheets[sheetId]
    const { [sortId]: deletedSort, ...nextSorts } = sorts
    const nextSheetSorts = sheet.sorts.filter(sheetSortId => sheetSortId !== sortId)
    const nextSheetVisibleRows = resolveVisibleRows({ ...sheet, sorts: nextSheetSorts}, rows, cells, filters, groups, nextSorts)
    batch(() => {
      dispatch(updateSheetSorts(nextSorts))
      dispatch(updateSheetReducer(sheetId, {
        sorts: nextSheetSorts,
        visibleRows: nextSheetVisibleRows
      }))
    })
    mutation.deleteSheetSort(sortId)
	}
}

//-----------------------------------------------------------------------------
// Delete Sheet Row
//-----------------------------------------------------------------------------
export const deleteSheetRow = (sheetId: string, rowId: SheetRow['id']): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      sheets
    } = getState().sheet
    const sheet = sheets[sheetId]
    const nextSheetRows = sheet.rows.filter(sheetRowId => sheetRowId !== rowId)
    const nextSheetVisibleRows = sheet.visibleRows.filter(visibleRowId => visibleRowId !== rowId)
    const actions = () => {
      batch(() => {
        dispatch(updateSheetReducer(sheetId, {
          rows: nextSheetRows,
          visibleRows: nextSheetVisibleRows
        }))
      })
      mutation.deleteSheetRow(rowId)
    }
    actions()
	}
}

//-----------------------------------------------------------------------------
// Load Sheet
//-----------------------------------------------------------------------------
export const LOAD_SHEET = 'LOAD_SHEET'
interface LoadSheet {
	type: typeof LOAD_SHEET
  sheet: Sheet
  cells: SheetCells
  columns: SheetColumns
  filters: SheetFilters
  groups: SheetGroups
  rows: SheetRows
  sorts: SheetSorts
}

export const loadSheet = (sheetFromServer: SheetFromServer): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
    // Rows and cells
    const normalizedRows: SheetRows = {}
    const normalizedCells: SheetCells = {}
    sheetFromServer.rows.forEach(row => { 
      let rowCells: { [columnId: string]: SheetCell['id'] }  = {}
      row.cells.forEach(cell => {
        normalizedCells[cell.id] = cell
        rowCells[cell.columnId] = cell.id
      })
      normalizedRows[row.id] = { id: row.id, sheetId: sheetFromServer.id, cells: rowCells}
    })
    // Columns
    const normalizedColumns: SheetColumns = {}
    const sheetColumns: SheetColumn['id'][] = []
    sheetFromServer.columns.forEach(column => { 
      normalizedColumns[column.id] = column 
      sheetColumns.push(column.id)
    })
    // Filters
    const normalizedFilters: SheetFilters = {}
    const sheetFilters: SheetFilter['id'][] = []
    sheetFromServer.filters.forEach((filter: SheetFilter) => { 
      normalizedFilters[filter.id] = filter 
      sheetFilters.push(filter.id)
    })
    // Groups
    const normalizedGroups: SheetGroups = {}
    const sheetGroups: SheetGroup['id'][] = []
    sheetFromServer.groups.forEach(group => { 
      normalizedGroups[group.id] = group 
      sheetGroups.push(group.id)
    })
    // Sorts
    const normalizedSorts: SheetSorts = {}
    const sheetSorts: SheetSort['id'][] = []
    sheetFromServer.sorts.forEach(sort => { 
      normalizedSorts[sort.id] = sort 
      sheetSorts.push(sort.id)
    })
    // New Sheet
    const newSheet: Sheet = {
      id: sheetFromServer.id,
      sourceSheetId: sheetFromServer.sourceSheetId,
      fileType: sheetFromServer.fileType,
      columns: sheetColumns,
      filters: sheetFilters,
      groups: sheetGroups, 
      rows: sheetFromServer.rows.map(row => row.id),
      sorts: sheetSorts,
      visibleColumns: sheetFromServer.visibleColumns !== null ? sheetFromServer.visibleColumns : sheetColumns,
      visibleRows: null,
    }
    
		dispatch(
			loadSheetReducer(
        {
          ...newSheet,
          visibleRows: resolveVisibleRows(newSheet, normalizedRows, normalizedCells, normalizedFilters, normalizedGroups, normalizedSorts)
        },
        normalizedCells,
        normalizedColumns,
        normalizedFilters,
        normalizedGroups,
        normalizedRows,
        normalizedSorts,
			)
		)
	}
}

export const loadSheetReducer = (sheet: Sheet, cells: SheetCells, columns: SheetColumns, filters: SheetFilters, groups: SheetGroups, rows: SheetRows, sorts: SheetSorts): SheetActions => {
	return {
		type: LOAD_SHEET,
		sheet,
    cells,
    columns,
    filters,
    groups,
    rows,
    sorts,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet
//-----------------------------------------------------------------------------
export const UPDATE_SHEET = 'UPDATE_SHEET'
interface UpdateSheet {
	type: typeof UPDATE_SHEET
	sheetId: string
	updates: SheetUpdates
}

export const updateSheet = (sheetId: string, updates: SheetUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
    dispatch(updateSheetReducer(sheetId, updates))
    mutation.updateSheet(sheetId, updates)
	}
}

export const updateSheetReducer = (sheetId: string, updates: SheetUpdates): SheetActions => {
	return {
		type: UPDATE_SHEET,
		sheetId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Active
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_ACTIVE = 'UPDATE_SHEET_ACTIVE'
interface UpdateSheetActive {
  type: typeof UPDATE_SHEET_ACTIVE,
  updates: SheetActiveUpdates
}

export const updateSheetActive = (updates: SheetActiveUpdates): SheetActions => {
	return {
		type: UPDATE_SHEET_ACTIVE,
    updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Cell
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_CELL = 'UPDATE_SHEET_CELL'
interface UpdateSheetCell {
	type: typeof UPDATE_SHEET_CELL
	cellId: string
	updates: SheetCellUpdates
}

export const updateSheetCell = (cellId: string, updates: SheetCellUpdates, undoUpdates: SheetCellUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
    const actions = () => {
      dispatch(updateSheetCellReducer(cellId, updates))
      mutation.updateSheetCell(cellId, updates)
    }
    const undoActions = () => {
      dispatch(updateSheetCellReducer(cellId, undoUpdates))
      mutation.updateSheetCell(cellId, undoUpdates)
    }
    dispatch(createHistoryStep({actions, undoActions}))
    actions()
	}
}

export const updateSheetCellReducer = (cellId: string, updates: SheetCellUpdates): SheetActions => {
	return {
		type: UPDATE_SHEET_CELL,
		cellId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Cells
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_CELLS = 'UPDATE_SHEET_CELLS'
interface UpdateSheetCells {
  type: typeof UPDATE_SHEET_CELLS,
  nextSheetCells: SheetCells
}

export const updateSheetCells = (nextSheetCells: SheetCells): SheetActions => {
	return {
		type: UPDATE_SHEET_CELLS,
    nextSheetCells,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Column
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_COLUMN = 'UPDATE_SHEET_COLUMN'
interface UpdateSheetColumn {
	type: typeof UPDATE_SHEET_COLUMN
  columnId: string
	updates: SheetColumnUpdates
}

export const updateSheetColumn = (columnId: string, updates: SheetColumnUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
    dispatch(updateSheetColumnReducer(columnId, updates))
		mutation.updateSheetColumn(columnId, updates)
	}
}

export const updateSheetColumnReducer = (columnId: string, updates: SheetColumnUpdates): SheetActions => {
	return {
		type: UPDATE_SHEET_COLUMN,
    columnId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Columns
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_COLUMNS = 'UPDATE_SHEET_COLUMNS'
interface UpdateSheetColumns {
  type: typeof UPDATE_SHEET_COLUMNS,
  nextSheetColumns: SheetColumns
}

export const updateSheetColumns = (nextSheetColumns: SheetColumns): SheetActions => {
	return {
		type: UPDATE_SHEET_COLUMNS,
    nextSheetColumns,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Filter
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_FILTER = 'UPDATE_SHEET_FILTER'
interface UpdateSheetFilter {
	type: typeof UPDATE_SHEET_FILTER
  filterId: string
	updates: SheetFilterUpdates
}

export const updateSheetFilter = (filterId: string, updates: SheetFilterUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
    dispatch(updateSheetFilterReducer(filterId, updates))
		//mutation.updateSheetFilter(filterId, updates)
	}
}

export const updateSheetFilterReducer = (filterId: string, updates: SheetFilterUpdates): SheetActions => {
	return {
		type: UPDATE_SHEET_FILTER,
    filterId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Filters
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_FILTERS = 'UPDATE_SHEET_FILTERS'
interface UpdateSheetFilters {
  type: typeof UPDATE_SHEET_FILTERS,
  nextSheetFilters: SheetFilters
}

export const updateSheetFilters = (nextSheetFilters: SheetFilters): SheetActions => {
	return {
		type: UPDATE_SHEET_FILTERS,
    nextSheetFilters,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Group
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_GROUP = 'UPDATE_SHEET_GROUP'
interface UpdateSheetGroup {
	type: typeof UPDATE_SHEET_GROUP
  groupId: string
	updates: SheetGroupUpdates
}

export const updateSheetGroup = (groupId: string, updates: SheetGroupUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    dispatch(updateSheetGroupReducer(groupId, updates))
    setTimeout(() => {
      const {
        sheets,
        cells,
        filters,
        groups,
        rows,
        sorts,
      } = getState().sheet
      const sheetId = groups[groupId].sheetId
      const sheet = sheets[sheetId]
      mutation.updateSheetGroup(groupId, updates)
      dispatch(updateSheet(sheetId, {
        visibleRows: resolveVisibleRows(sheet, rows, cells, filters, groups, sorts)
      }))
    }, 25)
	}
}

export const updateSheetGroupReducer = (groupId: string, updates: SheetGroupUpdates): SheetActions => {
	return {
		type: UPDATE_SHEET_GROUP,
    groupId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Groups
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_GROUPS = 'UPDATE_SHEET_GROUPS'
interface UpdateSheetGroups {
  type: typeof UPDATE_SHEET_GROUPS,
  nextSheetGroups: SheetGroups
}

export const updateSheetGroups = (nextSheetGroups: SheetGroups): SheetActions => {
	return {
		type: UPDATE_SHEET_GROUPS,
    nextSheetGroups,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Row
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_ROW = 'UPDATE_SHEET_ROW'
interface UpdateSheetRow {
	type: typeof UPDATE_SHEET_ROW
  rowId: string
	updates: SheetRowUpdates
}

export const updateSheetRow = (rowId: string, updates: SheetRowUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
    dispatch(updateSheetRowReducer(rowId, updates))
		//mutation.updateSheetRow(rowId, updates)
	}
}

export const updateSheetRowReducer = (rowId: string, updates: SheetRowUpdates): SheetActions => {
	return {
		type: UPDATE_SHEET_ROW,
    rowId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Rows
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_ROWS = 'UPDATE_SHEET_ROWS'
interface UpdateSheetRows {
  type: typeof UPDATE_SHEET_ROWS,
  nextSheetRows: SheetRows
}

export const updateSheetRows = (nextSheetRows: SheetRows): SheetActions => {
	return {
		type: UPDATE_SHEET_ROWS,
    nextSheetRows,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Sort
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_SORT = 'UPDATE_SHEET_SORT'
interface UpdateSheetSort {
	type: typeof UPDATE_SHEET_SORT
  sortId: string
	updates: SheetSortUpdates
}

export const updateSheetSort = (sortId: string, updates: SheetSortUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    dispatch(updateSheetSortReducer(sortId, updates))
    setTimeout(() => {
      const {
        sheets,
        cells,
        filters,
        groups,
        rows,
        sorts,
      } = getState().sheet
      const sheetId = sorts[sortId].sheetId
      const sheet = sheets[sheetId]
      mutation.updateSheetSort(sortId, updates)
      dispatch(updateSheet(sheetId, {
        visibleRows: resolveVisibleRows(sheet, rows, cells, filters, groups, sorts)
      }))
    }, 25)
	}
}

export const updateSheetSortReducer = (sortId: string, updates: SheetSortUpdates): SheetActions => {
	return {
		type: UPDATE_SHEET_SORT,
    sortId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Sorts
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_SORTS = 'UPDATE_SHEET_SORTS'
interface UpdateSheetSorts {
  type: typeof UPDATE_SHEET_SORTS,
  nextSheetSorts: SheetSorts
}

export const updateSheetSorts = (nextSheetSorts: SheetSorts): SheetActions => {
	return {
		type: UPDATE_SHEET_SORTS,
    nextSheetSorts,
	}
}