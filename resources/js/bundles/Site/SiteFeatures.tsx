//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import SiteFeaturesFeature from '@site/SiteFeaturesFeature'
import SiteFeaturesList from '@site/SiteFeaturesList'
import SiteFeaturesListItem from '@site/SiteFeaturesListItem'
import SiteFeaturesActionButton from '@site/SiteFeaturesActionButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SiteFeatures = ({
  setIsLoginOrRegister
}: ISiteFeatures) => {
  
  const handleActionButtonClick = () => {
    setIsLoginOrRegister('REGISTER')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  return (
    <Container>
      <SiteFeaturesFeature
        image={tasksheet.assetUrl + 'images/background.png'}>
        <SiteFeaturesList
          header="A format you're already familiar with...">
          <SiteFeaturesListItem>
            Anyone familiar with Microsoft Excel, Google Sheets or any other spreadsheet app can jump right in to using Tasksheet - with little or no training needed.
          </SiteFeaturesListItem>
          <SiteFeaturesListItem>
            <SiteFeaturesActionButton
              onClick={() => handleActionButtonClick()}/>
          </SiteFeaturesListItem>
        </SiteFeaturesList>
      </SiteFeaturesFeature>
      <SiteFeaturesFeature
        backgroundColor="rgb(240, 240, 240)"
        image={tasksheet.assetUrl + 'images/background.png'}
        imageFirst>
        <SiteFeaturesList
          header="...with powerful new features that make managing your teams a breeze">
          <SiteFeaturesListItem>
            Save photos and files. Take notes and track changes to your sheet over time. Add dates and create Gantt charts. Save custom views for quick access later. And much, much more.
            <br/><br/>
            We've built Tasksheet and its features to be quick and easy to use, so you can spend your time focusing on doing your work, not organizing your work.
          </SiteFeaturesListItem>
          <SiteFeaturesListItem>
            <SiteFeaturesActionButton
              onClick={() => handleActionButtonClick()}
              text="Check it out"/>
          </SiteFeaturesListItem>
        </SiteFeaturesList>
      </SiteFeaturesFeature>
      <SiteFeaturesFeature
        image={tasksheet.assetUrl + 'images/background.png'}>
        <SiteFeaturesList
          header="Empower your team">
          <SiteFeaturesListItem>
            With the ability to save custom views for quick access, every member of your team can see the exact level of detail they need - no matter their role or their current task at hand.
          </SiteFeaturesListItem>
          <SiteFeaturesListItem>
            <SiteFeaturesActionButton
              onClick={() => handleActionButtonClick()}
              text="Sign up now"/>
          </SiteFeaturesListItem>
        </SiteFeaturesList>
      </SiteFeaturesFeature>
      <SiteFeaturesFeature
        backgroundColor="rgb(240, 240, 240)"
        image={tasksheet.assetUrl + 'images/background.png'}
        imageFirst>
        <SiteFeaturesList
          header="Endlessly customizable">
          <SiteFeaturesListItem>
            Don't modify your existing workflow to fit your task management app. Instead, Tasksheet is designed to fit your needs, no matter what they are. With an exhaustive library of cell types and powerful customization built into all of them, Tasksheet can be molded to fit any workflow.
          </SiteFeaturesListItem>
          <SiteFeaturesListItem>
            <SiteFeaturesActionButton
              onClick={() => handleActionButtonClick()}
              text="Give it a shot"/>
          </SiteFeaturesListItem>
        </SiteFeaturesList>
      </SiteFeaturesFeature>
      <SiteFeaturesFeature
        image={tasksheet.assetUrl + 'images/background.png'}>
        <SiteFeaturesList
          header="More than just tasks">
          <SiteFeaturesListItem>
            We built Tasksheet with tasks in mind, but we think it's pretty darn useful for just about anything else as well. We've seen it used to manage inventory, track files through approval processes, review analytics and much, much more.
          </SiteFeaturesListItem>
          <SiteFeaturesListItem>
            <SiteFeaturesActionButton
              onClick={() => handleActionButtonClick()}
              text="Let's explore"/>
          </SiteFeaturesListItem>
        </SiteFeaturesList>
      </SiteFeaturesFeature>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISiteFeatures {
  setIsLoginOrRegister(nextLoginOrRegister: 'LOGIN' | 'REGISTER'): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

export default SiteFeatures
