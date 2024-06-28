import { Provider } from 'react-redux'
import './App.scss'
import Home from './Pages/home/Home'
import store from './store/store'
import AlertToast from './components/AlertToast/AlertToast'

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        {/* <AlertToast /> */}
        <Home />
      </div>
    </Provider>
  )
}

export default App
