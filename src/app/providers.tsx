'use client'

import React from 'react'
import { TaskProvider } from '../context/TaskContext'
import { UserProvider } from '../context/UserContext'

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <TaskProvider>
        {children}
      </TaskProvider>
    </UserProvider>
  )
}