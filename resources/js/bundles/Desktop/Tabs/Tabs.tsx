//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { FOLDER, USER } from '@/assets/icons'

import { IAppState } from '@/state'
import {
  closeTab,
  openFileInNewTab,
  updateActiveTab 
} from '@/state/tab/actions'

import File from '@desktop/File/File'
import Folders from '@desktop/Folders/Folders'
import Icon from '@/components/Icon'
import Settings from '@desktop/Settings/Settings'
import Tab from '@desktop/Tabs/Tab'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Tabs = () => {

  // Redux
  const dispatch = useDispatch()

  const activeTab = useSelector((state: IAppState) => state.tab.activeTab)
  const tabs = useSelector((state: IAppState) => state.tab.tabs)
  const userSubscriptionType = useSelector((state: IAppState) => state.user.tasksheetSubscription.type)

  // Local state
  const [ localActiveTab, setLocalActiveTab ] = useState(activeTab)
  const [ localTabs, setLocalTabs ] = useState(tabs)
  
  // Effects
  useEffect(() => {
    setLocalActiveTab(activeTab || 'FOLDERS')
  }, [ activeTab ])

  useLayoutEffect(() => {
    setLocalTabs(tabs)
  }, [ tabs ])

  // Handle file open
  const handleFileOpen = (nextActiveTab: string) => {
    setLocalActiveTab(nextActiveTab)
    tabs.includes(nextActiveTab)
      ? setTimeout(() => dispatch(updateActiveTab(nextActiveTab)), 10)
      : !['FOLDERS', 'SETTINGS'].includes(nextActiveTab)
        ? (
            setLocalTabs([ ...localTabs, nextActiveTab]),
            setTimeout(() => dispatch(openFileInNewTab(nextActiveTab)), 10)
          )
        : (
            setLocalActiveTab(nextActiveTab),
            setTimeout(() => dispatch(updateActiveTab(nextActiveTab)), 10)
          )
  }

  // Render
  return (
    <Container>
      <TabsContainer>
        {localTabs.map((fileId) => (
          <Tab
            key={fileId}
            fileId={fileId}
            isActiveTab={localActiveTab === fileId}
            closeTab={fileId => dispatch(closeTab(fileId))}
            handleTabClick={handleFileOpen}/>))
        }
        <MiniTab
          isActiveTab={localActiveTab === 'FOLDERS'}
          onClick={() => handleFileOpen('FOLDERS')}>
          <Icon
            icon={FOLDER}
            size="0.85rem"/>
        </MiniTab>
        {userSubscriptionType !== 'DEMO' &&
          <MiniTab
            isActiveTab={localActiveTab === 'SETTINGS'}
            onClick={() => handleFileOpen('SETTINGS')}>
            <Icon
              icon={USER}
              size="0.825rem"/>
          </MiniTab>
        }
      </TabsContainer>
      <FilesContainer>
        {localTabs.map((fileId) => (
          <FileContainer
            key={fileId}
            isActiveTab={localActiveTab === fileId}>
            <File
              fileId={fileId}/>
          </FileContainer>))
        }
        <Folders
          handleFileOpen={handleFileOpen}
          isActiveTab={localActiveTab === 'FOLDERS'}/>
        {localActiveTab === 'SETTINGS' && <Settings />}
      </FilesContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 1;
  position: fixed;
  top: 0;
  left: 2px;
  width: 100%;
  height: 100%;
`

const TabsContainer = styled.div`
  z-index: 2;
  position: relative;
  width: 100%;
  display: flex;
  align-items: flex-end;
`

const MiniTab = styled.div`
  cursor: default;
  margin-top: 0.2rem;
  height: 1.3rem;
  padding: 0.3rem;
  margin-right: 1px;
  background-color: rgb(240,240,240);
  color: rgb(80, 80, 80);
  border-radius: 4px 4px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${ ({ isActiveTab }: MiniTabProps) => isActiveTab ? '1' : '0.75'};
`
interface MiniTabProps {
  isActiveTab: boolean
}

const FilesContainer = styled.div`
  z-index: 1;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgb(240,240,240);
  box-shadow: -1px 0px 10px 0px rgba(0,0,0,0.5);
`

const FileContainer = styled.div`
  position: relative;
  display: ${ ({ isActiveTab }: FileContainerProps) => isActiveTab ? 'block' : 'none' };
  width: 100%;
  height: 100%;
`
interface FileContainerProps {
  isActiveTab: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default Tabs