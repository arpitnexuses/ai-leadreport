'use client'

import { useEffect, useState } from 'react'
import { getReportStatus } from '@/app/actions'

export function ReportLoader({ reportId }: { reportId: string }) {
  const [status, setStatus] = useState<'processing' | 'completed' | 'failed'>('processing')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const result = await getReportStatus(reportId)
        setStatus(result.status as 'processing' | 'completed' | 'failed')
        if (result.error) setError(result.error)
        
        // If still processing, poll again in 2 seconds
        if (result.status === 'processing') {
          setTimeout(pollStatus, 2000)
        } else if (result.status === 'completed') {
          window.location.reload() // Reload to show the full report
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check report status')
        setStatus('failed')
      }
    }

    pollStatus()
  }, [reportId])

  if (status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <h3 className="mt-4 text-xl font-semibold text-gray-800">Generating Your Report</h3>
        <p className="mt-2 text-sm text-gray-500">This may take a few moments...</p>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-xl">❌</div>
        <h3 className="mt-4 text-xl font-semibold text-red-600">Report Generation Failed</h3>
        <p className="mt-2 text-sm text-gray-500">{error || 'An unexpected error occurred'}</p>
      </div>
    )
  }

  return null // The page will reload when completed
} 