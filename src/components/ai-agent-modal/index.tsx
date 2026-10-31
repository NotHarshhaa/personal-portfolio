'use client'

import { Fragment } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Frame } from '../frame'
import { AgentHeader } from './agent-header'
import { AgentLauncher } from './launcher'
import { ChatInput } from './chat-input'
import { MessageStream } from './message-stream'
import { useAgentChat } from './use-agent-chat'
import { useAgentDialog } from './use-agent-dialog'

export function AIAgentModal() {
  const {
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
  } = useAgentChat()

  const { isOpen, setIsOpen, mounted, launcherRef, dialogRef } = useAgentDialog(
    {
      inputRef,
      streamingId,
      skipStream,
    }
  )

  if (!mounted) return null

  return (
    <>
      {/* Floating Launcher Button */}
      <AnimatePresence>
        {!isOpen && (
          <AgentLauncher
            key="agent-launcher"
            launcherRef={launcherRef}
            onOpen={() => setIsOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Floating Blueprint Chat Drawer */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <Fragment key="agent-modal">
                {/* Backdrop on mobile and tablet */}
                <motion.div
                  key="agent-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm sm:bg-background/40 sm:backdrop-blur-[2px]"
                />

                <motion.div
                  key="agent-panel"
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  suppressHydrationWarning
                  role="dialog"
                  aria-modal="true"
                  aria-label="Harshhaa's AI Agent chat"
                  ref={dialogRef}
                  className="fixed inset-x-2 bottom-2 z-[100] flex h-[calc(100dvh-1rem)] max-h-[92dvh] w-auto flex-col sm:inset-x-auto sm:right-6 sm:bottom-6 sm:h-[560px] sm:max-h-[85vh] sm:w-[420px] md:w-[460px]"
                >
                  <Frame className="flex h-full flex-col overflow-hidden border border-border bg-background/95 shadow-2xl backdrop-blur-xl">
                    <AgentHeader
                      userCount={userCount}
                      onReset={handleReset}
                      onClose={() => setIsOpen(false)}
                    />

                    <MessageStream
                      messages={messages}
                      isLoading={isLoading}
                      streamingActive={!!streamingId}
                      copiedId={copiedId}
                      onSkipStream={skipStream}
                      onSend={handleSend}
                      onCopy={handleCopy}
                      onNavigate={() => setIsOpen(false)}
                    />

                    <ChatInput
                      inputRef={inputRef}
                      value={input}
                      onChange={value => {
                        setInput(value)
                        autoResizeInput()
                      }}
                      onSubmit={() => handleSend()}
                      isLoading={isLoading}
                      streamingActive={!!streamingId}
                    />
                  </Frame>
                </motion.div>
              </Fragment>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}
