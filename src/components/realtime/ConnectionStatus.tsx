'use client'

import React from 'react'
import { useRealtime } from '@/contexts/RealtimeContext'
import { Wifi, WifiOff, RotateCcw } from 'lucide-react'

interface ConnectionStatusProps {
  className?: string
  showLabel?: boolean
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  className = '',
  showLabel = false 
}) => {
  const { connectionStatus, connect } = useRealtime()

  const getStatusIcon = () => {
    if (connectionStatus.reconnecting) {
      return <RotateCcw className="w-4 h-4 animate-spin" />
    }
    
    return connectionStatus.connected 
      ? <Wifi className="w-4 h-4" />
      : <WifiOff className="w-4 h-4" />
  }

  const getStatusColor = () => {
    if (connectionStatus.reconnecting) {
      return 'text-yellow-600'
    }
    
    return connectionStatus.connected 
      ? 'text-green-600' 
      : 'text-red-600'
  }

  const getStatusText = () => {
    if (connectionStatus.reconnecting) {
      return 'Reconnecting...'
    }
    
    return connectionStatus.connected 
      ? 'Connected' 
      : 'Disconnected'
  }

  const getBackgroundColor = () => {
    if (connectionStatus.reconnecting) {
      return 'bg-yellow-100 hover:bg-yellow-200'
    }
    
    return connectionStatus.connected 
      ? 'bg-green-100 hover:bg-green-200' 
      : 'bg-red-100 hover:bg-red-200'
  }

  const handleClick = () => {
    if (!connectionStatus.connected && !connectionStatus.reconnecting) {
      connect()
    }
  }

  return (
    <div 
      onClick={handleClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer
        ${getBackgroundColor()}
        ${className}
      `}
      title={`
        Status: ${getStatusText()}
        ${connectionStatus.lastConnected ? `Last connected: ${connectionStatus.lastConnected.toLocaleTimeString()}` : ''}
        ${connectionStatus.connectionId ? `Connection ID: ${connectionStatus.connectionId}` : ''}
        ${!connectionStatus.connected ? 'Click to reconnect' : ''}
      `.trim()}
    >
      <div className={getStatusColor()}>
        {getStatusIcon()}
      </div>
      
      {showLabel && (
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      )}
    </div>
  )
}

export default ConnectionStatus