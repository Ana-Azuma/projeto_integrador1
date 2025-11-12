// backend/routes/mes.js
import express from 'express'
import {
  receberPedidoAprovado,
  listarOrdensProducao,
  buscarOrdemPorId,
  iniciarProducao,
  pausarProducao,
  finalizarProducao,
  cancelarOrdem,
  lerStatusCLP,
  atualizarStatusCLPNaOrdem,
  resetFalhasCLP,
  conectarOPCUA,
  desconectarOPCUA,
  obterEstatisticas
} from '../controllers/mesController.js'
import { authenticateToken, authorizeRoles } from '../middleware/auth.js'

const router = express.Router()

// =============================
// 📦 ORDENS DE PRODUÇÃO
// =============================
router.post('/receber-pedido', authenticateToken, authorizeRoles('admin'), receberPedidoAprovado)
router.get('/ordens-producao', authenticateToken, authorizeRoles('admin', 'mes'), listarOrdensProducao)
router.get('/ordens-producao/:id', authenticateToken, authorizeRoles('admin', 'mes'), buscarOrdemPorId)

// =============================
// 🎬 CONTROLE DE PRODUÇÃO
// =============================
router.post('/producao/iniciar', authenticateToken, authorizeRoles('mes'), iniciarProducao)
router.post('/producao/pausar', authenticateToken, authorizeRoles('mes'), pausarProducao)
router.post('/producao/finalizar', authenticateToken, authorizeRoles('mes'), finalizarProducao)
router.post('/producao/cancelar', authenticateToken, authorizeRoles('mes', 'admin'), cancelarOrdem)

// =============================
// 📡 OPC UA / CLP
// =============================
router.get('/clp/status', authenticateToken, authorizeRoles('mes'), lerStatusCLP)
router.post('/clp/atualizar-status', authenticateToken, authorizeRoles('mes'), atualizarStatusCLPNaOrdem)
router.post('/clp/reset-falhas', authenticateToken, authorizeRoles('mes'), resetFalhasCLP)
router.post('/clp/conectar', authenticateToken, authorizeRoles('mes', 'admin'), conectarOPCUA)
router.post('/clp/desconectar', authenticateToken, authorizeRoles('mes', 'admin'), desconectarOPCUA)

// =============================
// 📊 ESTATÍSTICAS
// =============================
router.get('/estatisticas', authenticateToken, authorizeRoles('mes', 'admin'), obterEstatisticas)

export default router