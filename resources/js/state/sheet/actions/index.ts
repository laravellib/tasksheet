//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { 
  IAllSheets, ISheet, ISheetUpdates,
  ISheetActiveUpdates, 
  IAllSheetColumns, ISheetColumnUpdates,
  IAllSheetRows, ISheetRowUpdates, 
  IAllSheetCells, ISheetCellUpdates,
  ISheetClipboard,
  IAllSheetFilters, ISheetFilterUpdates,
  IAllSheetGroups, ISheetGroupUpdates,
  IAllSheetSorts, ISheetSortUpdates,
  IAllSheetViews, ISheetViewUpdates,
  IAllSheetChanges, IAllSheetCellChanges,
  IAllSheetFiles, IAllSheetCellFiles,
  IAllSheetGantts, ISheetGanttUpdates,
  IAllSheetGanttRanges, ISheetGanttRangeUpdates,
  IAllSheetLabels, IAllSheetCellLabels,
  IAllSheetPhotos, IAllSheetCellPhotos,
  IAllSheetPriorities, ISheetPriorityUpdates
} from '@/state/sheet/types'

//-----------------------------------------------------------------------------
// Thunk Actions
//-----------------------------------------------------------------------------
export { loadSheet } from '@/state/sheet/actions/loadSheet'
export { loadSheetView } from '@/state/sheet/actions/loadSheetView'

export { createDemoSheet } from '@/state/sheet/actions/createDemoSheet'
export { createSheet } from '@/state/sheet/actions/createSheet'
export { createSheetFromCsv } from '@/state/sheet/actions/createSheetFromCsv'
export { createSheetColumns } from '@/state/sheet/actions/createSheetColumns'
export { createSheetColumnBreak } from '@/state/sheet/actions/createSheetColumnBreak'
export { createSheetFilter } from '@/state/sheet/actions/createSheetFilter'
export { createSheetGroup } from '@/state/sheet/actions/createSheetGroup'
export { createSheetRows } from '@/state/sheet/actions/createSheetRows'
export { createSheetSort } from '@/state/sheet/actions/createSheetSort'
export { createSheetLink } from '@/state/sheet/actions/createSheetLink'
export { createSheetView } from '@/state/sheet/actions/createSheetView'
export { createSheetCellChange } from '@/state/sheet/actions/createSheetCellChange'
export { createSheetCellFile } from '@/state/sheet/actions/createSheetCellFile'
export { createSheetCellLabel } from '@/state/sheet/actions/createSheetCellLabel'
export { createSheetCellPhoto } from '@/state/sheet/actions/createSheetCellPhoto'
export { createSheetPriority } from '@/state/sheet/actions/createSheetPriority'
export { createSheetGantt } from '@/state/sheet/actions/createSheetGantt'
export { createSheetGanttRange } from '@/state/sheet/actions/createSheetGanttRange'

export { deleteSheetColumns } from '@/state/sheet/actions/deleteSheetColumns'
export { deleteSheetColumnBreak } from '@/state/sheet/actions/deleteSheetColumnBreak'
export { deleteSheetFilter } from '@/state/sheet/actions/deleteSheetFilter'
export { deleteSheetGroup } from '@/state/sheet/actions/deleteSheetGroup'
export { deleteSheetRows } from '@/state/sheet/actions/deleteSheetRows'
export { deleteSheetSort } from '@/state/sheet/actions/deleteSheetSort'
export { deleteSheetView } from '@/state/sheet/actions/deleteSheetView'
export { deleteSheetGanttRange } from '@/state/sheet/actions/deleteSheetGanttRange'
export { deleteSheetCellChange } from '@/state/sheet/actions/deleteSheetCellChange'
export { deleteSheetCellFile } from '@/state/sheet/actions/deleteSheetCellFile'
export { deleteSheetCellLabel } from '@/state/sheet/actions/deleteSheetCellLabel'
export { deleteSheetCellPhoto } from '@/state/sheet/actions/deleteSheetCellPhoto'
export { deleteSheetPriority } from '@/state/sheet/actions/deleteSheetPriority'

export { updateSheetCell } from '@/state/sheet/actions/updateSheetCell'
export { updateSheetCellValues } from '@/state/sheet/actions/updateSheetCellValues'
export { updateSheetColumn } from '@/state/sheet/actions/updateSheetColumn'
export { updateSheetFilter } from '@/state/sheet/actions/updateSheetFilter'
export { updateSheetGantt } from '@/state/sheet/actions/updateSheetGantt'
export { updateSheetGanttRange } from '@/state/sheet/actions/updateSheetGanttRange'
export { updateSheetGroup } from '@/state/sheet/actions/updateSheetGroup'
export { updateSheetCellPriorities } from '@/state/sheet/actions/updateSheetCellPriorities'
export { updateSheetPriority } from '@/state/sheet/actions/updateSheetPriority'
export { updateSheetPriorityStyle } from '@/state/sheet/actions/updateSheetPriorityStyle'
export { updateSheetSort } from '@/state/sheet/actions/updateSheetSort'
export { updateSheetStyles } from '@/state/sheet/actions/updateSheetStyles'
export { updateSheetView } from '@/state/sheet/actions/updateSheetView'

export { addSheetColumnAllCellValue } from '@/state/sheet/actions/addSheetColumnAllCellValue'
export { moveSheetColumns } from '@/state/sheet/actions/moveSheetColumns'

export { resetSheetView } from '@/state/sheet/actions/resetSheetView'

export { refreshSheetVisibleRows } from '@/state/sheet/actions/refreshSheetVisibleRows'

export { copySheetRange } from '@/state/sheet/actions/copySheetRange'
export { cutSheetRange } from '@/state/sheet/actions/cutSheetRange'
export { pasteSheetRange } from '@/state/sheet/actions/pasteSheetRange'

export { hideSheetColumns } from '@/state/sheet/actions/hideSheetColumns'
export { showSheetColumn } from '@/state/sheet/actions/showSheetColumn'

export { allowSelectedCellEditing } from '@/state/sheet/actions/allowSelectedCellEditing'
export { allowSelectedCellNavigation } from '@/state/sheet/actions/allowSelectedCellNavigation'
export { preventSelectedCellEditing } from '@/state/sheet/actions/preventSelectedCellEditing'
export { preventSelectedCellNavigation } from '@/state/sheet/actions/preventSelectedCellNavigation'
export { clearSheetSelection } from '@/state/sheet/actions/clearSheetSelection'
export { selectSheetColumns } from '@/state/sheet/actions/selectSheetColumns'
export { selectSheetRows } from '@/state/sheet/actions/selectSheetRows'
export { updateSheetSelectionFromArrowKey } from '@/state/sheet/actions/updateSheetSelectionFromArrowKey'
export { updateSheetSelectionFromCellClick } from '@/state/sheet/actions/updateSheetSelectionFromCellClick'

//-----------------------------------------------------------------------------
// Sheet Actions
//-----------------------------------------------------------------------------
export type ISheetActions = 
  ISetAllSheets | 
  ILoadSheet | IUpdateSheet | 
  IUpdateSheetActive |
  IUpdateSheetCell | ISetAllSheetCells | 
  IUpdateSheetClipboard |
  IUpdateSheetColumn | ISetAllSheetColumns | 
  IUpdateSheetFilter | ISetAllSheetFilters |
  IUpdateSheetGroup | ISetAllSheetGroups |
  IUpdateSheetRow | ISetAllSheetRows | 
  IUpdateSheetSort | ISetAllSheetSorts |
  IUpdateSheetView | ISetAllSheetViews |
  ISetAllSheetCellChanges | ISetAllSheetChanges |
  ISetAllSheetCellPhotos | ISetAllSheetPhotos |
  ISetAllSheetCellLabels | ISetAllSheetLabels |
  ISetAllSheetCellFiles | ISetAllSheetFiles |
  IUpdateSheetGantt | ISetAllSheetGantts |
  IUpdateSheetGanttRange | ISetAllSheetGanttRanges |
  IUpdateSheetPriority | ISetAllSheetPriorities

//-----------------------------------------------------------------------------
// Load Sheet - Moved
//-----------------------------------------------------------------------------
export const LOAD_SHEET = 'LOAD_SHEET'
interface ILoadSheet {
  type: typeof LOAD_SHEET
  sheet: ISheet
  cells: IAllSheetCells
  columns: IAllSheetColumns
  filters: IAllSheetFilters
  groups: IAllSheetGroups
  rows: IAllSheetRows
  sorts: IAllSheetSorts
  views: IAllSheetViews
  changes: IAllSheetChanges
  files: IAllSheetFiles
  gantts: IAllSheetGantts
  ganttRanges: IAllSheetGanttRanges
  labels: IAllSheetLabels
  photos: IAllSheetPhotos
  priorities: IAllSheetPriorities
  cellChanges: IAllSheetCellChanges
  cellFiles: IAllSheetCellFiles
  cellLabels: IAllSheetCellLabels
  cellPhotos: IAllSheetCellPhotos
}

export const loadSheetReducer = (
  sheet: ISheet, 
  cells: IAllSheetCells, 
  columns: IAllSheetColumns, 
  filters: IAllSheetFilters, 
  groups: IAllSheetGroups, 
  rows: IAllSheetRows, 
  sorts: IAllSheetSorts, 
  views: IAllSheetViews,
  changes: IAllSheetChanges,
  files: IAllSheetFiles,
  gantts: IAllSheetGantts,
  ganttRanges: IAllSheetGanttRanges,
  labels: IAllSheetLabels,
  photos: IAllSheetPhotos,
  priorities: IAllSheetPriorities,
  cellChanges: IAllSheetCellChanges,
  cellFiles: IAllSheetCellFiles,
  cellLabels: IAllSheetCellLabels,
  cellPhotos: IAllSheetCellPhotos,
): ISheetActions => {
  return {
    type: LOAD_SHEET,
    columns,
    rows,
    sheet,
    cells,
    filters,
    groups,
    sorts,
    views,
    changes,
    files,
    gantts,
    ganttRanges,
    labels,
    photos,
    priorities,
    cellChanges,
    cellFiles,
    cellLabels,
    cellPhotos
  }
}

//-----------------------------------------------------------------------------
// Set All Sheets
//-----------------------------------------------------------------------------
export const SET_ALL_SHEETS = 'SET_ALL_SHEETS'
interface ISetAllSheets {
  type: typeof SET_ALL_SHEETS,
  nextAllSheets: IAllSheets
}

export const setAllSheets = (nextAllSheets: IAllSheets): ISheetActions => {
	return {
		type: SET_ALL_SHEETS,
    nextAllSheets,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Cells
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_CELLS = 'SET_ALL_SHEET_CELLS'
interface ISetAllSheetCells {
  type: typeof SET_ALL_SHEET_CELLS,
  nextAllSheetCells: IAllSheetCells
}

export const setAllSheetCells = (nextAllSheetCells: IAllSheetCells): ISheetActions => {
	return {
		type: SET_ALL_SHEET_CELLS,
    nextAllSheetCells,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Columns
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_COLUMNS = 'SET_ALL_SHEET_COLUMNS'
interface ISetAllSheetColumns {
  type: typeof SET_ALL_SHEET_COLUMNS,
  nextAllSheetColumns: IAllSheetColumns
}

export const setAllSheetColumns = (nextAllSheetColumns: IAllSheetColumns): ISheetActions => {
	return {
		type: SET_ALL_SHEET_COLUMNS,
    nextAllSheetColumns,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Filters
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_FILTERS = 'SET_ALL_SHEET_FILTERS'
interface ISetAllSheetFilters {
  type: typeof SET_ALL_SHEET_FILTERS,
  nextAllSheetFilters: IAllSheetFilters
}

export const setAllSheetFilters = (nextAllSheetFilters: IAllSheetFilters): ISheetActions => {
	return {
		type: SET_ALL_SHEET_FILTERS,
    nextAllSheetFilters,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Groups
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_GROUPS = 'SET_ALL_SHEET_GROUPS'
interface ISetAllSheetGroups {
  type: typeof SET_ALL_SHEET_GROUPS,
  nextAllSheetGroups: IAllSheetGroups
}

export const setAllSheetGroups = (nextAllSheetGroups: IAllSheetGroups): ISheetActions => {
	return {
		type: SET_ALL_SHEET_GROUPS,
    nextAllSheetGroups,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Rows
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_ROWS = 'SET_ALL_SHEET_ROWS'
interface ISetAllSheetRows {
  type: typeof SET_ALL_SHEET_ROWS,
  nextAllSheetRows: IAllSheetRows
}

export const setAllSheetRows = (nextAllSheetRows: IAllSheetRows): ISheetActions => {
	return {
		type: SET_ALL_SHEET_ROWS,
    nextAllSheetRows,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Sorts
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_SORTS = 'SET_ALL_SHEET_SORTS'
interface ISetAllSheetSorts {
  type: typeof SET_ALL_SHEET_SORTS,
  nextAllSheetSorts: IAllSheetSorts
}

export const setAllSheetSorts = (nextAllSheetSorts: IAllSheetSorts): ISheetActions => {
	return {
		type: SET_ALL_SHEET_SORTS,
    nextAllSheetSorts,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Views
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_VIEWS = 'SET_ALL_SHEET_VIEWS'
interface ISetAllSheetViews {
  type: typeof SET_ALL_SHEET_VIEWS,
  nextAllSheetViews: IAllSheetViews
}

export const setAllSheetViews = (nextAllSheetViews: IAllSheetViews): ISheetActions => {
	return {
		type: SET_ALL_SHEET_VIEWS,
    nextAllSheetViews,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Cell Changes
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_CELL_CHANGES = 'SET_ALL_SHEET_CELL_CHANGES'
interface ISetAllSheetCellChanges {
  type: typeof SET_ALL_SHEET_CELL_CHANGES,
  nextAllSheetCellChanges: IAllSheetCellChanges
}

export const setAllSheetCellChanges = (nextAllSheetCellChanges: IAllSheetCellChanges): ISheetActions => {
	return {
		type: SET_ALL_SHEET_CELL_CHANGES,
    nextAllSheetCellChanges,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Changes
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_CHANGES = 'SET_ALL_SHEET_CHANGES'
interface ISetAllSheetChanges {
  type: typeof SET_ALL_SHEET_CHANGES,
  nextAllSheetChanges: IAllSheetChanges
}

export const setAllSheetChanges = (nextAllSheetChanges: IAllSheetChanges): ISheetActions => {
	return {
		type: SET_ALL_SHEET_CHANGES,
    nextAllSheetChanges,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Cell Files
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_CELL_FILES = 'SET_ALL_SHEET_CELL_FILES'
interface ISetAllSheetCellFiles {
  type: typeof SET_ALL_SHEET_CELL_FILES,
  nextAllSheetCellFiles: IAllSheetCellFiles
}

export const setAllSheetCellFiles = (nextAllSheetCellFiles: IAllSheetCellFiles): ISheetActions => {
	return {
		type: SET_ALL_SHEET_CELL_FILES,
    nextAllSheetCellFiles,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Files
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_FILES = 'SET_ALL_SHEET_FILES'
interface ISetAllSheetFiles {
  type: typeof SET_ALL_SHEET_FILES,
  nextAllSheetFiles: IAllSheetFiles
}

export const setAllSheetFiles = (nextAllSheetFiles: IAllSheetFiles): ISheetActions => {
	return {
		type: SET_ALL_SHEET_FILES,
    nextAllSheetFiles,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Gantts
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_GANTTS = 'SET_ALL_SHEET_GANTTS'
interface ISetAllSheetGantts {
  type: typeof SET_ALL_SHEET_GANTTS,
  nextAllSheetGantts: IAllSheetGantts
}

export const setAllSheetGantts = (nextAllSheetGantts: IAllSheetGantts): ISheetActions => {
	return {
		type: SET_ALL_SHEET_GANTTS,
    nextAllSheetGantts,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Gantt Ranges
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_GANTT_RANGES = 'SET_ALL_SHEET_GANTT_RANGES'
interface ISetAllSheetGanttRanges {
  type: typeof SET_ALL_SHEET_GANTT_RANGES,
  nextAllSheetGanttRanges: IAllSheetGanttRanges
}

export const setAllSheetGanttRanges = (nextAllSheetGanttRanges: IAllSheetGanttRanges): ISheetActions => {
	return {
		type: SET_ALL_SHEET_GANTT_RANGES,
    nextAllSheetGanttRanges,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Cell Labels
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_CELL_LABELS = 'SET_ALL_SHEET_CELL_LABELS'
interface ISetAllSheetCellLabels {
  type: typeof SET_ALL_SHEET_CELL_LABELS,
  nextAllSheetCellLabels: IAllSheetCellLabels
}

export const setAllSheetCellLabels = (nextAllSheetCellLabels: IAllSheetCellLabels): ISheetActions => {
	return {
		type: SET_ALL_SHEET_CELL_LABELS,
    nextAllSheetCellLabels,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Labels
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_LABELS = 'SET_ALL_SHEET_LABELS'
interface ISetAllSheetLabels {
  type: typeof SET_ALL_SHEET_LABELS,
  nextAllSheetLabels: IAllSheetLabels
}

export const setAllSheetLabels = (nextAllSheetLabels: IAllSheetLabels): ISheetActions => {
	return {
		type: SET_ALL_SHEET_LABELS,
    nextAllSheetLabels,
	}
}


//-----------------------------------------------------------------------------
// Set All Sheet Cell Photos
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_CELL_PHOTOS = 'SET_ALL_SHEET_CELL_PHOTOS'
interface ISetAllSheetCellPhotos {
  type: typeof SET_ALL_SHEET_CELL_PHOTOS,
  nextAllSheetCellPhotos: IAllSheetCellPhotos
}

export const setAllSheetCellPhotos = (nextAllSheetCellPhotos: IAllSheetCellPhotos): ISheetActions => {
	return {
		type: SET_ALL_SHEET_CELL_PHOTOS,
    nextAllSheetCellPhotos,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Photos
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_PHOTOS = 'SET_ALL_SHEET_PHOTOS'
interface ISetAllSheetPhotos {
  type: typeof SET_ALL_SHEET_PHOTOS,
  nextAllSheetPhotos: IAllSheetPhotos
}

export const setAllSheetPhotos = (nextAllSheetPhotos: IAllSheetPhotos): ISheetActions => {
	return {
		type: SET_ALL_SHEET_PHOTOS,
    nextAllSheetPhotos,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Views
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_PRIORITIES = 'SET_ALL_SHEET_PRIORITIES'
interface ISetAllSheetPriorities {
  type: typeof SET_ALL_SHEET_PRIORITIES,
  nextAllSheetPriorities: IAllSheetPriorities
}

export const setAllSheetPriorities = (nextAllSheetPriorities: IAllSheetPriorities): ISheetActions => {
	return {
		type: SET_ALL_SHEET_PRIORITIES,
    nextAllSheetPriorities,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet
//-----------------------------------------------------------------------------
export const UPDATE_SHEET = 'UPDATE_SHEET'
interface IUpdateSheet {
  type: typeof UPDATE_SHEET
  sheetId: string
  updates: ISheetUpdates
}

export const updateSheet = (sheetId: string, updates: ISheetUpdates, skipDatabaseUpdate: boolean = false): ISheetActions => {
  !skipDatabaseUpdate && mutation.updateSheet(sheetId, updates)
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
interface IUpdateSheetActive {
  type: typeof UPDATE_SHEET_ACTIVE,
  updates: ISheetActiveUpdates
}

export const updateSheetActive = (updates: ISheetActiveUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_ACTIVE,
    updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Cell
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_CELL = 'UPDATE_SHEET_CELL'
interface IUpdateSheetCell {
	type: typeof UPDATE_SHEET_CELL
	cellId: string
	updates: ISheetCellUpdates
}

export const updateSheetCellReducer = (cellId: string, updates: ISheetCellUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_CELL,
		cellId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Clipboard
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_CLIPBOARD = 'UPDATE_SHEET_CLIPBOARD'
interface IUpdateSheetClipboard {
  type: typeof UPDATE_SHEET_CLIPBOARD
  nextSheetClipboard: ISheetClipboard
}
export const updateSheetClipboard = (nextSheetClipboard: ISheetClipboard): ISheetActions => {
  return {
    type: UPDATE_SHEET_CLIPBOARD,
    nextSheetClipboard
  }
}

//-----------------------------------------------------------------------------
// Update Sheet Column
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_COLUMN = 'UPDATE_SHEET_COLUMN'
interface IUpdateSheetColumn {
	type: typeof UPDATE_SHEET_COLUMN
  columnId: string
	updates: ISheetColumnUpdates
}

export const updateSheetColumnReducer = (columnId: string, updates: ISheetColumnUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_COLUMN,
    columnId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Filter
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_FILTER = 'UPDATE_SHEET_FILTER'
interface IUpdateSheetFilter {
	type: typeof UPDATE_SHEET_FILTER
  filterId: string
	updates: ISheetFilterUpdates
}

export const updateSheetFilterReducer = (filterId: string, updates: ISheetFilterUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_FILTER,
    filterId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Group
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_GROUP = 'UPDATE_SHEET_GROUP'
interface IUpdateSheetGroup {
	type: typeof UPDATE_SHEET_GROUP
  groupId: string
	updates: ISheetGroupUpdates
}

export const updateSheetGroupReducer = (groupId: string, updates: ISheetGroupUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_GROUP,
    groupId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Row
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_ROW = 'UPDATE_SHEET_ROW'
interface IUpdateSheetRow {
	type: typeof UPDATE_SHEET_ROW
  rowId: string
	updates: ISheetRowUpdates
}

export const updateSheetRow = (rowId: string, updates: ISheetRowUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_ROW,
    rowId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Sort
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_SORT = 'UPDATE_SHEET_SORT'
interface IUpdateSheetSort {
	type: typeof UPDATE_SHEET_SORT
  sortId: string
	updates: ISheetSortUpdates
}

export const updateSheetSortReducer = (sortId: string, updates: ISheetSortUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_SORT,
    sortId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Sort 
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_VIEW = 'UPDATE_SHEET_VIEW'
interface IUpdateSheetView {
	type: typeof UPDATE_SHEET_VIEW
  sheetViewId: string
	updates: ISheetViewUpdates
}

export const updateSheetViewReducer = (sheetViewId: string, updates: ISheetViewUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_VIEW,
    sheetViewId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Priority
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_PRIORITY = 'UPDATE_SHEET_PRIORITY'
interface IUpdateSheetPriority {
	type: typeof UPDATE_SHEET_PRIORITY
  sheetPriorityId: string
	updates: ISheetPriorityUpdates
}

export const updateSheetPriorityReducer = (sheetPriorityId: string, updates: ISheetPriorityUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_PRIORITY,
    sheetPriorityId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Gantt
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_GANTT = 'UPDATE_SHEET_GANTT'
interface IUpdateSheetGantt {
	type: typeof UPDATE_SHEET_GANTT
  sheetGanttId: string
	updates: ISheetGanttUpdates
}

export const updateSheetGanttReducer = (sheetGanttId: string, updates: ISheetGanttUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_GANTT,
    sheetGanttId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Gantt Range
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_GANTT_RANGE = 'UPDATE_SHEET_GANTT_RANGE'
interface IUpdateSheetGanttRange {
	type: typeof UPDATE_SHEET_GANTT_RANGE
  sheetGanttRangeId: string
	updates: ISheetGanttRangeUpdates
}

export const updateSheetGanttRangeReducer = (sheetGanttRangeId: string, updates: ISheetGanttRangeUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_GANTT_RANGE,
    sheetGanttRangeId,
		updates,
	}
}