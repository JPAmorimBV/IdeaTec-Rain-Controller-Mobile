export interface ZonaDeRisco {
  id: number;
  nome: string;
  descricao: string;
  endereco: string;
  cidade: string;
  estado: string;
  latitude: number;
  longitude: number;
  nivelCritico: number;
  ativa: boolean;
  dataCriacao: string;
}

export interface Sensor {
  id: number;
  nome: string;
  descricao: string;
  latitude: number;
  longitude: number;
  ativo: boolean;
  zonaDeRiscoId: number;
  tipoSensorId: number;
  dataInstalacao: string;
  zonaDeRisco?: ZonaDeRisco;
  tipoSensor?: TipoSensor;
}

export interface TipoSensor {
  id: number;
  nome: string;
  descricao: string;
  unidadeMedida: string;
}

export interface Leitura {
  id: number;
  valor: number;
  dataHora: string;
  sensorId: number;
  sensor?: Sensor;
}

export interface Alerta {
  id: number;
  titulo: string;
  descricao: string;
  dataHora: string;
  nivel: string; 
  ativo: boolean;
  zonaDeRiscoId: number;
  tipoAlertaId: number;
  zonaDeRisco?: ZonaDeRisco;
  tipoAlerta?: TipoAlerta;
}

export interface TipoAlerta {
  id: number;
  nome: string;
  descricao: string;
  cor: string;
}

export interface OcorrenciaUsuario {
  id: number;
  titulo: string;
  descricao: string;
  latitude: number;
  longitude: number;
  dataOcorrencia: string;
  nomeUsuario: string;
  emailUsuario: string;
  telefoneUsuario: string;
  tipoOcorrencia: string;
  status: string; 
  gravidade: string; 
}

export interface EnvioAlerta {
  id: number;
  dataEnvio: string;
  sucesso: boolean;
  mensagemRetorno: string;
  alertaId: number;
  canalAlertaId: number;
  alerta?: Alerta;
  canalAlerta?: CanalAlerta;
}

export interface CanalAlerta {
  id: number;
  nome: string;
  tipo: string; 
  ativo: boolean;
}

// Tipos para respostas da API
export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}
