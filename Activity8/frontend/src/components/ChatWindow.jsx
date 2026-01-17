import { useState, useEffect, useRef } from 'react'
import { messageApi } from '../api'
import '../styles.css'

export function ChatWindow({ chatroom, onBack }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const messagePollingRef = useRef(null)

  useEffect(() => {
    if (!chatroom?.id) return
    
    fetchMessages()
    
    // Poll for new messages every 2 seconds
    messagePollingRef.current = setInterval(() => {
      fetchMessages()
    }, 2000)
    
    return () => {
      if (messagePollingRef.current) clearInterval(messagePollingRef.current)
    }
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
      // The API returns chatroom with messages array
      const data = res.data
      setMessages(Array.isArray(data) ? data : (data.messages || []))
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch messages:', err)
      setMessages([])
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
      await fetchMessages()
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div>
          <h2>{chatroom.name}</h2>
          <p className="room-desc">{chatroom.description || 'Welcome to this chatroom'}</p>
        </div>
      </div>

      <div className="messages-container">
        {loading ? (
          <div className="no-messages">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            <h3>💭 No messages yet</h3>
            <p>Start the conversation by typing your name and a message below!</p>
            <p style={{ fontSize: '12px', marginTop: '10px', opacity: 0.7 }}>
              Example: Enter your name in the first box, type "Hello everyone!" and click Send
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="message">
              <span className="message-username">👤 {msg.username}</span>
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
          placeholder="Your name (e.g., John)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="username-input"
          required
        />
        <input
          type="text"
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="message-input"
          required
        />
        <button type="submit" className="send-btn">📤 Send</button>
      </form>
    </div>
  )
}
