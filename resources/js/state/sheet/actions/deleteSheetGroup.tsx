//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'

import { 
  clearSheetSelection,
  setAllSheetGroups,
  updateSheet,
  updateSheetView
} from '@/state/sheet/actions'
import { createHistoryStep } from '@/state/history/actions'

import { 
  resolveSheetRowLeaders,
  resolveSheetVisibleRows 
} from '@/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const deleteSheetGroup = (sheetId: string, groupId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allSheets,
      allSheetColumns,
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetRows,
      allSheetSorts,
      allSheetViews,
      allSheetPriorities
    } = getState().sheet

    const sheet = allSheets[sheetId]
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]

    const { [groupId]: deletedGroup, ...nextAllSheetGroups } = allSheetGroups

    const nextSheetViewGroups = activeSheetView.groups.filter(sheetGroupId => sheetGroupId !== groupId)
    const nextSheetVisibleRows = resolveSheetVisibleRows(
      sheet, 
      allSheetColumns,
      allSheetRows, 
      allSheetCells, 
      allSheetFilters, 
      nextAllSheetGroups, 
      allSheetSorts,
      {
        ...allSheetViews,
        [activeSheetView.id]: {
          ...allSheetViews[activeSheetView.id],
          groups: nextSheetViewGroups
        }
      },
      allSheetPriorities
      )
    const nextSheetVisibleRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)

    const actions = () => {
      batch(() => {
        dispatch(clearSheetSelection(sheetId))
        dispatch(setAllSheetGroups(nextAllSheetGroups))
        dispatch(updateSheet(sheetId, {
          visibleRows: nextSheetVisibleRows,
          visibleRowLeaders: nextSheetVisibleRowLeaders
        }, true))
        dispatch(updateSheetView(activeSheetView.id, {
          groups: nextSheetViewGroups
        }, true))
      })
      mutation.deleteSheetGroup(groupId)
    }

    const undoActions = () => {
      batch(() => {
        dispatch(clearSheetSelection(sheetId))
        dispatch(setAllSheetGroups(allSheetGroups))
        dispatch(updateSheet(sheetId, {
          visibleRows: sheet.visibleRows,
          visibleRowLeaders: sheet.visibleRowLeaders
        }, true))
        dispatch(updateSheetView(activeSheetView.id, {
          groups: activeSheetView.groups
        }, true))
      })
      mutation.restoreSheetGroup(groupId)
    }

    dispatch(createHistoryStep({ actions, undoActions }))
    actions()
	}
}