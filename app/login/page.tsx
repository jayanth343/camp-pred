'use client'
const base64 = require('base-64')
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import mysql2 from 'mysql2'
import { Card, CardBody, Input, Button, Link } from "@nextui-org/react"
import { Typography, Snackbar } from '@mui/material'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { useStore } from '../../pages/api/store'

export default function LoginPage() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const router = useRouter()
  const user = useStore((state: any) => state.user)
  const setUser  = useStore((state: any) => state.setUser)
  const [showPassword, setShowPassword] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ep = base64.encode(password!)
    const formData = JSON.stringify({ username:username, password: ep })
    try{
      const res = await fetch('/api/login', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      console.log(data!.user)
      if (data.code === 200) {
        setOpenSnackbar(true)
        setUser(data.user)
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error('Error logging in:', error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-1000 p-4">
      <div className="flex flex-col items-center gap-8">
        <Card className="w-full max-w-md bg-white shadow-md">
          <CardBody className="flex flex-col gap-6 p-8">
            <div className="text-center">
              <Typography variant="h4" component="div" className="text-black mb-4">
              Welcome Back
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Enter your credentials to access your account
            </Typography>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md ">
            <div className="relative mb-4">
              <input
                type="text"
                id="username"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900  rounded-lg border border-black focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="username" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Username</label>
            </div>
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-black appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Password</label>
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            <Button color="primary" type="submit" fullWidth size="lg" className="bg-black text-white hover:bg-gray-800 h-9">
              Login
            </Button>
          </form>
          <div className="text-center">
            <Typography variant="body2" className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" color="primary" className="font-semibold text-black" onClick={() => { router.push('/register')}}>
                Register here
              </Link>
            </Typography>
          </div>
        </CardBody>
      </Card>
      <Snackbar
        open={openSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={() => {setOpenSnackbar(false); setTimeout(() => {if (user?.TYPE === 'Admin') router.push('/admin'); else router.push('/home')}, 500)}}
        message={<em>Welcome {user?.Name}!</em>}
      />
      </div>
    </div>
  )
}