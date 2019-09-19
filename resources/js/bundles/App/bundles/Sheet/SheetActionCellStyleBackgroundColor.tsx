//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BACKGROUND_COLOR } from '@app/assets/icons'

import { AppState } from '@app/state'
import { Sheet } from '@app/state/sheet/types'
import {
  updateSheet
} from '@app/state/sheet/actions'

import SheetActionCellStyleColorPicker from '@app/bundles/Sheet/SheetActionCellStyleColorPicker'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCellStyleBackgroundColor = ({
  sheetId
}: SheetActionCellStyleBackgroundColorProps) => {
  
  const dispatch = useDispatch()
  
  const sheetStyles = useSelector((state: AppState) => state.sheet.sheets && state.sheet.sheets[sheetId] && state.sheet.sheets[sheetId].styles)
  
  const updateSheetStylesSet = (nextSheetStylesSet: Set<string>) => {
    dispatch(updateSheet(sheetId, { styles: {
      ...sheetStyles,
      BACKGROUND_COLOR: nextSheetStylesSet 
    }}))
  }

  return (
    <SheetActionCellStyleColorPicker
      sheetId={sheetId}
      icon={BACKGROUND_COLOR}
      sheetStylesSet={sheetStyles && sheetStyles.BACKGROUND_COLOR}
      updateSheetStylesSet={updateSheetStylesSet}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionCellStyleBackgroundColorProps {
  sheetId: Sheet['id']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCellStyleBackgroundColor
