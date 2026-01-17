import { useState, useEffect } from 'react'
import { chatroomApi } from '../api'
import '../styles.css'

export function ChatroomList({ onSelectRoom }) {
  const [chatrooms, setChatrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomDesc, setNewRoomDesc] = useState('')

  useEffect(() => {
    fetchChatrooms()
  }, [])

  const fetchChatrooms = async () => {
    try {
      const res = await chatroomApi.getAll()
      setChatrooms(res.data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch chatrooms:', err)
      setLoading(false)
    }
  }

  const handleCreateRoom = async (e) => {
    e.preventDefault()
    if (!newRoomName.trim()) return

    try {
      await chatroomApi.create({
        name: newRoomName,
        description: newRoomDesc,
      })
      setNewRoomName('')
      setNewRoomDesc('')
      fetchChatrooms()
    } catch (err) {
      console.error('Failed to create room:', err)
    }
  }

  if (loading) return <div className="chatroom-list"><p>Loading...</p></div>

  return (
    <div className="chatroom-list">
      <h2>Chatrooms</h2>

      <form onSubmit={handleCreateRoom} className="create-room-form">
        <input
          type="text"
          placeholder="Room name..."
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description..."
          value={newRoomDesc}
          onChange={(e) => setNewRoomDesc(e.target.value)}
        />
        <button type="submit">Create Room</button>
      </form>

      <div className="rooms">
        {chatrooms.map((room) => (
          <div
            key={room.id}
            className="room-card"
            onClick={() => onSelectRoom(room)}
          >
            <h3>{room.name}</h3>
            <p>{room.description}</p>
            <span className="member-count">👥 {room.memberCount} members</span>
          </div>
        ))}
      </div>
    </div>
  )
}
