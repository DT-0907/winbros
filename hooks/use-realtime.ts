'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { Job } from '@/lib/supabase'

export interface RealtimeEvent {
  table: 'jobs' | 'leads' | 'cleaner_assignments'
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: Record<string, unknown> | null
  old: Record<string, unknown> | null
}

export interface ConnectionEvent {
  type: 'connected'
  message: string
}

export type SSEEvent = RealtimeEvent | ConnectionEvent

/**
 * Hook for consuming Server-Sent Events from the /api/events endpoint
 * @param onUpdate - Callback that receives parsed event data
 */
export function useRealtimeUpdates(onUpdate: (event: SSEEvent) => void) {
  const eventSourceRef = useRef<EventSource | null>(null)
  const onUpdateRef = useRef(onUpdate)

  // Keep callback ref updated
  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    const eventSource = new EventSource('/api/events')
    eventSourceRef.current = eventSource

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SSEEvent
        onUpdateRef.current(data)
      } catch (error) {
        console.error('Error parsing SSE event:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error)
      // EventSource will automatically attempt to reconnect
    }

    // Cleanup on unmount
    return () => {
      eventSource.close()
      eventSourceRef.current = null
    }
  }, [])

  return eventSourceRef
}

/**
 * Convenience hook that returns jobs state with automatic real-time updates
 * @param initialJobs - Optional initial jobs array
 */
export function useRealtimeJobs(initialJobs: Job[] = []) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)

  const handleUpdate = useCallback((event: SSEEvent) => {
    // Skip connection events
    if ('type' in event && event.type === 'connected') {
      return
    }

    const realtimeEvent = event as RealtimeEvent

    // Only handle job events
    if (realtimeEvent.table !== 'jobs') {
      return
    }

    setJobs((currentJobs) => {
      switch (realtimeEvent.eventType) {
        case 'INSERT': {
          const newJob = realtimeEvent.new as unknown as Job
          // Avoid duplicates
          if (currentJobs.some((job) => job.id === newJob.id)) {
            return currentJobs
          }
          return [newJob, ...currentJobs]
        }
        case 'UPDATE': {
          const updatedJob = realtimeEvent.new as unknown as Job
          return currentJobs.map((job) =>
            job.id === updatedJob.id ? updatedJob : job
          )
        }
        case 'DELETE': {
          const deletedJob = realtimeEvent.old as unknown as Job
          return currentJobs.filter((job) => job.id !== deletedJob.id)
        }
        default:
          return currentJobs
      }
    })
  }, [])

  useRealtimeUpdates(handleUpdate)

  return { jobs, setJobs }
}
