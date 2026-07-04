import { useSelector } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.scss'
import Home from './Pages/home/Home'
import RagaDetails from './Pages/raga-details/RagaDetails'
import { MyStore } from './store/store'
import AlertToast from './components/AlertToast/AlertToast'

function App() {
  const showToastMessage = useSelector((store: MyStore) => store.app.showToastMessage)

  return (
    <BrowserRouter>
      <div className="app">
        {showToastMessage && <AlertToast />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/raga/:ragaName" element={<RagaDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
