//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'

import { 
  ISheet,
  ISheetCell, 
  ISheetColumn, 
  ISheetRow, 
  ISheetSelections 
} from '@/state/sheet/types'

//-----------------------------------------------------------------------------
// Default Column
//-----------------------------------------------------------------------------
export const defaultColumn = (sheetId: string): ISheetColumn => {
  return {
    id: createUuid(),
    sheetId: sheetId, 
    name: '-',
    width: 100,
    cellType: 'STRING',
    defaultValue: '',
    trackCellChanges: false,
    showCellChanges: true,
    allCellValues: new Set() as Set<string>,
    isRenaming: false
  }
}


//-----------------------------------------------------------------------------
// Default Row
//-----------------------------------------------------------------------------
export const defaultRow = (sheetId: string, rowId: ISheetRow['id'], columns: ISheetColumn['id'][]): ISheetRow => {
  const newCells: { [columnId: string ]: ISheetCell['id'] } = {}
  columns.forEach(columnId => { newCells[columnId] = createUuid() })
  return {
    id: rowId,
    sheetId: sheetId,
    cells: newCells
  }
}

//-----------------------------------------------------------------------------
// Default Cell
//-----------------------------------------------------------------------------
export const defaultCell = (sheetId: string, rowId: ISheetRow['id'], columnId: string, cellId: string, defaultValue: string = ""): ISheetCell => {
  return {
    id: cellId,
    sheetId: sheetId, 
    columnId: columnId,
    rowId: rowId,
    value: defaultValue,
    isCellEditing: false,
    isCellSelectedSheetIds: new Set() as Set<string>
  }
}
//-----------------------------------------------------------------------------
// Default Sheet Selections
//-----------------------------------------------------------------------------
export const defaultSheetSelections: ISheetSelections = {
  isOneEntireColumnSelected: false,
  isOneEntireRowSelected: false,
  isSelectedCellEditingPrevented: false,
  isSelectedCellNavigationPrevented: false,
  rangeColumnIds: new Set() as Set<ISheetColumn['id']>,
  rangeCellIds: new Set() as Set<ISheetCell['id']>,
  rangeStartColumnId: null,
  rangeStartRowId: null,
  rangeStartCellId: null,
  rangeEndColumnId: null,
  rangeEndRowId: null,
  rangeEndCellId: null,
}

//-----------------------------------------------------------------------------
// Default Sheet Styles
//-----------------------------------------------------------------------------
export const defaultSheetStyles = {
  id: createUuid(),
  backgroundColor: new Set as Set<string>,
  backgroundColorReference: {},
  color: new Set as Set<string>,
  colorReference: {},
  bold: new Set as Set<string>,
  italic: new Set as Set<string>
}

//-----------------------------------------------------------------------------
// Default Sheet
//-----------------------------------------------------------------------------
export const defaultSheet: ISheet = {
  id: createUuid(),
  sourceSheetId: null,
  activeSheetViewId: null,
  columns: [],
  rows: [],
  gantts: {},
  ganttRanges: {},
  priorities: [],
  cellPriorities: {},
  styles: defaultSheetStyles,
  selections: defaultSheetSelections,
  views: [],
  visibleRows: [],
  visibleRowLeaders: [],
  isCellEditing: false
}