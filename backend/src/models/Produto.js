import mongoose from 'mongoose';

const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  descricao: { type: String, required: true },
  preco: { type: Number, required: true, min: 0 },
  estoque: { type: Number, required: true, min: 0, default: 0 },
  foto: { type: String, default: null }
}, { timestamps: true });

export default mongoose.models.Produto || mongoose.model("Produto", produtoSchema);
