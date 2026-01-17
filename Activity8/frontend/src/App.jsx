import { useState } from 'react'
import { ChatroomList } from './components/ChatroomList'
import { ChatWindow } from './components/ChatWindow'
import './styles.css'

function App() {
  const [selectedRoom, setSelectedRoom] = useState(null)

  return (
    <div className="app">
      <header className="app-header">
        <h1>💬 Chatroom Application</h1>
      </header>

      <div className="app-container">
        {selectedRoom ? (
          <ChatWindow
            chatroom={selectedRoom}
            onBack={() => setSelectedRoom(null)}
          />
        ) : (
          <ChatroomList onSelectRoom={setSelectedRoom} />
        )}
      </div>
    </div>
  )
}

export default App