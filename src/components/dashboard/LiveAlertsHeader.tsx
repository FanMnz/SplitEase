'use client'

import React from 'react'
import { Zap } from 'lucide-react'

export default function LiveAlertsHeader() {
  // Placeholder: in a real app this would be fed by realtime data
  const alertText = 'Table 14 is due to pay (3 min over average)'

  return (
    <div className="w-full bg-white flex items-center justify-between px-6 py-3 border-b">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-critical">
          <span className="animate-pulse inline-flex items-center justify-center p-2 bg-critical/10 rounded-full">
            <Zap className="text-critical" size={16} />
          </span>
          <span className="font-medium text-sm text-neutral-800">Live Alerts</span>
        </div>
        <div className="ml-3 text-sm text-neutral-700">{alertText}</div>
      </div>

      <div className="text-sm text-neutral-500">Updated: just now</div>
    </div>
  )
}
