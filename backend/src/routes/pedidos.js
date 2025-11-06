import express from 'express'
import { listar, buscarPorId, criar, atualizar, listarPendentes } from '../controllers/pedidoController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// 🔐 Todas as rotas exigem autenticação
router.get('/', authenticateToken, listar)
router.get('/:id', authenticateToken, buscarPorId)
router.post('/', authenticateToken, criar)
router.put('/:id', authenticateToken, atualizar)
router.get('/pendentes', authenticateToken, listarPendentes)

export default router
