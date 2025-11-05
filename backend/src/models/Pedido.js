import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clienteNome: { type: String, required: true },
  itens: [{
    produto: { type: Object, required: true },
    quantidade: { type: Number, required: true, min: 1 }
  }],
  valorTotal: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['Pendente de Aprovação', 'Aprovado', 'Rejeitado', 'Em Produção', 'Enviado'],
    default: 'Pendente de Aprovação'
  },
  observacoes: String,
  motivoRejeicao: String,
  prioridade: {
    type: String,
    enum: ['baixa', 'normal', 'alta'],
    default: 'normal'
  },
  dataAprovacao: Date,
  dataRejeicao: Date,
  dataUltimaAtualizacao: Date
}, { timestamps: true });

export default mongoose.models.Pedido || mongoose.model("Pedido", pedidoSchema);
