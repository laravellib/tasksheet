//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'

import clone from '@/utils/clone'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { IFile, IFileType, IFolder } from '@/state/folder/types'
import { ISheet, ISheetView } from '@/state/sheet/types'
import { IUser } from '@/state/user/types'

import { loadSheetReducer } from '@/state/sheet/actions'
import { createFile } from '@/state/folder/actions'
import { openFileInNewTab, updateTabs } from '@/state/tab/actions'

import { defaultSheetSelections, defaultSheetStyles } from '@/state/sheet/defaults'

//-----------------------------------------------------------------------------
// Create Sheet Link
//-----------------------------------------------------------------------------
export const createSheetLink = (sheetId: ISheet['id'], folderId: IFolder['id'], userId: IUser['id'] = null): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      folder: { 
        allFiles
      },
      sheet: { 
        allSheets,
        allSheetViews
      },
      tab: { 
        tabs 
      }
    } = getState()
    const sourceSheet = allSheets[sheetId]
    const sourceSheetActiveSheetView = allSheetViews[sourceSheet.activeSheetViewId]

    const fileId = Object.keys(allFiles).find(fileId => allFiles[fileId].typeId === sheetId)
    const newFileId = createUuid()
    
    const newSheetLinkFileName = allFiles[fileId].name + ' - Linked'

    const newSheetLinkId = createUuid()
    const newSheetLinkActiveSheetView: ISheetView = {
      ...sourceSheetActiveSheetView,
      id: createUuid(),
      filters: [],
      groups: [],
      sorts: []
    }

  // Update allSheets
    dispatch(loadSheetReducer(
      {
        id: newSheetLinkId,
        sourceSheetId: sourceSheet.sourceSheetId || sourceSheet.id,
        activeSheetViewId: newSheetLinkActiveSheetView.id,
        columns: clone(sourceSheet.columns),
        rows: clone(sourceSheet.rows),
        visibleRowLeaders: clone(sourceSheet.visibleRowLeaders),
        visibleRows: clone(sourceSheet.visibleRows),
        selections: defaultSheetSelections,
        styles: defaultSheetStyles,
        views: [],
        gantts: {},
        ganttRanges: {},
        priorities: [],
        cellPriorities: {},
        isCellEditing: false
      },
      null, // Cells
      null, // Columns
      null, // Filters
      null, // Groups
      null, // Rows
      null, // Sorts
      {
        ...allSheetViews,
        [newSheetLinkActiveSheetView.id]: newSheetLinkActiveSheetView
      },
      null, // Changes
      null, // Files
      null, // Gantts
      null, // Gantt Ranges
      null, // Labels
      null, // Photos
      null, // Priorities
      null, // Cell Changes
      null, // Cell Files
      null, // Cell Labels
      null // Cell photos
    ))

    // Update folders and files
    const newFile: IFile = {
      id: newFileId,
      folderId: userId ? null : folderId,
      userId: userId,
      type: 'SHEET' as IFileType, 
      name: newSheetLinkFileName,
      typeId: newSheetLinkId,
      role: 'OWNER',
      permissions: []
    }

    dispatch(createFile(folderId, userId, newFile))

    // Update open tabs
    dispatch(updateTabs([ ...tabs, newFileId ]))

    // Create the sheet view on the server
    await mutation.createSheetLink({
      id: newSheetLinkId,
      sourceSheetId: sourceSheet.sourceSheetId || sourceSheet.id,
      activeSheetViewId: newSheetLinkActiveSheetView.id,
      activeSheetViewName: newSheetLinkFileName,
      activeSheetViewVisibleColumns: newSheetLinkActiveSheetView.visibleColumns,
    })
    
    dispatch(openFileInNewTab(newFile.id))
	}
}