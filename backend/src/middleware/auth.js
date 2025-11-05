import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-senha')

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' })
  }
}

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.tipo)) {
      return res.status(403).json({ 
        message: 'Acesso negado. Permissão insuficiente.' 
      })
    }
    next()
  }
}