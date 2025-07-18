
import { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const { user, token } = useAuth()

  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

  useEffect(() => {
    if (user && token) {
      const newSocket = io(SOCKET_URL, {
        auth: {
          token: token
        }
      })

      newSocket.on('connect', () => {
        console.log('Connected to server')
      })

      newSocket.on('users:update', (users) => {
        setOnlineUsers(users)
      })

      newSocket.on('message:new', (message) => {
        setMessages(prev => [...prev, message])
      })

      newSocket.on('user:typing', (data) => {
        setTypingUsers(prev => [...prev.filter(u => u.userId !== data.userId), data])
      })

      newSocket.on('user:stop_typing', (data) => {
        setTypingUsers(prev => prev.filter(u => u.userId !== data.userId))
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    }
  }, [user, token, SOCKET_URL])

  const sendMessage = (content, roomId) => {
    if (socket) {
      socket.emit('message:send', { content, roomId })
    }
  }

  const joinRoom = (roomId) => {
    if (socket) {
      socket.emit('room:join', roomId)
    }
  }

  const startTyping = (roomId) => {
    if (socket) {
      socket.emit('typing:start', roomId)
    }
  }

  const stopTyping = (roomId) => {
    if (socket) {
      socket.emit('typing:stop', roomId)
    }
  }

  const value = {
    socket,
    onlineUsers,
    messages,
    typingUsers,
    sendMessage,
    joinRoom,
    startTyping,
    stopTyping,
    setMessages
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}
