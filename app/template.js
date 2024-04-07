import React from 'react'
import MainLayoutWrapper from './components/MainLayoutWrapper'

const template = ({children}) => {
  return (
    <MainLayoutWrapper>
      {children}
    </MainLayoutWrapper>
  )
}

export default template
