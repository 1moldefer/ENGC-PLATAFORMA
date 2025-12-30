
export type Screen = 
  | 'LOGIN' 
  | 'HOME' 
  | 'CHAMADOS' 
  | 'ABRIR_CHAMADO' 
  | 'DETALHE_CHAMADO'
  | 'OS' 
  | 'DETALHE_OS' 
  | 'RONDAS' 
  | 'INVENTARIO' 
  | 'DETALHE_EQUIPAMENTO'
  | 'DASHBOARD'
  | 'PREVENTIVAS'
  | 'MAPA_HOSPITAL'
  | 'ALMOXARIFADO'
  | 'RELATORIOS'
  | 'POPS'
  | 'POP_LEITURA'
  | 'IA'
  | 'SCANNER';

export enum Status {
  ABERTO = 'Aberto',
  EM_ATENDIMENTO = 'Em Atendimento',
  CONCLUIDO = 'Concluído',
  CRITICO = 'Crítico',
  PENDENTE = 'Pendente',
  INTERDITADO = 'Interditado',
  ENVIADO_EXTERNO = 'Externo',
  OPERACIONAL = 'Operacional',
  MANUTENCAO = 'Manutenção'
}

export enum Criticidade {
  BAIXA = 'Baixa',
  MEDIA = 'Média',
  ALTA = 'Alta',
  URGENTE = 'Urgente'
}

export interface Peca {
  id: string;
  nome: string;
  codigo: string;
  estoque: number;
  estoqueMinimo: number;
  preco: number;
}

export interface Preventiva {
  id: string;
  equipamentoId: string;
  equipamentoNome: string;
  dataProgramada: string;
  setor: string;
  status: 'Pendente' | 'Realizada' | 'Atrasada';
}

export interface Equipamento {
  id: string;
  nome: string;
  patrimonio: string;
  setor: string;
  marca: string;
  modelo: string;
  serie: string;
  criticidade: Criticidade;
  status: Status;
  ultimaPreventiva?: string;
  proximaPreventiva?: string;
}

export interface Chamado {
  id: string;
  setor: string;
  equipamentoId: string;
  equipamentoNome: string;
  status: Status;
  criticidade: Criticidade;
  dataHora: string;
  descricao: string;
}

export interface OS {
  id: string;
  equipamentoNome: string;
  tecnico: string;
  status: Status;
  data: string;
  diagnostico: string;
}

export interface POP {
  id: string;
  categoria: string;
  titulo: string;
  conteudo: string;
}
