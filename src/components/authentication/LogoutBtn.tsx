"use client"
import { logout } from '@/app/actions/auth-actions'
import React from 'react'

export default function LogoutBtn() {
    const handleLogout = async () => {
        // Perform logout logic here
        await logout();
    }

    return (
        <span onClick={handleLogout} className='cursor-pointer inline-block w-full text-destructive'>Logout</span>
    )
}
