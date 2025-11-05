import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' })
    }

    const senhaValida = await user.compararSenha(senha)
    if (!senhaValida) {
      return res.status(401).json({ message: 'Email ou senha inválidos' })
    }

    const token = jwt.sign(
      { id: user._id, tipo: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo
      },
      token
    })
  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({ message: 'Erro ao fazer login' })
  }
}

export const register = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Email já cadastrado' })
    }

    const user = await User.create({ nome, email, senha, tipo: tipo || 'cliente' })

    const token = jwt.sign(
      { id: user._id, tipo: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo
      },
      token
    })
  } catch (error) {
    console.error('Erro no registro:', error)
    res.status(500).json({ message: 'Erro ao criar usuário' })
  }
}

export const validateToken = async (req, res) => {
  res.json({ valid: true, user: req.user })
}

export const logout = async (req, res) => {
  res.json({ message: 'Logout realizado com sucesso' })
}