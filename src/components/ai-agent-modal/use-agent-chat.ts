'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { type AgentMessage, getLocalAgentResponse } from '@/lib/agent-knowledge'
import { isMobileOrTablet } from '@/lib/utils'
import {
  MAX_STORED_MESSAGES,
  STORAGE_KEY,
  WELCOME_MESSAGE,
  loadStoredMessages,
  nowTime,
} from './session'

/** Chat state and behavior: messages, streaming reveal, send/reset/copy, persistence */
export function useAgentChat() {
  const [messages, setMessages] = useState<AgentMessage[]>(loadStoredMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingId, setStreamingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const streamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const streamTextRef = useRef('')

  const stopStreamTimer = useCallback(() => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current)
      streamTimerRef.current = null
    }
  }, [])

  // Commit the full reply text and end the streaming state
  const finishStream = useCallback(
    (id: string) => {
      stopStreamTimer()
      setMessages(prev =>
        prev.map(m =>
          m.id === id
            ? { ...m, content: streamTextRef.current, streaming: false }
            : m
        )
      )
      setStreamingId(null)
    },
    [stopStreamTimer]
  )

  const skipStream = useCallback(() => {
    if (streamingId) finishStream(streamingId)
  }, [streamingId, finishStream])

  // Reveal a reply line-by-line (terminal-style). Whole lines keep the
  // markdown renderer valid mid-animation, unlike char-by-char typing.
  const startStream = useCallback(
    (fullText: string, suggestions?: string[], isError = false) => {
      const id = `a-${Date.now()}`
      const lines = fullText.split('\n')
      streamTextRef.current = fullText

      setMessages(prev => [
        ...prev,
        {
          id,
          role: 'assistant',
          content: lines[0] ?? '',
          timestamp: nowTime(),
          suggestions,
          isError,
          streaming: lines.length > 1,
        },
      ])

      if (lines.length <= 1) return
      setStreamingId(id)

      const step = Math.min(140, Math.max(45, Math.round(1500 / lines.length)))
      let index = 1
      streamTimerRef.current = setInterval(() => {
        if (index >= lines.length) {
          finishStream(id)
          return
        }
        const line = lines[index]
        index += 1
        setMessages(prev =>
          prev.map(m =>
            m.id === id ? { ...m, content: `${m.content}\n${line}` } : m
          )
        )
      }, step)
    },
    [finishStream]
  )

  useEffect(() => {
    return () => stopStreamTimer()
  }, [stopStreamTimer])

  // Persist the conversation for the browser session (survives refresh).
  // State is loaded synchronously on mount, so the first write-back is the
  // same data that was read — safe without a mounted gate.
  useEffect(() => {
    try {
      const persistable = messages
        .filter(m => !m.streaming)
        .slice(-MAX_STORED_MESSAGES)
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(persistable))
    } catch {
      // Storage unavailable (private mode) — chat simply won't persist
    }
  }, [messages])

  const autoResizeInput = useCallback(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`
  }, [])

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText ?? input).trim()
    if (!textToSend || isLoading || streamingId) return

    // Dismiss keyboard on mobile/tablet or when clicking existing suggestions
    if (queryText || isMobileOrTablet()) {
      inputRef.current?.blur()
    }

    const userMessage: AgentMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: nowTime(),
    }

    setMessages(prev => [...prev, userMessage])
    if (!queryText) {
      setInput('')
      if (inputRef.current) inputRef.current.style.height = 'auto'
    }
    setIsLoading(true)

    try {
      // Try API route first
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      })

      if (res.ok) {
        const data = await res.json()
        startStream(data.reply, data.suggestions)
      } else if (res.status === 429 || res.status === 400) {
        // Show server-side notices (rate limit, validation) as error replies
        let serverMessage: string | undefined
        try {
          const errData = await res.json()
          serverMessage = errData?.message
        } catch {
          // No JSON body
        }
        setMessages(prev => [
          ...prev,
          {
            id: `e-${Date.now()}`,
            role: 'assistant',
            content:
              serverMessage ||
              'Request rejected. Please try a shorter message in a moment.',
            timestamp: nowTime(),
            isError: true,
          },
        ])
      } else {
        // Server trouble: fall back to the local knowledge engine
        const local = getLocalAgentResponse(textToSend)
        startStream(local.reply, local.suggestions)
      }
    } catch {
      // Client-side fallback if offline/error
      const local = getLocalAgentResponse(textToSend)
      startStream(local.reply, local.suggestions)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    stopStreamTimer()
    setStreamingId(null)
    setMessages([{ ...WELCOME_MESSAGE, id: `welcome-${Date.now()}` }])
  }

  const handleCopy = async (msg: AgentMessage) => {
    try {
      await navigator.clipboard.writeText(msg.content)
      setCopiedId(msg.id)
      setTimeout(
        () => setCopiedId(prev => (prev === msg.id ? null : prev)),
        1600
      )
    } catch {
      // Clipboard permission denied — silently ignore
    }
  }

  const userCount = messages.filter(m => m.role === 'user').length

  return {
    messages,
    input,
    setInput,
    inputRef,
    isLoading,
    streamingId,
    copiedId,
    handleSend,
    handleReset,
    handleCopy,
    autoResizeInput,
    skipStream,
    userCount,
  }
}
