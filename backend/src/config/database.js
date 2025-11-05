import mongoose from 'mongoose'

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB conectado com sucesso')
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message)
    throw error
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB desconectado')
})

mongoose.connection.on('error', (error) => {
  console.error('❌ Erro no MongoDB:', error)
})