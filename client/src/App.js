import React from 'react'
import Index from './Components/Index'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Insert from './Components/Insert'
import Update from './Components/Update'
import View from './Components/View'
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Index/>} />
          <Route path='/insert' element={<Insert/>} />
          <Route path='/update/:id' element={<Update/>} />
          <Route path='/view' element={<View/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App