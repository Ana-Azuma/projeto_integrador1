import express from 'express'
import { 
  listar, 
  buscarPorId, 
  criar, 
  atualizar,
  listarPendentes 
} from '../controllers/pedidoController.js'
import { authenticateToken, authorizeRoles } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticateToken, listar)
router.get('/pendentes', authenticateToken, authorizeRoles('admin'), listarPendentes)
router.get('/:id', authenticateToken, buscarPorId)
router.post('/', authenticateToken, criar)
router.put('/:id', authenticateToken, authorizeRoles('admin'), atualizar)

export default router