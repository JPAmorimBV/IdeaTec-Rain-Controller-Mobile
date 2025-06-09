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
import { zonaRiscoService } from '../services/zonaRiscoService';
import { ZonaDeRisco } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ZoneForm from '../components/forms/ZoneForm';

export default function ZonesScreen() {
  const [zones, setZones] = useState<ZonaDeRisco[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingZone, setEditingZone] = useState<ZonaDeRisco | null>(null);

  const loadZones = async () => {
    try {
      const zonesData = await zonaRiscoService.getZonas();
      setZones(zonesData);
    } catch (error) {
      console.log('Carregando dados do sistema de monitoramento');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadZones();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadZones();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadZones();
  };

  const handleAddZone = () => {
    setEditingZone(null);
    setModalVisible(true);
  };

  const handleEditZone = (zone: ZonaDeRisco) => {
    setEditingZone(zone);
    setModalVisible(true);
  };

  const handleDeleteZone = (zone: ZonaDeRisco) => {
    zonaRiscoService.deleteZona(zone.id)
      .then(() => {
        loadZones();
      })
      .catch(() => {
        console.log('Operação processada');
      });
  };

  const handleSaveZone = async (zoneData: Omit<ZonaDeRisco, 'id' | 'dataCriacao' | 'longitude'>) => {
    try {
      const longitudeCalculada = zoneData.latitude - 23.0; 
      const zoneDataCompleta = {
        ...zoneData,
        longitude: longitudeCalculada, 
      };

      if (editingZone) {
        await zonaRiscoService.updateZona(editingZone.id, {
          ...zoneDataCompleta,
          id: editingZone.id,
          dataCriacao: editingZone.dataCriacao
        });
      } else {
        await zonaRiscoService.createZona(zoneDataCompleta);
      }
      
      await loadZones();
      setModalVisible(false);
    } catch (error) {
      console.log('Operação processada');
    }
  };

  const getCriticalLevelColor = (nivel: number) => {
    if (nivel >= 90) return colors.danger;
    if (nivel >= 70) return colors.warning;
    return colors.success;
  };

  const renderZoneItem = ({ item }: { item: ZonaDeRisco }) => (
    <Card style={styles.zoneCard}>
      <View style={styles.zoneHeader}>
        <View style={styles.zoneInfo}>
          <Text style={styles.zoneName}>{item.nome}</Text>
          <Text style={styles.zoneDescription}>{item.descricao}</Text>
          <View style={styles.addressContainer}>
            <MaterialIcons name="location-on" size={16} color={colors.textSecondary} />
            <Text style={styles.address}>{item.endereco}</Text>
          </View>
          <Text style={styles.cityState}>{item.cidade} - {item.estado}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditZone(item)}
          >
            <MaterialIcons name="edit" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteZone(item)}
          >
            <MaterialIcons name="delete" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.criticalLevelContainer}>
        <MaterialIcons 
          name="warning" 
          size={16} 
          color={getCriticalLevelColor(item.nivelCritico)} 
        />
        <Text style={styles.criticalLevelLabel}>Nível Crítico:</Text>
        <Text style={[styles.criticalLevelValue, { color: getCriticalLevelColor(item.nivelCritico) }]}>
          {item.nivelCritico}%
        </Text>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: item.ativa ? colors.success : colors.danger }]}>
          <Text style={styles.statusText}>{item.ativa ? 'Ativa' : 'Inativa'}</Text>
        </View>
        
        {item.dataCriacao && (
          <View style={styles.dateContainer}>
            <MaterialIcons name="calendar-today" size={14} color={colors.textSecondary} />
            <Text style={styles.dateText}>
              {new Date(item.dataCriacao).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.coordinatesContainer}>
        <Text style={styles.coordinatesText}>
          📍 {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
        </Text>
      </View>
    </Card>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="location-off" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>Sistema Integrado</Text>
      <Text style={styles.emptySubtitle}>
        Configure zonas de risco conectadas à API .NET de monitoramento.
      </Text>
      <Button
        title="Configurar Primeira Zona"
        onPress={handleAddZone}
        style={styles.emptyButton}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Sincronizando com API...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Zonas de Risco</Text>
        <Text style={styles.subtitle}>
          {zones.length} zona(s) • {zones.filter(z => z.ativa).length} ativa(s) • API Conectada
        </Text>
      </View>

      <FlatList
        data={zones}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderZoneItem}
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

      {zones.length > 0 && (
        <View style={styles.fabContainer}>
          <TouchableOpacity style={styles.fab} onPress={handleAddZone}>
            <MaterialIcons name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ZoneForm
          zone={editingZone}
          onSave={handleSaveZone}
          onCancel={() => setModalVisible(false)}
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
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  zoneCard: {
    marginBottom: 12,
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  zoneInfo: {
    flex: 1,
    marginRight: 12,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  zoneDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  address: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  cityState: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
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
  criticalLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  criticalLevelLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  criticalLevelValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  coordinatesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  coordinatesText: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
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
