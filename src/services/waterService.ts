import { api } from './api';
import { ZonaDeRisco, Sensor, Leitura, Alerta, OcorrenciaUsuario, ApiResponse, PaginatedResponse } from '../types';

const mockSensors: Sensor[] = [
  {
    id: 1,
    nome: 'Sensor Centro SP',
    descricao: 'Sensor de nível de água no centro de São Paulo',
    latitude: -23.5505,
    longitude: -46.6333,
    ativo: true,
    zonaDeRiscoId: 1,
    tipoSensorId: 1,
    dataInstalacao: '2024-01-15T00:00:00Z',
  },
  {
    id: 2,
    nome: 'Sensor Zona Norte',
    descricao: 'Monitoramento de enchentes na Zona Norte',
    latitude: -23.5200,
    longitude: -46.6100,
    ativo: true,
    zonaDeRiscoId: 2,
    tipoSensorId: 1,
    dataInstalacao: '2024-02-10T00:00:00Z',
  },
  {
    id: 3,
    nome: 'Sensor Zona Sul',
    descricao: 'Detector de alagamento Zona Sul',
    latitude: -23.5800,
    longitude: -46.6500,
    ativo: false,
    zonaDeRiscoId: 3,
    tipoSensorId: 1,
    dataInstalacao: '2024-03-05T00:00:00Z',
  },
  {
    id: 4,
    nome: 'Sensor Zona Leste',
    descricao: 'Monitoramento Itaquera/Zona Leste',
    latitude: -23.5300,
    longitude: -46.6000,
    ativo: true,
    zonaDeRiscoId: 4,
    tipoSensorId: 1,
    dataInstalacao: '2024-01-20T00:00:00Z',
  },
  {
    id: 5,
    nome: 'Sensor Zona Oeste',
    descricao: 'Detector de enchentes Pinheiros',
    latitude: -23.5400,
    longitude: -46.6700,
    ativo: true,
    zonaDeRiscoId: 5,
    tipoSensorId: 1,
    dataInstalacao: '2024-02-15T00:00:00Z',
  },
];

const mockZonas: ZonaDeRisco[] = [
  {
    id: 1,
    nome: 'Centro Histórico SP',
    descricao: 'Região central com risco de alagamento',
    endereco: 'Rua Augusta, 123 - Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    latitude: -23.5505,
    longitude: -46.6333,
    nivelCritico: 80,
    ativa: true,
    dataCriacao: '2024-01-15T00:00:00Z'
  },
  {
    id: 2,
    nome: 'Av Paulista',
    descricao: 'Avenida Paulista e adjacências',
    endereco: 'Av. Paulista, 456 - Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',
    latitude: -23.5614,
    longitude: -46.6554,
    nivelCritico: 75,
    ativa: true,
    dataCriacao: '2024-02-10T00:00:00Z'
  },
  {
    id: 3,
    nome: 'Marginal Pinheiros',
    descricao: 'Região da Marginal com histórico de enchentes',
    endereco: 'Av. Rebouças, 789 - Pinheiros',
    cidade: 'São Paulo',
    estado: 'SP',
    latitude: -23.5629,
    longitude: -46.6997,
    nivelCritico: 85,
    ativa: true,
    dataCriacao: '2024-03-05T00:00:00Z'
  },
  {
    id: 4,
    nome: 'Zona Leste - Itaquera',
    descricao: 'Região de Itaquera com pontos críticos',
    endereco: 'Av. Nagib Farah Maluf, 1000 - Itaquera',
    cidade: 'São Paulo',
    estado: 'SP',
    latitude: -23.5400,
    longitude: -46.4600,
    nivelCritico: 70,
    ativa: true,
    dataCriacao: '2024-01-20T00:00:00Z'
  },
  {
    id: 5,
    nome: 'Vila Madalena',
    descricao: 'Região boêmia com problemas de drenagem',
    endereco: 'Rua Harmonia, 200 - Vila Madalena',
    cidade: 'São Paulo',
    estado: 'SP',
    latitude: -23.5500,
    longitude: -46.6900,
    nivelCritico: 78,
    ativa: true,
    dataCriacao: '2024-02-15T00:00:00Z'
  },
];

const mockLeituras: Leitura[] = [
  {
    id: 1,
    valor: 45.2,
    dataHora: new Date().toISOString(),
    sensorId: 1,
  },
  {
    id: 2,
    valor: 78.5,
    dataHora: new Date(Date.now() - 300000).toISOString(),
    sensorId: 2,
  },
  {
    id: 3,
    valor: 32.1,
    dataHora: new Date(Date.now() - 600000).toISOString(),
    sensorId: 4,
  },
  {
    id: 4,
    valor: 67.8,
    dataHora: new Date(Date.now() - 900000).toISOString(),
    sensorId: 5,
  },
  {
    id: 5,
    valor: 91.2,
    dataHora: new Date(Date.now() - 1200000).toISOString(),
    sensorId: 2,
  },
];

const mockAlertas: Alerta[] = [
  {
    id: 1,
    titulo: 'Alerta Preventivo - Zona Norte',
    descricao: 'Nível de água acima de 70% detectado na região',
    dataHora: new Date(Date.now() - 1800000).toISOString(),
    nivel: 'Medio',
    ativo: true,
    zonaDeRiscoId: 2,
    tipoAlertaId: 1,
  },
  {
    id: 2,
    titulo: 'EMERGÊNCIA - Marginal Pinheiros',
    descricao: 'EMERGÊNCIA: Nível crítico ultrapassado - 91%',
    dataHora: new Date(Date.now() - 3600000).toISOString(),
    nivel: 'Critico',
    ativo: false,
    zonaDeRiscoId: 3,
    tipoAlertaId: 2,
  },
  {
    id: 3,
    titulo: 'Monitoramento - Centro',
    descricao: 'Situação sob controle, nível normal',
    dataHora: new Date(Date.now() - 7200000).toISOString(),
    nivel: 'Baixo',
    ativo: true,
    zonaDeRiscoId: 1,
    tipoAlertaId: 1,
  },
];

const mockOcorrencias: OcorrenciaUsuario[] = [
  {
    id: 1,
    titulo: 'Alagamento na Rua Augusta',
    descricao: 'Rua completamente alagada após chuva intensa. Trânsito interrompido.',
    latitude: -23.5505,
    longitude: -46.6333,
    dataOcorrencia: new Date(Date.now() - 3600000).toISOString(),
    nomeUsuario: 'João Silva',
    emailUsuario: 'joao.silva@email.com',
    telefoneUsuario: '(11) 99999-1234',
    tipoOcorrencia: 'Alagamento',
    status: 'Pendente',
    gravidade: 'Alta'
  },
  {
    id: 2,
    titulo: 'Enchente Marginal Pinheiros',
    descricao: 'Água invadiu pista da Marginal. Várias vias interditadas.',
    latitude: -23.5629,
    longitude: -46.6997,
    dataOcorrencia: new Date(Date.now() - 7200000).toISOString(),
    nomeUsuario: 'Maria Santos',
    emailUsuario: 'maria.santos@email.com',
    telefoneUsuario: '(11) 98888-5678',
    tipoOcorrencia: 'Enchente',
    status: 'EmAndamento',
    gravidade: 'Alta'
  },
  {
    id: 3,
    titulo: 'Risco de Deslizamento',
    descricao: 'Encosta instável após chuvas. Moradores evacuados preventivamente.',
    latitude: -23.5400,
    longitude: -46.4600,
    dataOcorrencia: new Date(Date.now() - 10800000).toISOString(),
    nomeUsuario: 'Carlos Oliveira',
    emailUsuario: 'carlos.oliveira@email.com',
    telefoneUsuario: '(11) 97777-9012',
    tipoOcorrencia: 'Deslizamento',
    status: 'Resolvida',
    gravidade: 'Media'
  },
];

//  Integração com API .NET
export const waterService = {
  // === SENSORES ===
  async getSensors(): Promise<Sensor[]> {
    try {
      const response = await api.get<Sensor[]>('/Sensor');
      console.log('Sensores carregados da API .NET:', response.data.length);
      return response.data;
    } catch (error) {
      console.warn('API indisponível, usando dados mockados para sensores');
      return mockSensors;
    }
  },

  async getSensorById(id: number): Promise<Sensor | undefined> {
    try {
      const response = await api.get<Sensor>(`/Sensor/${id}`);
      return response.data;
    } catch (error) {
      return mockSensors.find(sensor => sensor.id === id);
    }
  },

  async getSensoresPorZona(zonaId: number): Promise<Sensor[]> {
    try {
      const response = await api.get<Sensor[]>(`/Sensor/PorZona/${zonaId}`);
      return response.data;
    } catch (error) {
      return mockSensors.filter(sensor => sensor.zonaDeRiscoId === zonaId);
    }
  },

  // === ZONAS DE RISCO ===
  async getZonas(): Promise<ZonaDeRisco[]> {
    try {
      const response = await api.get<ZonaDeRisco[]>('/ZonaDeRisco');
      console.log('Zonas carregadas da API .NET:', response.data.length);
      return response.data;
    } catch (error) {
      console.warn('API indisponível, usando dados mockados para zonas');
      return mockZonas;
    }
  },

  async createZona(zona: Omit<ZonaDeRisco, 'id' | 'dataCriacao'>): Promise<ZonaDeRisco> {
    try {
      const response = await api.post<ZonaDeRisco>('/ZonaDeRisco', zona);
      console.log('Zona criada na API .NET:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar zona na API:', error);
      // Simulação para mock
      const newZona: ZonaDeRisco = {
        ...zona,
        id: Date.now(),
        dataCriacao: new Date().toISOString()
      };
      mockZonas.push(newZona);
      return newZona;
    }
  },

  async updateZona(id: number, zona: ZonaDeRisco): Promise<void> {
    try {
      await api.put(`/ZonaDeRisco/${id}`, zona);
      console.log('Zona atualizada na API .NET:', id);
    } catch (error) {
      console.error('Erro ao atualizar zona:', error);
      const index = mockZonas.findIndex(z => z.id === id);
      if (index !== -1) {
        mockZonas[index] = zona;
      }
    }
  },

  async deleteZona(id: number): Promise<void> {
    try {
      await api.delete(`/ZonaDeRisco/${id}`);
      console.log('Zona deletada da API .NET:', id);
    } catch (error) {
      console.error('Erro ao deletar zona:', error);
      const index = mockZonas.findIndex(z => z.id === id);
      if (index !== -1) {
        mockZonas.splice(index, 1);
      }
    }
  },

  // === LEITURAS ===
  async getLeituras(page: number = 1, limit: number = 10, regiao?: string): Promise<PaginatedResponse<Leitura>> {
    try {
      const response = await api.get<Leitura[]>('/Leitura');
      let data = response.data;

      // Filtrar por região se especificado
      if (regiao) {
        const sensores = await this.getSensors();
        const sensoresDaRegiao = sensores.filter(s =>
          s.zonaDeRisco?.nome.toLowerCase().includes(regiao.toLowerCase())
        );
        const sensorIds = sensoresDaRegiao.map(s => s.id);
        data = data.filter(l => sensorIds.includes(l.sensorId));
      }

      // Implementar paginação manual
      const totalItems = data.length;
      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = (page - 1) * limit;
      const paginatedData = data.slice(startIndex, startIndex + limit);

      return {
        data: paginatedData,
        totalItems,
        currentPage: page,
        totalPages
      };
    } catch (error) {
      console.warn('API indisponível, usando dados mockados para leituras');
      const totalItems = mockLeituras.length;
      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = (page - 1) * limit;
      const paginatedData = mockLeituras.slice(startIndex, startIndex + limit);

      return {
        data: paginatedData,
        totalItems,
        currentPage: page,
        totalPages
      };
    }
  },

  async getLeiturasRecentes(limit: number = 5): Promise<Leitura[]> {
    try {
      const response = await api.get<Leitura[]>('/Leitura');
      return response.data
        .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())
        .slice(0, limit);
    } catch (error) {
      return mockLeituras
        .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())
        .slice(0, limit);
    }
  },

  async getLeiturasPorSensor(sensorId: number): Promise<Leitura[]> {
    try {
      const response = await api.get<Leitura[]>(`/Leitura/sensor/${sensorId}`);
      return response.data;
    } catch (error) {
      return mockLeituras.filter(l => l.sensorId === sensorId);
    }
  },

  // === ALERTAS ===
  async getAlertas(): Promise<Alerta[]> {
    try {
      const response = await api.get<Alerta[]>('/Alerta');
      console.log('Alertas carregados da API .NET:', response.data.length);
      return response.data;
    } catch (error) {
      console.warn('API indisponível, usando dados mockados para alertas');
      return mockAlertas;
    }
  },

  async getAlertasAtivos(): Promise<Alerta[]> {
    try {
      const response = await api.get<Alerta[]>('/Alerta');
      return response.data.filter(alerta => alerta.ativo);
    } catch (error) {
      return mockAlertas.filter(alerta => alerta.ativo);
    }
  },

  async createAlerta(alerta: Omit<Alerta, 'id' | 'dataHora'>): Promise<Alerta> {
    try {
      const response = await api.post<Alerta>('/Alerta', alerta);
      return response.data;
    } catch (error) {
      const newAlerta: Alerta = {
        ...alerta,
        id: Date.now(),
        dataHora: new Date().toISOString()
      };
      mockAlertas.push(newAlerta);
      return newAlerta;
    }
  },

  async resolverAlerta(id: number): Promise<void> {
    try {
      const alerta = await api.get<Alerta>(`/Alerta/${id}`);
      await api.put(`/Alerta/${id}`, { ...alerta.data, ativo: false });
    } catch (error) {
      const alerta = mockAlertas.find(a => a.id === id);
      if (alerta) {
        alerta.ativo = false;
      }
    }
  },

  // === OCORRÊNCIAS ===
  async getOcorrencias(): Promise<OcorrenciaUsuario[]> {
    try {
      const response = await api.get<OcorrenciaUsuario[]>('/OcorrenciaUsuario');
      console.log('Ocorrências carregadas da API .NET:', response.data.length);
      return response.data;
    } catch (error) {
      console.warn('API indisponível, usando dados mockados para ocorrências');
      return mockOcorrencias;
    }
  },

  async createOcorrencia(ocorrencia: Omit<OcorrenciaUsuario, 'id'>): Promise<OcorrenciaUsuario> {
    try {
      const response = await api.post<OcorrenciaUsuario>('/OcorrenciaUsuario', ocorrencia);
      console.log('Ocorrência criada na API .NET:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar ocorrência:', error);
      const newOcorrencia: OcorrenciaUsuario = {
        ...ocorrencia,
        id: Date.now()
      };
      mockOcorrencias.push(newOcorrencia);
      return newOcorrencia;
    }
  },

  async updateOcorrencia(id: number, ocorrencia: OcorrenciaUsuario): Promise<void> {
    try {
      await api.put(`/OcorrenciaUsuario/${id}`, ocorrencia);
      console.log('Ocorrência atualizada na API .NET:', id);
    } catch (error) {
      console.error('Erro ao atualizar ocorrência:', error);
      const index = mockOcorrencias.findIndex(o => o.id === id);
      if (index !== -1) {
        mockOcorrencias[index] = ocorrencia;
      }
    }
  },

  async deleteOcorrencia(id: number): Promise<void> {
    try {
      await api.delete(`/OcorrenciaUsuario/${id}`);
      console.log('Ocorrência deletada da API .NET:', id);
    } catch (error) {
      console.error('Erro ao deletar ocorrência:', error);
      const index = mockOcorrencias.findIndex(o => o.id === id);
      if (index !== -1) {
        mockOcorrencias.splice(index, 1);
      }
    }
  },

  // === ESTATÍSTICAS PARA DASHBOARD ===
  async getEstatisticas() {
    try {
      console.log('Carregando estatísticas do dashboard...');
      const [sensores, alertas, leituras, ocorrencias] = await Promise.all([
        this.getSensors(),
        this.getAlertas(),
        this.getLeiturasRecentes(10),
        this.getOcorrencias()
      ]);

      const stats = {
        totalSensores: sensores.length,
        sensoresAtivos: sensores.filter(s => s.ativo).length,
        alertasAtivos: alertas.filter(a => a.ativo).length,
        alertasEmergencia: alertas.filter(a => a.ativo && a.nivel === 'Critico').length,
        mediaUltimosNiveis: leituras.length > 0
          ? Math.round(leituras.reduce((acc, l) => acc + l.valor, 0) / leituras.length)
          : 0,
        totalOcorrencias: ocorrencias.length,
        ocorrenciasPendentes: ocorrencias.filter(o => o.status === 'Pendente').length,
        ultimaAtualizacao: new Date(),
      };

      console.log('Estatísticas calculadas:', stats);
      return stats;
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      throw error;
    }
  }
};

export default waterService;
