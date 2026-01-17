import { useState, useEffect, useRef } from 'react'
import { messageApi, chatroomApi } from '../api'
import '../styles.css'

export function ChatWindow({ chatroom, onBack }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchMessages()
  }, [chatroom?.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = async () => {
    if (!chatroom?.id) return
    try {
      const res = await messageApi.getByRoom(chatroom.id)
      setMessages(res.data.messages || [])
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch messages:', err)
      setLoading(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !username.trim()) return

    localStorage.setItem('username', username)

    try {
      await messageApi.create(chatroom.id, {
        username,
        content: newMessage,
      })
      setNewMessage('')
      fetchMessages()
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  if (loading) return <div className="chat-window"><p>Loading...</p></div>

  return (
    <div className="chat-window">
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>{chatroom.name}</h2>
        <p className="room-desc">{chatroom.description}</p>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <p className="no-messages">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="message">
              <span className="message-username">{msg.username}</span>
              <p className="message-content">{msg.content}</p>
              <span className="message-time">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          placeholder="Your name..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="username-input"
        />
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="message-input"
        />
        <button type="submit" className="send-btn">Send</button>
      </form>
    </div>
  )
}
