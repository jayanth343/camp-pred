'use client'

import { useState , useEffect} from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, Input, Button, Link } from "@nextui-org/react"
import { Typography, Snackbar } from '@mui/material'
import pool from '../../lib/connect'
import base64 from 'base-64'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const router = useRouter()
  const [luid, setLuid] = useState(0)
  
  const getluid = async () => {
    const result = await fetch('/api/luid')
    const data = await result.json()
    console.log('RES: ',data.luid)
    setLuid(data.luid)
  }

  useEffect(() => {
    if (luid === 0) {
      getluid()
    }
  }, [luid])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ep = base64.encode(password!)
    const formData = JSON.stringify({ luid: parseInt(luid.toString(),10), name: name, email: email, username: username, password: ep })
    setOpenSnackbar(true)
    const res = await fetch('/api/register', {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    console.log('RES: ',data)
    if (data.status === 200) {
      setOpenSnackbar(true)
      setTimeout(() => router.push('/login'), 1500)
    }
    else {
      alert(data.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-cream p-4">
      <Card className="w-full max-w-md bg-white shadow-md">
        <CardBody className="flex flex-col gap-6 p-8">
          <div className="text-center">
            <Typography variant="h4" component="div" className="text-black mb-2">
              Create Account
            </Typography>
            <Typography variant="body2" className="text-black">
              Join us and start your journey
            </Typography>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative mb-4">
              <input
                type="text"
                id="username"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border border-black appearance-none focus:outline-none focus:ring-0 focus:border-cream peer"
                
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="username" className="absolute text-sm text-black duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-cream peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Username</label>
            </div>
            <div className="relative mb-4">
            <input
              type="text"
              id="name"

              value={name}
              onChange={(e) => setName(e.target.value)}
              required

              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border border-black appearance-none focus:outline-none focus:ring-0 focus:border-cream peer"
                
            />
            <label htmlFor="name" className="absolute text-sm text-black duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-cream peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Name</label>
            </div>
            <div className="relative mb-4">
            <input
              type="email"
              id="email"

              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required

              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border border-black appearance-none focus:outline-none focus:ring-0 focus:border-cream peer"
                
            />
            <label htmlFor="email" className="absolute text-sm text-black duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-cream peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Email</label>
            </div>
            
            
            <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border border-black appearance-none focus:outline-none focus:ring-0 focus:border-cream peer"

                
            />
            <label htmlFor="password" className="absolute text-sm text-black duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-cream peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Password</label>
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
            <Button color="primary" type="submit"  size="lg" className="bg-black text-white hover:bg-gray-200 h-8 w-full rounded-lg" onClick={handleSubmit}>
              Register
            </Button>
            
          </form>
          <div className="text-center">
            <Typography variant="body2" className="text-black">
              Already have an account?{" "}
              <Link href="/login" color="primary" className="font-bold text-black">
                Login here
              </Link>
            </Typography>
          </div>
        </CardBody>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Registered successfully"
      />
    </div>
  )
}