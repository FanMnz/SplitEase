export type TableStatus = 'available' | 'occupied' | 'waiting_payment' | 'long_stay' | 'cleaning'

export interface KPIProps {
  id: string
  title: string
  value: string | number
  delta?: number
  deltaPositive?: boolean
  description?: string
}

export interface TableInfo {
  id: string
  number: string
  status: TableStatus
  guests?: number
  lastUpdate?: string
}
