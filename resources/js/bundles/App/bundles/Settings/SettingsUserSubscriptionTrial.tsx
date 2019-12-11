//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@app/state'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserSubscriptionTrial = () => {
  
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)
  const userSubscriptionEndDate = useSelector((state: IAppState) => state.user.subscription.endDate)

  const [ activeUserSubscriptionSelection, setActiveUserSubscriptionSelection ] = useState(null as 'MONTHLY' | 'LIFETIME')
  
  return (
    <Container>
      <ExpirationDate>
        Your 30-day free trial expires on <b>{moment(userSubscriptionEndDate).format('MMMM Do, YYYY')}.</b>
        <br/><br/>
        Please choose a plan: 
      </ExpirationDate>
      <SubscriptionTypesContainer>
        <SubscriptionType
          isSelected={activeUserSubscriptionSelection === 'MONTHLY'}
          onClick={() => setActiveUserSubscriptionSelection('MONTHLY')}
          userColorPrimary={userColorPrimary}>
          <SubscriptionTypeHeader>
            Monthly
          </SubscriptionTypeHeader>
          <SubscriptionTypePrice>
            $5
          </SubscriptionTypePrice>
          <Divider />
          <SubscriptionTypeDescription>
            Billed on the 1st of every month, your first billing would occur on <b>{moment().add(2, 'month').startOf('month').format('MMMM Do, YYYY')}</b>.
          </SubscriptionTypeDescription>
        </SubscriptionType>
        <SubscriptionType
          isSelected={activeUserSubscriptionSelection === 'LIFETIME'}
          onClick={() => setActiveUserSubscriptionSelection('LIFETIME')}
          userColorPrimary={userColorPrimary}>
          <SubscriptionTypeHeader>
            Lifetime
          </SubscriptionTypeHeader>
          <SubscriptionTypePrice>
            $100
          </SubscriptionTypePrice>
          <Divider />
          <SubscriptionTypeDescription>
            Billed immediately, you'll have access to Tasksheet and all of its features forever.
          </SubscriptionTypeDescription>
        </SubscriptionType>
      </SubscriptionTypesContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

const ExpirationDate = styled.div``

const SubscriptionTypesContainer = styled.div`
  margin-top: 0.5rem;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`

const SubscriptionType = styled.div`
  cursor: pointer;
  margin-right: 0.5rem;
  padding: 0.5rem 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 1px solid rgb(150, 150, 150);
  background-color: ${ ({ isSelected, userColorPrimary }: ISubscriptionType) => isSelected ? userColorPrimary : 'rgb(255, 255, 255)' };
  color: ${ ({ isSelected }: ISubscriptionType) => isSelected ? 'white' : 'inherit' };
  &:hover {
    background-color: ${ ({ userColorPrimary }: ISubscriptionType) => userColorPrimary };
    color: white;
  }
`
interface ISubscriptionType {
  isSelected: boolean
  userColorPrimary: string
}

const SubscriptionTypeHeader = styled.div``

const Divider = styled.div`
  margin: 0.5rem 0;
  width: 60%;
  height: 1px;
  background-color: rgb(150, 150, 150);
`

const SubscriptionTypePrice = styled.div`
  font-size: 1rem;
  font-weight: bold;
`

const SubscriptionTypeDescription = styled.div`
  width: 10rem;
  text-align: justify;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUserSubscriptionTrial
