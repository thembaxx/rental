"use client"

import { useEffect, useRef, useCallback } from "react"
import PusherClient from "pusher-js"

export function usePusher(channelName: string) {
  const pusherRef = useRef<PusherClient | null>(null)
  const callbacksRef = useRef<Map<string, ((data: any) => void)[]>>(new Map())

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) {
      console.warn("Pusher key not configured")
      return
    }

    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2",
    })

    pusherRef.current = pusher
    const channel = pusher.subscribe(channelName)

    // Bind all registered callbacks
    callbacksRef.current.forEach((callbacks, event) => {
      callbacks.forEach((cb) => channel.bind(event, cb))
    })

    return () => {
      pusher.unsubscribe(channelName)
      pusher.disconnect()
    }
  }, [channelName])

  const bind = useCallback((event: string, callback: (data: any) => void) => {
    const callbacks = callbacksRef.current.get(event) || []
    callbacks.push(callback)
    callbacksRef.current.set(event, callbacks)

    // If pusher is already connected, bind immediately
    const pusher = pusherRef.current
    if (pusher) {
      const channel = pusher.channel(channelName)
      if (channel) {
        channel.bind(event, callback)
      }
    }

    return () => {
      const cbs = callbacksRef.current.get(event) || []
      callbacksRef.current.set(
        event,
        cbs.filter((cb) => cb !== callback)
      )
      const pusher = pusherRef.current
      if (pusher) {
        const channel = pusher.channel(channelName)
        if (channel) {
          channel.unbind(event, callback)
        }
      }
    }
  }, [channelName])

  return { bind }
}
