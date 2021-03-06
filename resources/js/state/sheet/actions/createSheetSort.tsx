//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheetSort } from '@/state/sheet/types'
import { 
  clearSheetSelection,
  setAllSheetSorts,
  updateSheet,
  updateSheetView
} from '@/state/sheet/actions'
import { createHistoryStep } from '@/state/history/actions'

import { 
  resolveSheetRowLeaders,
  resolveSheetVisibleRows 
} from '@/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Create Sheet Sort
//-----------------------------------------------------------------------------
export const createSheetSort = (sheetId: string, newSort: ISheetSort): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allSheets,
      allSheetColumns,
      allSheetRows,
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetSorts,
      allSheetViews,
      allSheetPriorities
    } = getState().sheet

    const sheet = allSheets[sheetId]
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]

    const nextAllSheetSorts = { ...allSheetSorts, [newSort.id]: newSort }
    const nextSheetViewSorts = [ ...activeSheetView.sorts, newSort.id ]
    const nextSheetVisibleRows = resolveSheetVisibleRows(
      sheet, 
      allSheetColumns,
      allSheetRows, 
      allSheetCells, 
      allSheetFilters, 
      allSheetGroups, 
      nextAllSheetSorts, 
      {
        ...allSheetViews,
        [activeSheetView.id]: {
          ...allSheetViews[activeSheetView.id],
          sorts: nextSheetViewSorts
        }
      },
      allSheetPriorities
    )
    const nextSheetVisibleRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)

    const actions = (isHistoryStep: boolean = false) => {
      batch(() => {
        dispatch(clearSheetSelection(sheetId))
        dispatch(setAllSheetSorts(nextAllSheetSorts))
        dispatch(updateSheet(sheetId, {
          visibleRows: nextSheetVisibleRows,
          visibleRowLeaders: nextSheetVisibleRowLeaders,
        }, true))
        dispatch(updateSheetView(activeSheetView.id, {
          sorts: nextSheetViewSorts
        }, true))
      })
      if(!isHistoryStep) {
        mutation.createSheetSort(newSort)
      }
      else {
        mutation.restoreSheetSort(newSort.id)
      }
    }

    const undoActions = () => {
      batch(() => {
        dispatch(clearSheetSelection(sheetId))
        dispatch(setAllSheetSorts(allSheetSorts))
        dispatch(updateSheet(sheetId, {
          visibleRows: sheet.visibleRows,
          visibleRowLeaders: sheet.visibleRowLeaders,
        }, true))
        dispatch(updateSheetView(activeSheetView.id, {
          sorts: activeSheetView.sorts
        }, true))
      })

      mutation.deleteSheetSort(newSort.id)
    }

    dispatch(createHistoryStep({ actions, undoActions }))
    actions()
  }
}