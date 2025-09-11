import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    console.log('Registration attempt:', { name, email, password: '***' })

    if (!name || !email || !password) {
      console.log('Missing required fields')
      return NextResponse.json(
        { message: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email)
      return NextResponse.json(
        { message: 'Format email tidak valid' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      console.log('Password too short')
      return NextResponse.json(
        { message: 'Password harus memiliki setidaknya 6 karakter' },
        { status: 400 }
      )
    }

    // Check if user already exists
    console.log('Checking existing user...')
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('User already exists:', email)
      return NextResponse.json(
        { message: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    // Hash password
    console.log('Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    console.log('Creating user...')
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      }
    })

    console.log('User created successfully:', user.id)
    return NextResponse.json(
      { message: 'User berhasil dibuat', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}