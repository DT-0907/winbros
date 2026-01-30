import { getSupabaseClient } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = getSupabaseClient()

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      let channel: RealtimeChannel | null = null

      const sendEvent = (payload: unknown) => {
        try {
          const data = `data: ${JSON.stringify(payload)}\n\n`
          controller.enqueue(encoder.encode(data))
        } catch (error) {
          console.error('Error sending SSE event:', error)
        }
      }

      // Subscribe to real-time changes
      channel = supabase
        .channel('dashboard-updates')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'jobs' },
          (payload) => {
            sendEvent({
              table: 'jobs',
              eventType: payload.eventType,
              new: payload.new,
              old: payload.old,
            })
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'leads' },
          (payload) => {
            sendEvent({
              table: 'leads',
              eventType: payload.eventType,
              new: payload.new,
              old: payload.old,
            })
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'cleaner_assignments' },
          (payload) => {
            sendEvent({
              table: 'cleaner_assignments',
              eventType: payload.eventType,
              new: payload.new,
              old: payload.old,
            })
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            sendEvent({ type: 'connected', message: 'Subscribed to real-time updates' })
          } else if (status === 'CHANNEL_ERROR') {
            console.error('Supabase channel error')
          }
        })

      // Handle client disconnect
      const cleanup = () => {
        if (channel) {
          supabase.removeChannel(channel)
          channel = null
        }
      }

      // Store cleanup function for when stream is cancelled
      ;(controller as unknown as { cleanup?: () => void }).cleanup = cleanup
    },
    cancel() {
      // Clean up subscription when client disconnects
      const cleanup = (this as unknown as { cleanup?: () => void }).cleanup
      if (cleanup) {
        cleanup()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
