//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export const useSelector= (state: IAppState) => {
  console.log('mockUseSelector')
  return state
}