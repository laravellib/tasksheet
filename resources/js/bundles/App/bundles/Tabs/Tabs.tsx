//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { selectActiveTabId, selectTabs } from '@app/state/tab/selectors'
import {  
  selectUserLayoutSidebarWidth, 
  selectUserLayoutTabsHeight, 
} from '@app/state/user/selectors'

import File from '@app/bundles/File/File'
import Tab from '@app/bundles/Tabs/Tab'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  activeTabId: selectActiveTabId(state),
  tabs: selectTabs(state),
  userLayoutSidebarWidth: selectUserLayoutSidebarWidth(state),
  userLayoutTabsHeight: selectUserLayoutTabsHeight(state)
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Tabs = ({ 
  activeTabId,
  tabs,
  userLayoutSidebarWidth,
  userLayoutTabsHeight,
}: TabsProps) => {
  return (
    <Container 
      sidebarWidth={userLayoutSidebarWidth}>
      <TabsContainer
        tabsHeight={userLayoutTabsHeight}>
        {tabs.length > 0 
          ? tabs.map((fileId) => (
            <Tab
              key={fileId}
              fileId={fileId}
              isActiveTab={activeTabId === fileId}/>))
          : <Tab
              fileId={null}
              isActiveTab />
        }
      </TabsContainer>
      <FilesContainer
        tabsHeight={userLayoutTabsHeight}>
        {tabs.length > 0 
          ? tabs.map((fileId) => (
            <FileContainer
              key={fileId}
              isActiveTab={activeTabId === fileId}>
              <File
                fileId={fileId}/>
            </FileContainer>))
          : <File
               fileId={null}/>
        }
      </FilesContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface TabsProps {
  activeTabId: string
  tabs: string[]
  userLayoutSidebarWidth: number
  userLayoutTabsHeight: number
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 1;
  position: fixed;
  top: 0;
  left: ${ ({ sidebarWidth }: ContainerProps) => (sidebarWidth * 100) + 'vw'};
  width: calc(100vw - ${ ({ sidebarWidth }: ContainerProps) => (sidebarWidth * 100) + 'vw'});
`
interface ContainerProps {
  sidebarWidth: number
}

const TabsContainer = styled.div`
  z-index: 2;
  position: relative;
  width: 100%;
  display: flex;
  height: ${ ({ tabsHeight }: TabsContainerProps) => (tabsHeight * 100) + 'vh'};
  align-items: center;
`
interface TabsContainerProps {
  tabsHeight: number
}

const FilesContainer = styled.div`
  z-index: 1;
  position: relative;
  width: 100%;
  height: calc(100vh - ${ ({ tabsHeight }: FilesContainerProps) => (tabsHeight * 100) + 'vh'});
  background-color: white;
  box-shadow: -1px 0px 10px 0px rgba(0,0,0,0.5);
`
interface FilesContainerProps {
  tabsHeight: number
}

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
export default connect(
  mapStateToProps
)(Tabs)
