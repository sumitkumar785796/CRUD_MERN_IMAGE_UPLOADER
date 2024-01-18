import React from 'react'
import Nav from './Nav'

const Index = () => {
    const myStyle ={
        position: 'relative', 
        width: '100vw', 
        height: '100vh', 
        background: `url('crud.png') center/cover no-repeat`,
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff', 
        fontSize: '24px'
    }
  return (
    <>
    <Nav/>
    <div className="container" style={myStyle}>
    </div>
    </>
  )
}

export default Index