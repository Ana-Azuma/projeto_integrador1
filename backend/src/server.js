import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { connectDatabase } from './config/database.js'

// Rotas
import authRoutes from './routes/auth.js'
import produtoRoutes from './routes/produtos.js'
import pedidoRoutes from './routes/pedidos.js'
import mesRoutes from './routes/mes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// ---------------------------
// 🧩 Middlewares globais
// ---------------------------

// Segurança HTTP (headers)
app.use(helmet())

// CORS (permite acesso do frontend)
app.use(cors())

// Logs de requisições no console
app.use(morgan('dev'))

// ✅ Aumenta o limite do body para permitir envio de imagens base64 grandes
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// ---------------------------
// 🛣️ Rotas principais
// ---------------------------
app.use('/api/auth', authRoutes)
app.use('/api/produtos', produtoRoutes)
app.use('/api/pedidos', pedidoRoutes)
app.use('/api/mes', mesRoutes)

// ---------------------------
// 💓 Rota de verificação (Health Check)
// ---------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ---------------------------
// ❗ Middleware global de erros
// ---------------------------
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// ---------------------------
// 🚀 Inicialização do servidor
// ---------------------------
const startServer = async () => {
  try {
    await connectDatabase()
    app.listen(PORT, () => {
      console.log(`✅ MongoDB conectado com sucesso`)
      console.log(`🚀 Servidor rodando na porta ${PORT}`)
      console.log(`📊 Ambiente: ${process.env.NODE_ENV}`)
    })
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error)
    process.exit(1)
  }
}

startServer()
