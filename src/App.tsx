import { Provider } from 'react-redux'
import './App.scss'
import Home from './Pages/home/Home'
import store from './store/store'
import AlertToast from './components/AlertToast/AlertToast'
import { useEffect } from 'react'
import { db } from './firebase'
import { onValue, ref, set } from 'firebase/database'

function App() {
  useEffect(() => {
    abc()
  }, [])

  const abc = async () => {
    try {
      set(ref(db, 'users' + '/1'), {
        name: "Ganesha S"
      });


      ///////////////////////////////////////////////////
      const starCountRef = ref(db, 'users/' + 2);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
      });
      ///////////////////////////////////////////////////////////

    } catch (e) {
      console.log("Error", e);
    }
  }

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
