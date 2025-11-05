import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: true,
    minlength: 6
  },
  tipo: {
    type: String,
    enum: ['cliente', 'admin', 'mes'],
    default: 'cliente'
  }
}, {
  timestamps: true
})

// Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next()
  this.senha = await bcrypt.hash(this.senha, 10)
  next()
})

// Método para comparar senhas
userSchema.methods.compararSenha = async function(senha) {
  return await bcrypt.compare(senha, this.senha)
}

// Remover senha ao converter para JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject()
  delete obj.senha
  return obj
}

export default mongoose.models.User || mongoose.model("User", userSchema);
