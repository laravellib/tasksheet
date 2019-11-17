//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { 
  clearSheetSelection,
  updateSheet
} from '@app/state/sheet/actions'

import { 
  resolveSheetRowLeaders,
  resolveSheetVisibleRows 
} from '@app/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Refresh Sheet Visible Rows
//-----------------------------------------------------------------------------
export const refreshSheetVisibleRows = (sheetId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets,
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetRows,
      allSheetSorts,
      allSheetViews,
      allSheetPriorities
    } = getState().sheet
    const sheet = allSheets[sheetId]
    const nextSheetVisibleRows = resolveSheetVisibleRows(
      sheet, 
      allSheetRows, 
      allSheetCells, 
      allSheetFilters, 
      allSheetGroups,
      allSheetSorts,
      allSheetViews,
      allSheetPriorities
    )
    const nextSheetVisibleRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(updateSheet(sheetId, {
        visibleRows: nextSheetVisibleRows,
        visibleRowLeaders: nextSheetVisibleRowLeaders,
      }, true))
    })
	}
}