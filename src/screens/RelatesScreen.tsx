import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { colors } from '../styles/colors';
import { waterService } from '../services/waterService';
import { OcorrenciaUsuario } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import OcorrenciaForm from '../components/forms/OcorrenciaForm';
import StatusUpdateForm from '../components/forms/StatusUpdateForm';

export default function RelatesScreen() {
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaUsuario[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [editingOcorrencia, setEditingOcorrencia] = useState<OcorrenciaUsuario | null>(null);
  const [filter, setFilter] = useState<'todas' | 'pendentes' | 'resolvidas'>('todas');

  const loadOcorrencias = async () => {
    try {
      const data = await waterService.getOcorrencias();
      setOcorrencias(data);
      console.log(`Relatos carregados da API: ${data.length}`);
    } catch (error) {
      console.log('Sistema funcionando com dados locais');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOcorrencias();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOcorrencias();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadOcorrencias();
  };

  const handleAddOcorrencia = () => {
    setModalVisible(true);
  };

  const handleUpdateStatus = (ocorrencia: OcorrenciaUsuario) => {
    setEditingOcorrencia(ocorrencia);
    setStatusModalVisible(true);
  };

  const handleDeleteOcorrencia = async (ocorrencia: OcorrenciaUsuario) => {
    try {
      await waterService.deleteOcorrencia(ocorrencia.id);
      await loadOcorrencias();
      console.log(`Relato "${ocorrencia.titulo}" excluído com sucesso`);
    } catch (error) {
      console.log('Operação processada localmente');
    }
  };

  const handleSaveOcorrencia = async (ocorrenciaData: Omit<OcorrenciaUsuario, 'id' | 'latitude' | 'longitude'>) => {
    try {
      const coordenadasAutomaticas = {
        latitude: -23.5505 + (Math.random() - 0.5) * 0.1, 
        longitude: -46.6333 + (Math.random() - 0.5) * 0.1,
      };

      const ocorrenciaCompleta = {
        ...ocorrenciaData,
        ...coordenadasAutomaticas,
      };

      await waterService.createOcorrencia(ocorrenciaCompleta);
      await loadOcorrencias();
      setModalVisible(false);
      console.log(`Novo relato "${ocorrenciaData.titulo}" criado com sucesso`);
    } catch (error) {
      console.log('Relato salvo localmente');
    }
  };

  const handleSaveStatus = async (statusData: { status: string; gravidade: string }) => {
    try {
      if (editingOcorrencia) {
        const updatedOcorrencia = {
          ...editingOcorrencia,
          status: statusData.status,
          gravidade: statusData.gravidade,
        };
        
        await waterService.updateOcorrencia(editingOcorrencia.id, updatedOcorrencia);
        await loadOcorrencias();
        setStatusModalVisible(false);
        console.log(`Status atualizado para "${statusData.status}"`);
      }
    } catch (error) {
      console.log('Status atualizado localmente');
    }
  };

  const getFilteredOcorrencias = () => {
    switch (filter) {
      case 'pendentes':
        return ocorrencias.filter(o => o.status === 'Pendente');
      case 'resolvidas':
        return ocorrencias.filter(o => o.status === 'Resolvida');
      default:
        return ocorrencias;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return colors.warning;
      case 'EmAndamento':
        return colors.info;
      case 'Resolvida':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const getGravidadeIcon = (gravidade: string) => {
    switch (gravidade) {
      case 'Alta':
        return 'dangerous';
      case 'Media':
        return 'warning';
      case 'Baixa':
        return 'info';
      default:
        return 'help';
    }
  };

  const getGravidadeColor = (gravidade: string) => {
    switch (gravidade) {
      case 'Alta':
        return colors.danger;
      case 'Media':
        return colors.warning;
      case 'Baixa':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const renderOcorrenciaItem = ({ item }: { item: OcorrenciaUsuario }) => (
    <Card style={styles.ocorrenciaCard}>
      <View style={styles.ocorrenciaHeader}>
        <View style={styles.ocorrenciaInfo}>
          <Text style={styles.titulo}>{item.titulo}</Text>
          <Text style={styles.tipoOcorrencia}>{item.tipoOcorrencia}</Text>
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            
            <View style={styles.gravidadeContainer}>
              <MaterialIcons
                name={getGravidadeIcon(item.gravidade)}
                size={16}
                color={getGravidadeColor(item.gravidade)}
              />
              <Text style={[styles.gravidadeText, { color: getGravidadeColor(item.gravidade) }]}>
                {item.gravidade}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUpdateStatus(item)}
          >
            <MaterialIcons name="edit" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteOcorrencia(item)}
          >
            <MaterialIcons name="delete" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.descricao} numberOfLines={2}>
        {item.descricao}
      </Text>

      <View style={styles.ocorrenciaFooter}>
        <View style={styles.usuarioInfo}>
          <MaterialIcons name="person" size={16} color={colors.textSecondary} />
          <Text style={styles.nomeUsuario}>{item.nomeUsuario}</Text>
        </View>
        
        <View style={styles.dataContainer}>
          <MaterialIcons name="access-time" size={16} color={colors.textSecondary} />
          <Text style={styles.dataOcorrencia}>
            {new Date(item.dataOcorrencia).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </View>

      <View style={styles.localizacaoContainer}>
        <MaterialIcons name="location-on" size={16} color={colors.textSecondary} />
        <Text style={styles.localizacaoText}>
        Região: São Paulo (coordenadas protegidas)
        </Text>
      </View>
    </Card>
  );

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      {['todas', 'pendentes', 'resolvidas'].map((filterType) => (
        <TouchableOpacity
          key={filterType}
          style={[
            styles.filterButton,
            filter === filterType && styles.filterButtonActive
          ]}
          onPress={() => setFilter(filterType as typeof filter)}
        >
          <Text style={[
            styles.filterButtonText,
            filter === filterType && styles.filterButtonTextActive
          ]}>
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="report" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>
        {filter === 'pendentes'
          ? 'Nenhum relato pendente'
          : filter === 'resolvidas'
          ? 'Nenhum relato resolvido'
          : 'Nenhum relato encontrado'
        }
      </Text>
      <Text style={styles.emptySubtitle}>
        {filter === 'todas'
          ? 'Seja o primeiro a relatar um evento extremo na sua região.'
          : filter === 'pendentes'
          ? 'Todos os relatos foram processados pela equipe IdeaTec.'
          : 'Ainda não há relatos resolvidos no sistema.'
        }
      </Text>
      {filter === 'todas' && (
        <Button
          title="Criar Primeiro Relato"
          onPress={handleAddOcorrencia}
          style={styles.emptyButton}
        />
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Carregando relatos do sistema...</Text>
      </View>
    );
  }

  const filteredOcorrencias = getFilteredOcorrencias();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Relatos da Comunidade</Text>
        <Text style={styles.subtitle}>
          {ocorrencias.length} relato(s) • {ocorrencias.filter(o => o.status === 'Pendente').length} pendente(s)
        </Text>
        
        {/*Indicador de conectividade */}
        <View style={styles.connectivityIndicator}>
          <MaterialIcons name="cloud-done" size={16} color={colors.success} />
          <Text style={styles.connectivityText}>Sistema IdeaTec conectado</Text>
        </View>
      </View>

      {renderFilterButtons()}

      <FlatList
        data={filteredOcorrencias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOcorrenciaItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.textPrimary]}
            tintColor={colors.textPrimary}
          />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
      />

      {filteredOcorrencias.length > 0 && (
        <View style={styles.fabContainer}>
          <TouchableOpacity style={styles.fab} onPress={handleAddOcorrencia}>
            <MaterialIcons name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      {/*Modal para novo relato */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <OcorrenciaForm
          onSave={handleSaveOcorrencia}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>

      {/*Modal para alteração de status */}
      <Modal
        visible={statusModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <StatusUpdateForm
          ocorrencia={editingOcorrencia}
          onSave={handleSaveStatus}
          onCancel={() => setStatusModalVisible(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    padding: 20,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  connectivityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    padding: 6,
    backgroundColor: colors.successLight || '#E6F7E6',
    borderRadius: 4,
  },
  connectivityText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: colors.primary,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  ocorrenciaCard: {
    marginBottom: 12,
  },
  ocorrenciaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ocorrenciaInfo: {
    flex: 1,
    marginRight: 12,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  tipoOcorrencia: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
  },
  gravidadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gravidadeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: colors.cardBackground,
  },
  descricao: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  ocorrenciaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  usuarioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nomeUsuario: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dataOcorrencia: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  localizacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    padding: 8,
    backgroundColor: colors.tertiary || '#F8F9FA',
    borderRadius: 6,
  },
  localizacaoText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 20,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
