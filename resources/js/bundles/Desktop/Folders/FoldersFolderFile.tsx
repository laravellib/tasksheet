//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { SHEET, SHEET_VIEW } from '@/assets/icons'

import { IThunkDispatch } from '@/state/types'
import { 
  IFile, IFileUpdates,
  IFolderClipboardUpdates, 
} from '@/state/folder/types'
import { 
  deleteFile as deleteFileAction,
  updateClipboard as updateClipboardAction, 
  updateFile as updateFileAction,
} from '@/state/folder/actions'

import AutosizeInput from 'react-input-autosize'
import FileContextMenu from '@desktop/ContextMenu/FileContextMenu'
import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapDispatchToProps = (dispatch: IThunkDispatch) => ({
  deleteFile: (fileId: string) => dispatch(deleteFileAction(fileId)),
  updateClipboard: (updates: IFolderClipboardUpdates) => dispatch(updateClipboardAction(updates)),
  updateFile: (fileId: string, updates: IFileUpdates) => dispatch(updateFileAction(fileId, updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersFolderFile = ({
  deleteFile,
  file,
  handleFileOpen,
  updateClipboard,
  updateFile
}: FoldersFolderFileProps) => {
  
  const [ isContextMenuVisible, setIsContextMenuVisible ] = useState(false)
  const [ contextMenuTop, setContextMenuTop ] = useState(null)
  const [ contextMenuLeft, setContextMenuLeft ] = useState(null)
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    setIsContextMenuVisible(true)
    setContextMenuTop(e.clientY)
    setContextMenuLeft(e.clientX)
  }

  const [ isRenaming, setIsRenaming ] = useState(file.name === null)
  const [ fileName, setFileName ] = useState(file.name)
  const handleAutosizeInputBlur = () => {
    if(fileName !== null) {
      setIsRenaming(false)
      updateFile(file.id, { name: fileName })
    }
  }

  const blurAutosizeInputOnEnter = (e: KeyboardEvent) => {
    if(e.key === "Enter") {
      handleAutosizeInputBlur()
    }
  }
  useEffect(() => {
    if(isRenaming) {
      addEventListener('keypress', blurAutosizeInputOnEnter)
    }
    else {
      removeEventListener('keypress', blurAutosizeInputOnEnter)
    }
    return () => removeEventListener('keypress', blurAutosizeInputOnEnter)
  })

  return (
    <>
      <Container
        isPreventedFromSelecting={file.isPreventedFromSelecting}
        onContextMenu={e => handleContextMenu(e)}
        onDoubleClick={() => { if(!file.isPreventedFromSelecting) { handleFileOpen(file.id) }}}>
        <IconContainer
          isFile>
          <Icon icon={file.type === 'SHEET' ? SHEET : SHEET_VIEW} size='0.95rem'/>
        </IconContainer>
        {!isRenaming
          ? <NameContainer
              isPreventedFromSelecting={file.isPreventedFromSelecting}>
              {file.name}
            </NameContainer>
          : <AutosizeInput
              autoFocus
              placeholder="Name..."
              onChange={e => setFileName(e.target.value)}
              onBlur={() => handleAutosizeInputBlur()}
              value={fileName === null ? "" : fileName}
              inputStyle={{
                margin: '0',
                padding: '0.05rem',
                paddingLeft: '1px',
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: 'transparent',
                color: 'black',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                fontWeight: 'inherit'}}/>
        }
      </Container>
      {isContextMenuVisible && 
        <FileContextMenu
          fileId={file.id}
          closeContextMenu={() => setIsContextMenuVisible(false)}
          contextMenuLeft={contextMenuLeft}
          contextMenuTop={contextMenuTop}
          deleteFile={deleteFile}
          updateClipboard={updateClipboard}
          setIsRenaming={setIsRenaming}/>
      }
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FoldersFolderFileProps {
  deleteFile(fileId: string): void
  file: IFile
  handleFileOpen(nextActiveTabId: string): void
  updateClipboard(updates: IFolderClipboardUpdates): void
  updateFile(fileId: string, updates: IFileUpdates): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
interface ContainerProps {
  isPreventedFromSelecting: boolean
}

const Container = styled.div`
  justify-content: flex-start;
  cursor: ${ ({ isPreventedFromSelecting }: ContainerProps ) => isPreventedFromSelecting ? 'not-allowed' : 'default' };
  width: 100%;
  padding: 0.125rem 0 0.125rem 0.325rem;
  display: flex;
  align-items: center;
  background-color: transparent;
  color: rgb(20, 20, 20);
  &:hover {
    background-color: rgb(235, 235, 235);
  }
`

const NameContainer = styled.div`
  padding: 0.05rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${ ({ isPreventedFromSelecting }: NameContainerProps ) => isPreventedFromSelecting ? 'rgb(150, 150, 150)' : null};
`
interface NameContainerProps {
  isPreventedFromSelecting: boolean
}

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${ ({ isFile }: IconProps) => isFile ? '0.4rem' : '0' };
  margin-left: ${ ({ isFile }: IconProps) => isFile ? '0.2rem' : '0' };
`
interface IconProps {
  isFile?: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  null,
  mapDispatchToProps
)(FoldersFolderFile)