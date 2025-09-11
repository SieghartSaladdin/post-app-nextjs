const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Test user table exists
    const userCount = await prisma.user.count()
    console.log(`✅ User table accessible. Current user count: ${userCount}`)
    
    // Test if we can create a test user (optional)
    console.log('Database connection test completed successfully')
    
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
