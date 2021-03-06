//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axios from '@/api/axios'
import { IS3PresignedUrlData } from '@/api/vapor'

import { 
  IFile, IFileUpdates, IFilePermission, IFilePermissionUpdates,
  IFolder, IFolderPermission, IFolderPermissionUpdates, IFolderUpdates 
} from '@/state/folder/types'
import { 
  ISheet, ISheetUpdates,
  ISheetLinkToDatabase,
  ISheetColumn, ISheetColumnUpdates,
  ISheetRow, ISheetRowToDatabase,
  ISheetCell, ISheetCellUpdates,
  ISheetFilter, 
  ISheetGroup, ISheetGroupUpdates, 
  ISheetSort, ISheetSortUpdates, 
  ISheetStylesDatabaseUpdates,
  ISheetViewToDatabase, ISheetViewUpdates,
	ISheetChange,
	ISheetGantt, ISheetGanttUpdates,
	ISheetGanttRange, ISheetGanttRangeUpdates,
	ISheetLabel,
  ISheetPriority, ISheetPriorityUpdates, ISheetCellPriority
} from '@/state/sheet/types'
import { 
  IUser, IUserUpdates,
  IUserActiveUpdates, 
  IUserColorUpdates,
  IUserTasksheetSubscriptionUpdates
} from '@/state/user/types'

//-----------------------------------------------------------------------------
// User
//-----------------------------------------------------------------------------
export const updateUser = async (userId: IUser['id'], updates: IUserUpdates) => {
	return axios.patch('/app/user/' + userId, updates)
}

export const updateUserActive = async (id: string, updates: IUserActiveUpdates) => {
	return axios.patch('/app/user/active/' + id, updates).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const updateUserColor = async (id: string, updates: IUserColorUpdates) => {
	return axios.patch('/app/user/color/' + id, updates).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const updateUserPassword = async (id: IUser['id'], currentPassword: string, newPassword: string) => {
	return axios.post('/app/user/password/' + id, { currentPassword, newPassword })
}

export const updateUserSubscription = async (id: string, updates: IUserTasksheetSubscriptionUpdates) => {
	return axios.patch('/app/user/subscription/' + id, updates).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

//-----------------------------------------------------------------------------
// File
//-----------------------------------------------------------------------------
export const createFile = async (newFile: IFile) => {
	return axios.post('/app/files', newFile)
}

export const createFilePermission = async (fileId: IFile['id'], email: string, role: IFilePermission['role']) => {
	return axios.post('/app/files/permissions', { fileId: fileId, email: email, role: role })
}

export const deleteFile = async (fileId: string) => {
	return axios.delete('/app/files/' + fileId).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const deleteFilePermission = async (filePermissionId: IFilePermission['id']) => {
	return axios.delete('/app/files/permissions/' + filePermissionId)
}

export const updateFilePermission = async (id: string, updates: IFilePermissionUpdates) => {
	return axios.patch('/app/files/permissions/' + id, updates).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const restoreFile = async (fileId: string) => {
	return axios.post('/app/files/restore/' + fileId).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const updateFile = async (id: string, updates: IFileUpdates) => {
	return axios.patch('/app/files/' + id, updates).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

//-----------------------------------------------------------------------------
// Folder
//-----------------------------------------------------------------------------
export const createFolder = async (newFolder: IFolder) => {
	return axios.post('/app/folders', newFolder)
}

export const createFolderPermission = async (folderId: IFolder['id'], email: string, role: IFolderPermission['role']) => {
	return axios.post('/app/folders/permissions', { folderId: folderId, email: email, role: role })
}

export const updateFolder = async (id: string, updates: IFolderUpdates) => {
	return axios.patch('/app/folders/' + id, updates).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const updateFolderPermission = async (id: string, updates: IFolderPermissionUpdates) => {
	return axios.patch('/app/folders/permissions/' + id, updates).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const deleteFolder = async (folderId: string) => {
	return axios.delete('/app/folders/' + folderId).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const deleteFolderPermission = async (folderPermissionId: IFolderPermission['id']) => {
	return axios.delete('/app/folders/permissions/' + folderPermissionId)
}

export const restoreFolder = async (folderId: string) => {
	return axios.post('/app/folders/restore/' + folderId).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

//-----------------------------------------------------------------------------
// Sheet
//-----------------------------------------------------------------------------
export const createSheet = async (newSheetId: ISheet['id']) => {
	return axios.post('/app/sheets', {
    newSheetId: newSheetId,
  }).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const createSheetFromCsv = async (newSheetId: ISheet['id'], fileToUpload: File) => {
  const formData = new FormData()
  formData.append('newSheetId', newSheetId)
  formData.append('fileToUpload', fileToUpload)
	return axios.post('/app/sheets/upload/csv', formData).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const updateSheet = async (id: string, updates: ISheetUpdates) => {
	return axios.patch('/app/sheets/' + id, updates).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const updateSheetCell = async (id: string, updates: ISheetCellUpdates) => {
	return axios.patch('/app/sheets/cells/' + id, updates).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const updateSheetCells = async (updates: ISheetCellUpdates[]) => {
	return axios.patch('/app/sheets/cells/batch/update', updates).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const createSheetCellFile = async (
  sheetId: ISheet['id'], 
  sheetCellId: ISheetCell['id'],
  filename: string,
  s3PresignedUrlData: IS3PresignedUrlData,
  uploadedAt: string
) => {
	return axios.post('/app/sheets/cells/files/upload', { sheetId, sheetCellId, filename, s3PresignedUrlData, uploadedAt }).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const deleteSheetCellFile = async (sheetCellFileId: string) => {
	return axios.delete('/app/sheets/cells/files/' + sheetCellFileId).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const downloadSheetCellFile = async (sheetCellFileId: string) => {
	return axios.post('/app/sheets/cells/files/download/' + sheetCellFileId)
}

export const createSheetGantt = async (newSheetGantt: ISheetGantt, newSheetGanttRanges: ISheetGanttRange[]) => {
	return axios.post('/app/sheets/gantts', { newSheetGantt, newSheetGanttRanges })
}

export const deleteSheetGantts = async (sheetGanttIds: ISheetGantt['id'][]) => {
	return axios.post('/app/sheets/gantts/delete', { sheetGanttIds })
}

export const restoreSheetGantts = async (sheetGanttIds: ISheetGantt['id'][]) => {
	return axios.post('/app/sheets/gantts/restore', { sheetGanttIds })
}

export const updateSheetGantt = async (sheetGanttId: ISheetGantt['id'], updates: ISheetGanttUpdates) => {
	return axios.patch('/app/sheets/gantts/' + sheetGanttId, updates)
}

export const createSheetGanttRanges = async (newSheetGanttRanges: ISheetGanttRange[]) => {
	return axios.post('/app/sheets/gantts/ranges', { newSheetGanttRanges })
}

export const deleteSheetGanttRanges = async (sheetGanttRangeIds: ISheetGanttRange['id'][]) => {
	return axios.post('/app/sheets/gantts/ranges/delete', { sheetGanttRangeIds })
}

export const restoreSheetGanttRanges = async (sheetGanttRangeIds: ISheetGanttRange['id'][]) => {
	return axios.post('/app/sheets/gantts/ranges/restore', { sheetGanttRangeIds })
}

export const updateSheetGanttRange = async (sheetGanttRangeId: ISheetGanttRange['id'], updates: ISheetGanttRangeUpdates) => {
	return axios.patch('/app/sheets/gantts/ranges/' + sheetGanttRangeId, updates)
}

export const createSheetCellLabels = async (newSheetCellLabels: ISheetLabel[]) => {
	return axios.post('/app/sheets/cells/labels', { newSheetCellLabels })
}

export const deleteSheetCellLabels = async (sheetCellLabelIds: ISheetLabel['id'][]) => {
	return axios.post('/app/sheets/cells/labels/delete', { sheetCellLabelIds })
}

export const restoreSheetCellLabels = async (sheetCellLabelIds: ISheetLabel['id'][]) => {
	return axios.post('/app/sheets/cells/labels/restore', { sheetCellLabelIds })
}

export const createSheetCellPhoto = async (
  sheetId: ISheet['id'], 
  sheetCellId: ISheetCell['id'],
  filename: string,
  s3PresignedUrlData: IS3PresignedUrlData,
  uploadedAt: string
) => {
	return axios.post('/app/sheets/cells/photos/upload', { sheetId, sheetCellId, filename, s3PresignedUrlData, uploadedAt }).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const deleteSheetCellPhoto = async (sheetCellPhotoId: string) => {
	return axios.delete('/app/sheets/cells/photos/' + sheetCellPhotoId).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const createSheetCellChange = async (newSheetChange: ISheetChange) => {
	return axios.post('/app/sheets/cells/changes', newSheetChange).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const deleteSheetCellChange = async (sheetCellChangeId: string) => {
	return axios.delete('/app/sheets/cells/changes/' + sheetCellChangeId).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const createSheetColumns = async (
  newColumns: ISheetColumn[], 
  newCells: ISheetCell[]
) => {
	return axios.post('/app/sheets/columns', {
    newColumns,
    newCells
  })
}

export const deleteSheetColumns = async (
	columnIds: ISheetColumn['id'][]
) => {
	return axios.post('/app/sheets/columns/delete', {
		columnIds
	})
}

export const restoreSheetColumns = async (
	columnIds: ISheetColumn['id'][]
) => {
	return axios.post('/app/sheets/columns/restore', { 
		columnIds 
	})
}

export const updateSheetColumn = async (id: string, updates: ISheetColumnUpdates) => {
	return axios.patch('/app/sheets/columns/' + id, updates).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const createSheetFilter = async (filter: ISheetFilter) => {
	return axios.post('/app/sheets/filters', filter).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const deleteSheetFilter = async (filterId: string) => {
	return axios.delete('/app/sheets/filters/' + filterId).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const restoreSheetFilter = async (filterId: ISheetFilter['id']) => {
	return axios.post('/app/sheets/filters/restore/' + filterId).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const createSheetGroup = async (group: ISheetGroup) => {
	return axios.post('/app/sheets/groups', group).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const deleteSheetGroup = async (groupId: string) => {
	return axios.delete('/app/sheets/groups/' + groupId).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const restoreSheetGroup = async (groupId: ISheetGroup['id']) => {
	return axios.post('/app/sheets/groups/restore/' + groupId).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const updateSheetGroup = async (id: string, updates: ISheetGroupUpdates) => {
	return axios.patch('/app/sheets/groups/' + id, updates).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const createSheetRows = async (newRows: ISheetRowToDatabase[]) => {
	return axios.post('/app/sheets/rows', newRows).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const deleteSheetRow = async (rowId: string) => {
	return axios.delete('/app/sheets/rows/' + rowId).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const deleteSheetRows = async (rowIds: string[]) => {
	return axios.post('/app/sheets/rows/batch/delete', rowIds).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const restoreSheetRows = async (rowIds: ISheetRow['id'][], cellIds: ISheetCell['id'][]) => {
	return axios.post('/app/sheets/rows/restore', {
    rowIds,
    cellIds
  }).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const createSheetSort = async (sort: ISheetSort) => {
	return axios.post('/app/sheets/sorts', sort).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const deleteSheetSort = async (sortId: string) => {
	return axios.delete('/app/sheets/sorts/' + sortId).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const restoreSheetSort = async (sortId: ISheetSort['id']) => {
	return axios.post('/app/sheets/sorts/restore/' + sortId).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const updateSheetSort = async (id: string, updates: ISheetSortUpdates) => {
	return axios.patch('/app/sheets/sorts/' + id, updates).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const updateSheetStyles = async (id: string, updates: ISheetStylesDatabaseUpdates) => {
	return axios.patch('/app/sheets/styles/' + id, updates).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const createSheetLink = async (newSheetLink: ISheetLinkToDatabase) => {
	return axios.post('/app/sheets/links', newSheetLink).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const createSheetView = async (newSheetView: ISheetViewToDatabase) => {
	return axios.post('/app/sheets/views', newSheetView).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const updateSheetView = async (id: string, updates: ISheetViewUpdates) => {
	return axios.patch('/app/sheets/views/' + id, updates).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const deleteSheetView = async (sheetViewId: string) => {
	return axios.delete('/app/sheets/views/' + sheetViewId).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const resetSheetView = async (sheetId: string) => {
	return axios.post('/app/sheets/views/reset/' + sheetId).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const restoreSheetView = async (sheetViewId: string) => {
	return axios.post('/app/sheets/views/restore/' + sheetViewId).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const createSheetPriority = async (priority: ISheetPriority) => {
	return axios.post('/app/sheets/priorities', priority).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const deleteSheetPriority = async (sheetPriorityId: string) => {
	return axios.delete('/app/sheets/priorities/' + sheetPriorityId).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const updateSheetPriority = async (id: string, updates: ISheetPriorityUpdates) => {
	return axios.patch('/app/sheets/priorities/' + id, updates).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const createSheetCellPriorities = async (sheetCellPriorities: ISheetCellPriority[]) => {
	return axios.post('/app/sheets/cells/priorities', sheetCellPriorities).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const deleteSheetCellPriorities = async (sheetCellPriorityIdsToDelete: ISheetCellPriority['id'][]) => {
	return axios.post('/app/sheets/cells/priorities/delete', sheetCellPriorityIdsToDelete).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

export const restoreSheetCellPriorities = async (sheetCellPriorityIds: ISheetCellPriority['id'][]) => {
	return axios.post('/app/sheets/cells/priorities/restore', {
    sheetCellPriorityIds
  }).then(response => {
		return response.data
	}).catch(console.log.bind(console))
}

