//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheet } from '@app/state/sheet/types'

import { updateSheetClipboard } from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Copy Sheet Range
//-----------------------------------------------------------------------------
export const copySheetRange = (sheetId: ISheet['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allSheets: {
        [sheetId]: {
          activeSheetViewId,
          selections: {
            rangeCellIds,
            rangeStartColumnId,
            rangeStartRowId,
            rangeStartCellId,
            rangeEndColumnId,
            rangeEndRowId,
            rangeEndCellId,
          },
        }
      },
      allSheetViews
    } = getState().sheet
    const {
      visibleColumns,
      visibleRows,
    } = allSheetViews[activeSheetViewId]

    dispatch(updateSheetClipboard({
      sheetId: sheetId,
      cutOrCopy: 'COPY',
      selections: {
          rangeCellIds,
          rangeStartColumnId,
          rangeStartRowId,
          rangeStartCellId,
          rangeEndColumnId,
          rangeEndRowId,
          rangeEndCellId,
          visibleColumns,
          visibleRows
      }
    }))
    
  }
}