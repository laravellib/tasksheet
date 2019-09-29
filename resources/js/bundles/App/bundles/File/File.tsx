//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@app/state'
import { selectFile } from '@app/state/folder/selectors'
import { IFile } from '@app/state/folder/types'

import Sheet from '@app/bundles/Sheet/Sheet'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: IAppState, props: FileProps) => ({
  file: selectFile(props.fileId, state)
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const File = ({
  file
}: FileProps) => {

  const fileComponents = {
    SHEET: Sheet,
    SHEET_VIEW: Sheet
  }
  const FileComponent = file ? fileComponents[file.type] : null

  return (
    <Container>
      {file 
        ? <FileComponent 
            fileId={file.id}
            id={file.typeId}/>
        : 'Please select a sheet to get started'}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FileProps {
  file?: IFile
  fileId: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(230, 230, 230);
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps
)(File)
