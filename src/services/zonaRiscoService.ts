import { api } from './api';
import { ZonaDeRisco } from '../types';

export const zonaRiscoService = {
  // GET: /api/ZonaDeRisco
  async getZonas(): Promise<ZonaDeRisco[]> {
    try {
      const response = await api.get<ZonaDeRisco[]>('/ZonaDeRisco');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar zonas de risco:', error);
      throw error;
    }
  },

  // GET: /api/ZonaDeRisco/{id}
  async getZonaById(id: number): Promise<ZonaDeRisco> {
    try {
      const response = await api.get<ZonaDeRisco>(`/ZonaDeRisco/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar zona ${id}:`, error);
      throw error;
    }
  },

  // POST: /api/ZonaDeRisco
  async createZona(zona: Omit<ZonaDeRisco, 'id' | 'dataCriacao'>): Promise<ZonaDeRisco> {
    try {
      const response = await api.post<ZonaDeRisco>('/ZonaDeRisco', zona);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar zona:', error);
      throw error;
    }
  },

  // PUT: /api/ZonaDeRisco/{id}
  async updateZona(id: number, zona: ZonaDeRisco): Promise<void> {
    try {
      await api.put(`/ZonaDeRisco/${id}`, zona);
    } catch (error) {
      console.error(`Erro ao atualizar zona ${id}:`, error);
      throw error;
    }
  },

  // DELETE: /api/ZonaDeRisco/{id}
  async deleteZona(id: number): Promise<void> {
    try {
      await api.delete(`/ZonaDeRisco/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar zona ${id}:`, error);
      throw error;
    }
  },
};
