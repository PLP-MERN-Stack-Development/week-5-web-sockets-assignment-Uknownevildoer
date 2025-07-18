
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../contexts/SocketContext'
import axios from 'axios'
import ChatSidebar from '../components/ChatSidebar'
import MessageList from '../components/MessageList'
import MessageInput from '../components/MessageInput'
import UserList from '../components/UserList'

const Chat = () => {
  const [rooms, setRooms] = useState([])
  const [activeRoom, setActiveRoom] = useState(null)
  const [showUserList, setShowUserList] = useState(true)
  const { user, logout } = useAuth()
  const { 
    messages, 
    onlineUsers, 
    typingUsers, 
    joinRoom, 
    sendMessage, 
    startTyping, 
    stopTyping, 
    setMessages 
  } = useSocket()

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchRooms()
  }, [])

  useEffect(() => {
    if (activeRoom) {
      fetchMessages(activeRoom._id)
      joinRoom(activeRoom._id)
    }
  }, [activeRoom])

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/chat/rooms`)
      setRooms(response.data)
      if (response.data.length > 0 && !activeRoom) {
        setActiveRoom(response.data[0])
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    }
  }

  const fetchMessages = async (roomId) => {
    try {
      const response = await axios.get(`${API_URL}/chat/rooms/${roomId}/messages`)
      setMessages(response.data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = (content) => {
    if (activeRoom && content.trim()) {
      sendMessage(content, activeRoom._id)
    }
  }

  const handleTyping = (isTyping) => {
    if (activeRoom) {
      if (isTyping) {
        startTyping(activeRoom._id)
      } else {
        stopTyping(activeRoom._id)
      }
    }
  }

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar */}
      <ChatSidebar 
        rooms={rooms}
        activeRoom={activeRoom}
        onRoomSelect={setActiveRoom}
        user={user}
        onLogout={logout}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {activeRoom ? activeRoom.name : 'Select a room'}
            </h1>
            <p className="text-sm text-gray-500">
              {onlineUsers.length} users online
            </p>
          </div>
          <button
            onClick={() => setShowUserList(!showUserList)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showUserList ? 'Hide Users' : 'Show Users'}
          </button>
        </div>

        <div className="flex-1 flex">
          {/* Messages */}
          <div className="flex-1 flex flex-col">
            <MessageList 
              messages={messages.filter(m => m.room === activeRoom?._id)}
              currentUser={user}
              typingUsers={typingUsers.filter(u => u.userId !== user?.id)}
            />
            <MessageInput 
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
            />
          </div>

          {/* User List */}
          {showUserList && (
            <div className="w-64 border-l bg-gray-50">
              <UserList users={onlineUsers} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chat
