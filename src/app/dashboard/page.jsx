"use client"

import React from 'react'
import { signOut } from 'next-auth/react'


const Dashboard = () => {
  return (
    <div>
        <h1>This is Dashboard </h1>
        <button
            onClick={()=>signOut({callbackUrl : "/login"})}
        >Logout</button>
    </div>
  )
}

export default Dashboard
