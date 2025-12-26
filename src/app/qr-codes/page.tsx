'use client'

import { useMemo } from 'react'
import { ClipboardIcon, PrinterIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface TableInfo {
  id: string
  number: string
  capacity: number
  status: 'available' | 'occupied' | 'reserved' | 'cleaning'
}

const mockTables: TableInfo[] = [
  { id: '1', number: 'T1', capacity: 4, status: 'occupied' },
  { id: '2', number: 'T2', capacity: 6, status: 'available' },
  { id: '3', number: 'T3', capacity: 2, status: 'reserved' },
  { id: '4', number: 'T4', capacity: 8, status: 'cleaning' },
]

const statusStyles: Record<TableInfo['status'], string> = {
  available: 'bg-success-100 text-success-800',
  occupied: 'bg-error-100 text-error-800',
  reserved: 'bg-warning-100 text-warning-800',
  cleaning: 'bg-neutral-100 text-neutral-700'
}

function buildQrUrl(tableId: string, origin: string) {
  const base = origin || 'http://localhost:3000'
  return `${base}/table/${tableId}`
}

function buildQrImageSrc(data: string) {
  const api = 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data='
  return `${api}${encodeURIComponent(data)}`
}

function handlePrint(tableLabel: string, imgSrc: string) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return
  
  // Fetch the image and convert to data URL for reliable printing
  fetch(imgSrc)
    .then(res => res.blob())
    .then(blob => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        const html = `<!doctype html>
<html>
  <head>
    <title>${tableLabel} QR</title>
    <style>
      body { margin: 0; padding: 20px; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
      img { width: 350px; height: 350px; }
    </style>
  </head>
  <body>
    <img src="${dataUrl}" />
  </body>
</html>`
        printWindow!.document.write(html)
        printWindow!.document.close()
        printWindow!.focus()
        setTimeout(() => printWindow!.print(), 250)
      }
      reader.readAsDataURL(blob)
    })
    .catch(err => {
      console.error('Print failed:', err)
      printWindow.close()
    })
}

export default function QRCodesPage() {
  const origin = useMemo(() => (typeof window !== 'undefined' ? window.location.origin : ''), [])
  const tables = mockTables // replace with API when available

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-brand-50">
      <div className="container-mobile py-12">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="text-sm uppercase tracking-wide text-brand-600 font-semibold">QR Codes</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 mt-2">Print table QR codes</h1>
            <p className="text-neutral-600 mt-2 max-w-2xl">
              Generate and print a QR code for each table. Guests can scan to jump directly to their table page and order.
            </p>
          </div>
          <Link href="/tables" className="btn btn-ghost">Back to tables</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((table) => {
            const qrTarget = buildQrUrl(table.id, origin)
            const imgSrc = buildQrImageSrc(qrTarget)
            return (
              <div key={table.id} className="card">
                <div className="card-body space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-500">Table</p>
                      <h3 className="text-2xl font-bold text-neutral-900">{table.number}</h3>
                      <p className="text-sm text-neutral-500">Capacity: {table.capacity}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${statusStyles[table.status]}`}>
                      {table.status}
                    </span>
                  </div>

                  <div className="rounded-2xl bg-white border border-neutral-200/70 p-4 flex flex-col items-center">
                    <img
                      src={imgSrc}
                      alt={`QR for table ${table.number}`}
                      className="w-48 h-48 object-contain"
                    />
                    <p className="mt-3 text-xs text-neutral-500 break-all text-center">{qrTarget}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(qrTarget)
                          alert('Link copied to clipboard')
                        } catch (e) {
                          alert('Copy failed')
                        }
                      }}
                      className="btn btn-ghost text-sm flex items-center justify-center gap-2"
                    >
                      <ClipboardIcon className="w-4 h-4" /> Copy link
                    </button>
                    <button
                      onClick={() => handlePrint(table.number, imgSrc)}
                      className="btn btn-secondary text-sm flex items-center justify-center gap-2"
                    >
                      <PrinterIcon className="w-4 h-4" /> Print
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
