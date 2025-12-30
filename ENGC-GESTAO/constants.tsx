
import { Status, Criticidade, Equipamento, Chamado, OS, POP } from './types';

export const MOCK_EQUIPAMENTOS: Equipamento[] = [
  { id: '1', nome: 'Ventilador Pulmonar', patrimonio: 'EC-2024-001', setor: 'UTI Adulto', marca: 'Dräger', modelo: 'Evita V500', serie: 'DRG-9921', criticidade: Criticidade.URGENTE, status: Status.OPERACIONAL },
  { id: '2', nome: 'Monitor Multiparamétrico', patrimonio: 'EC-2024-042', setor: 'Emergência', marca: 'Philips', modelo: 'IntelliVue MX450', serie: 'PHL-1122', criticidade: Criticidade.ALTA, status: Status.OPERACIONAL },
  { id: '3', nome: 'Bomba de Infusão', patrimonio: 'EC-2024-156', setor: 'Pediatria', marca: 'Baxter', modelo: 'Spectrum IQ', serie: 'BAX-7788', criticidade: Criticidade.MEDIA, status: Status.MANUTENCAO },
  { id: '4', nome: 'Desfibrilador', patrimonio: 'EC-2024-089', setor: 'Centro Cirúrgico', marca: 'Zoll', modelo: 'R Series', serie: 'ZOL-4455', criticidade: Criticidade.URGENTE, status: Status.OPERACIONAL },
];

export const MOCK_CHAMADOS: Chamado[] = [
  { id: 'CH-101', setor: 'UTI Adulto', equipamentoId: '1', equipamentoNome: 'Ventilador Pulmonar', status: Status.ABERTO, criticidade: Criticidade.URGENTE, dataHora: '2024-05-20 08:30', descricao: 'Alarme de baixa pressão de O2 persistente.' },
  { id: 'CH-102', setor: 'Emergência', equipamentoId: '2', equipamentoNome: 'Monitor Multiparamétrico', status: Status.EM_ATENDIMENTO, criticidade: Criticidade.ALTA, dataHora: '2024-05-20 09:15', descricao: 'Tela piscando intermitente.' },
  { id: 'CH-103', setor: 'Pediatria', equipamentoId: '3', equipamentoNome: 'Bomba de Infusão', status: Status.PENDENTE, criticidade: Criticidade.MEDIA, dataHora: '2024-05-19 14:00', descricao: 'Erro de oclusão mesmo sem obstrução.' },
];

export const MOCK_OS: OS[] = [
  { id: 'OS-501', equipamentoNome: 'Ventilador Pulmonar', tecnico: 'Ricardo Silva', status: Status.EM_ATENDIMENTO, data: '20/05/2024', diagnostico: 'Válvula expiradora com desgaste excessivo.' },
  { id: 'OS-502', equipamentoNome: 'Autoclave Vertical', tecnico: 'Ana Costa', status: Status.CONCLUIDO, data: '18/05/2024', diagnostico: 'Resistência trocada e vedação ajustada.' },
];

export const MOCK_POPS: POP[] = [
  { id: 'POP-01', categoria: 'Ventilação', titulo: 'Higienização de Ventiladores Dräger', conteudo: '1. Desligar da rede elétrica...\n2. Remover circuitos...\n3. Utilizar álcool 70%...' },
  { id: 'POP-02', categoria: 'Segurança', titulo: 'Teste de Segurança Elétrica (NBR 60601)', conteudo: 'Procedimento para medição de corrente de fuga e resistência de aterramento...' },
];

export const COLORS = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
};
