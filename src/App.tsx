import { useSelector, useDispatch } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.scss'
import Home from './Pages/home/Home'
import RagaDetails from './Pages/raga-details/RagaDetails'
import Profile from './Pages/profile/Profile'
import { MyStore } from './store/store'
import AlertToast from './components/AlertToast/AlertToast'
import YouTubePlayer from './components/youtube-player/YouTubePlayer'
import { closeVideoPlayer } from './store/slices/app-slice'

function App() {
  const showToastMessage = useSelector((store: MyStore) => store.app.showToastMessage)
  const { videoId, title, raga, tala, type } = useSelector((store: MyStore) => store.app.videoPlayer)
  const dispatch = useDispatch()

  return (
    <BrowserRouter>
      <div className="app">
        {showToastMessage && <AlertToast />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/raga/:ragaName" element={<RagaDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        {videoId && (
          <YouTubePlayer
            videoId={videoId}
            title={title}
            raga={raga}
            tala={tala}
            type={type}
            onClose={() => dispatch(closeVideoPlayer())}
          />
        )}
      </div>
    </BrowserRouter>
  )
}

export default App
