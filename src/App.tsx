import { Provider } from 'react-redux'
import './App.scss'
import Home from './Pages/home/Home'
import store from './store/store'

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <Home />
      </div>
    </Provider>
  )
}

export default App
