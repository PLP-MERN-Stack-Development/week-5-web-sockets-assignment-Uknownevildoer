
const ChatSidebar = ({ rooms, activeRoom, onRoomSelect, user, onLogout }) => {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Chat App</h2>
        <p className="text-sm text-gray-400">Welcome, {user?.username}</p>
      </div>

      {/* Rooms */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Rooms
          </h3>
          <div className="space-y-1">
            {rooms.map((room) => (
              <button
                key={room._id}
                onClick={() => onRoomSelect(room)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeRoom?._id === room._id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-2">#</span>
                  <span className="truncate">{room.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Actions */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default ChatSidebar
