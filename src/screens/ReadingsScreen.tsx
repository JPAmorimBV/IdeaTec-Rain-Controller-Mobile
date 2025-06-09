import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { colors } from '../styles/colors';
import { waterService } from '../services/waterService';
import { Leitura } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';

export default function ReadingsScreen() {
  const [readings, setReadings] = useState<Leitura[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [regions, setRegions] = useState<string[]>([]);

  const loadReadings = async (page: number = 1, regiao?: string) => {
    try {
      const response = await waterService.getLeituras(page, 10, regiao);
      
      if (page === 1) {
        setReadings(response.data);
      } else {
        setReadings(prev => [...prev, ...response.data]);
      }
      
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (error) {
      Alert.alert(
        'Erro de Conexão',
        'Não foi possível carregar as leituras dos sensores.',
        [{ text: 'OK' }]
      );
      console.error('Erro ao carregar leituras:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadRegions = async () => {
    try {
      const sensores = await waterService.getSensors();
      const uniqueRegions = [...new Set(sensores.map(s => s.zonaDeRisco?.nome).filter(Boolean))] as string[];
      setRegions(uniqueRegions);
    } catch (error) {
      console.error('Erro ao carregar regiões:', error);
    }
  };

  useEffect(() => {
    loadReadings();
    loadRegions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReadings(1, selectedRegion);
    }, [selectedRegion])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    loadReadings(1, selectedRegion);
  };

  const onLoadMore = () => {
    if (currentPage < totalPages && !loading) {
      loadReadings(currentPage + 1, selectedRegion);
    }
  };

  const handleFilterChange = (regiao: string) => {
    setSelectedRegion(regiao);
    setCurrentPage(1);
    setLoading(true);
    loadReadings(1, regiao);
  };

  const getWaterLevelColor = (valor: number) => {
    if (valor >= 90) return colors.danger;
    if (valor >= 70) return colors.warning;
    if (valor >= 50) return colors.info;
    return colors.success;
  };

  const getWaterLevelIcon = (valor: number) => {
    if (valor >= 90) return 'dangerous';
    if (valor >= 70) return 'warning';
    if (valor >= 50) return 'info';
    return 'check-circle';
  };

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Filtrar por Região:</Text>
      <View style={styles.filterButtons}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedRegion === '' && styles.filterButtonActive
          ]}
          onPress={() => handleFilterChange('')}
        >
          <Text style={[
            styles.filterButtonText,
            selectedRegion === '' && styles.filterButtonTextActive
          ]}>
            Todas
          </Text>
        </TouchableOpacity>
        
        {regions.map((region) => (
          <TouchableOpacity
            key={region}
            style={[
              styles.filterButton,
              selectedRegion === region && styles.filterButtonActive
            ]}
            onPress={() => handleFilterChange(region)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedRegion === region && styles.filterButtonTextActive
            ]}>
              {region}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderReadingItem = ({ item }: { item: Leitura }) => (
    <Card style={styles.readingCard}>
      <View style={styles.readingHeader}>
        <View style={styles.readingInfo}>
          <Text style={styles.sensorInfo}>Sensor #{item.sensorId}</Text>
          <Text style={styles.readingDate}>
            {new Date(item.dataHora).toLocaleString('pt-BR')}
          </Text>
        </View>
        
        <View style={styles.levelContainer}>
          <MaterialIcons
            name={getWaterLevelIcon(item.valor)}
            size={24}
            color={getWaterLevelColor(item.valor)}
          />
          <Text style={[styles.levelValue, { color: getWaterLevelColor(item.valor) }]}>
            {item.valor.toFixed(1)}mm
          </Text>
        </View>
      </View>

      {/* Indicador visual de nível */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(item.valor, 100)}%`,
                backgroundColor: getWaterLevelColor(item.valor)
              }
            ]} 
          />
        </View>
        <Text style={styles.progressLabel}>Nível de Água</Text>
      </View>
    </Card>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="analytics" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>Nenhuma leitura encontrada</Text>
      <Text style={styles.emptySubtitle}>
        {selectedRegion 
          ? `Não há leituras para a região "${selectedRegion}".`
          : 'Aguarde os sensores coletarem dados de monitoramento.'
        }
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (currentPage >= totalPages) return null;
    
    return (
      <View style={styles.footerContainer}>
        <LoadingSpinner size="small" />
        <Text style={styles.footerText}>Carregando mais leituras...</Text>
      </View>
    );
  };

  if (loading && currentPage === 1) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Carregando leituras...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico de Leituras</Text>
        <Text style={styles.subtitle}>
          {readings.length} leitura(s) • Página {currentPage} de {totalPages}
        </Text>
      </View>

      {renderFilterButtons()}

      <FlatList
        data={readings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReadingItem}
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
        ListFooterComponent={renderFooter}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
      />
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
  filterContainer: {
    padding: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  filterButtonText: {
    fontSize: 12,
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
  readingCard: {
    marginBottom: 12,
  },
  readingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  readingInfo: {
    flex: 1,
  },
  sensorInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  readingDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
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
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
