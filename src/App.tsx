import { useSelector } from 'react-redux'
import './App.scss'
import Home from './Pages/home/Home'
import { MyStore } from './store/store'
import AlertToast from './components/AlertToast/AlertToast'

function App() {
  const showToastMessage = useSelector((store: MyStore) => store.app.showToastMessage)

  return (
    <div className="app">
      {showToastMessage && <AlertToast />}
      <Home />
    </div>
  )
}

export default App
