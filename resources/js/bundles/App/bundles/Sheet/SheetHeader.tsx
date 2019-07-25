//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useState } from 'react'
import styled from 'styled-components'

import { Column } from '@app/state/sheet/types'

import SheetHeaderContextMenu from '@app/bundles/ContextMenu/SheetHeaderContextMenu'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetHeader = ({
  column: {
    name,
    width
  }
}: SheetHeaderProps) => {

  const [ isContextMenuVisible, setIsContextMenuVisible ] = useState(false)
  const [ contextMenuTop, setContextMenuTop ] = useState(null)
  const [ contextMenuLeft, setContextMenuLeft ] = useState(null)

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    setContextMenuTop(e.clientY)
    setContextMenuLeft(e.clientX)
    setIsContextMenuVisible(true)
  }

  return (
    <Container
      containerWidth={width}
      isContextMenuVisible={isContextMenuVisible}
      onContextMenu={(e: MouseEvent) => handleContextMenu(e)}>
      {name}
    {isContextMenuVisible && 
      <SheetHeaderContextMenu
        contextMenuTop={contextMenuTop}
        contextMenuLeft={contextMenuLeft}
        closeContextMenu={() => setIsContextMenuVisible(false)}/>}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetHeaderProps {
  column: Column
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: inline-block;
  overflow: auto;
  z-index: ${ ({ isContextMenuVisible }: ContainerProps ) => isContextMenuVisible ? '100' : '50'};
  width: ${ ({ containerWidth }: ContainerProps ) => containerWidth + 'px'};
  height: 3.5vh;
  line-height: 3.5vh;
  padding: 0 0.25rem;
  text-align: left;
  background-color: rgb(250, 250, 250);
  box-shadow: 0px 1px 0px 0px rgba(180,180,180,1);
  font-size: 1.75vh;
  font-weight: bold;
`
interface ContainerProps {
  containerWidth: number
  isContextMenuVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetHeader