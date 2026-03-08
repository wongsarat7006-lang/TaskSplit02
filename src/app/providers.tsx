'use client'

import React from 'react'
import { TaskProvider } from '../context/TaskContext'
import { UserProvider } from '../context/UserContext'
import { ToastProvider } from '../context/ToastContext'
import { ConfirmProvider } from '../context/ConfirmContext'

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <TaskProvider>
        <ToastProvider>
          <ConfirmProvider>
            {children}
          </ConfirmProvider>
        </ToastProvider>
      </TaskProvider>
    </UserProvider>
  )
}