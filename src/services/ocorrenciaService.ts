import { api } from './api';
import { OcorrenciaUsuario } from '../types';

export const ocorrenciaService = {
  // GET: /api/OcorrenciaUsuario
  async getOcorrencias(): Promise<OcorrenciaUsuario[]> {
    try {
      const response = await api.get<OcorrenciaUsuario[]>('/OcorrenciaUsuario');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar ocorrências:', error);
      throw error;
    }
  },

  // GET: /api/OcorrenciaUsuario/{id}
  async getOcorrenciaById(id: number): Promise<OcorrenciaUsuario> {
    try {
      const response = await api.get<OcorrenciaUsuario>(`/OcorrenciaUsuario/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar ocorrência ${id}:`, error);
      throw error;
    }
  },

  // POST: /api/OcorrenciaUsuario
  async createOcorrencia(ocorrencia: Omit<OcorrenciaUsuario, 'id'>): Promise<OcorrenciaUsuario> {
    try {
      const response = await api.post<OcorrenciaUsuario>('/OcorrenciaUsuario', ocorrencia);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar ocorrência:', error);
      throw error;
    }
  },

  // PUT: /api/OcorrenciaUsuario/{id}
  async updateOcorrencia(id: number, ocorrencia: OcorrenciaUsuario): Promise<void> {
    try {
      await api.put(`/OcorrenciaUsuario/${id}`, ocorrencia);
    } catch (error) {
      console.error(`Erro ao atualizar ocorrência ${id}:`, error);
      throw error;
    }
  },

  // DELETE: /api/OcorrenciaUsuario/{id}
  async deleteOcorrencia(id: number): Promise<void> {
    try {
      await api.delete(`/OcorrenciaUsuario/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar ocorrência ${id}:`, error);
      throw error;
    }
  },
};
