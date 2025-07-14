import { Provider } from 'react-redux'

import store from './store'

type ReduxStoreWrapperProps = {
  devMode?: boolean
  clearAppState?: boolean
  children: React.ReactNode
}

const ReduxStoreWrapper = (props: ReduxStoreWrapperProps) => {
  const { children } = props

  return <Provider store={store}>{children}</Provider>
}

export default ReduxStoreWrapper
