import express from 'express'
import {
  receberPedidoAprovado,
  listarOrdensProducao,
  atualizarStatusOrdem,
  atualizarEstoqueAposProducao,
  lerVariaveisPlanta,
  iniciarProducao,
  pararProducao,
  consultarEstoque,
  bloquearEstoque,
  liberarEstoque
} from '../controllers/mesController.js'
import { authenticateToken, authorizeRoles } from '../middleware/auth.js'

const router = express.Router()

// Ordens de produção
router.post('/receber-pedido', authenticateToken, authorizeRoles('admin'), receberPedidoAprovado)
router.get('/ordens-producao', authenticateToken, authorizeRoles('admin', 'mes'), listarOrdensProducao)
router.patch('/ordens-producao/:id', authenticateToken, authorizeRoles('admin', 'mes'), atualizarStatusOrdem)

// Estoque
router.post('/atualizar-estoque', authenticateToken, authorizeRoles('mes'), atualizarEstoqueAposProducao)
router.get('/estoque', authenticateToken, authorizeRoles('admin', 'mes'), consultarEstoque)
router.post('/estoque/bloquear', authenticateToken, authorizeRoles('mes'), bloquearEstoque)
router.post('/estoque/liberar', authenticateToken, authorizeRoles('mes'), liberarEstoque)

// Planta (OPC UA simulado)
router.get('/planta/variaveis', authenticateToken, authorizeRoles('mes'), lerVariaveisPlanta)
router.post('/planta/iniciar-producao', authenticateToken, authorizeRoles('mes'), iniciarProducao)
router.post('/planta/parar-producao', authenticateToken, authorizeRoles('mes'), pararProducao)

export default router