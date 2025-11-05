import express from 'express'
import { 
  listar, 
  buscarPorId, 
  criar, 
  atualizar, 
  excluir,
  atualizarEstoque 
} from '../controllers/produtoController.js'
import { authenticateToken, authorizeRoles } from '../middleware/auth.js'

const router = express.Router()

router.get('/', listar)
router.get('/:id', buscarPorId)
router.post('/', authenticateToken, authorizeRoles('admin'), criar)
router.put('/:id', authenticateToken, authorizeRoles('admin'), atualizar)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), excluir)
router.patch('/:id/estoque', authenticateToken, authorizeRoles('admin', 'mes'), atualizarEstoque)

export default router