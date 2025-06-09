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
import { Alerta } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<Alerta[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todos' | 'ativos' | 'inativos'>('todos');

  const loadAlerts = async () => {
    try {
      const alertsData = await waterService.getAlertas();
      setAlerts(alertsData);
    } catch (error) {
      Alert.alert(
        'Erro de Conexão',
        'Não foi possível carregar os alertas.',
        [{ text: 'OK' }]
      );
      console.error('Erro ao carregar alertas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAlerts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadAlerts();
  };

  const handleResolveAlert = async (alertId: number) => {
    Alert.alert(
      'Resolver Alerta',
      'Deseja marcar este alerta como inativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resolver',
          onPress: async () => {
            try {
              await waterService.resolverAlerta(alertId);
              await loadAlerts();
              Alert.alert('Sucesso', 'Alerta marcado como resolvido!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível resolver o alerta.');
            }
          }
        },
      ]
    );
  };

  const getFilteredAlerts = () => {
    switch (filter) {
      case 'ativos':
        return alerts.filter(alert => alert.ativo);
      case 'inativos':
        return alerts.filter(alert => !alert.ativo);
      default:
        return alerts;
    }
  };

  const getAlertIcon = (nivel: string): keyof typeof MaterialIcons.glyphMap => {
    switch (nivel) {
      case 'Critico':
        return 'dangerous';
      case 'Alto':
        return 'priority-high';
      case 'Medio':
        return 'warning';
      case 'Baixo':
        return 'info';
      default:
        return 'help';
    }
  };

  const getAlertColor = (nivel: string) => {
    switch (nivel) {
      case 'Critico':
        return colors.danger;
      case 'Alto':
        return '#FF8C00';
      case 'Medio':
        return colors.warning;
      case 'Baixo':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      {[
        { key: 'todos', label: 'Todos' },
        { key: 'ativos', label: 'Ativos' },
        { key: 'inativos', label: 'Inativos' }
      ].map((filterOption) => (
        <TouchableOpacity
          key={filterOption.key}
          style={[
            styles.filterButton,
            filter === filterOption.key && styles.filterButtonActive
          ]}
          onPress={() => setFilter(filterOption.key as typeof filter)}
        >
          <Text style={[
            styles.filterButtonText,
            filter === filterOption.key && styles.filterButtonTextActive
          ]}>
            {filterOption.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAlertItem = ({ item }: { item: Alerta }) => {
  const cardStyle = {
    ...styles.alertCard,
    borderLeftColor: getAlertColor(item.nivel),
    borderLeftWidth: 4,
    marginBottom: 12,
  };

  return (
    <Card style={cardStyle}>
      <View style={styles.alertHeader}>
        <View style={styles.alertInfo}>
          <View style={styles.statusContainer}>
            <MaterialIcons
              name={getAlertIcon(item.nivel)}
              size={20}
              color={getAlertColor(item.nivel)}
            />
            <Text style={[styles.nivelText, { color: getAlertColor(item.nivel) }]}>
              {item.nivel.toUpperCase()}
            </Text>
            {!item.ativo && (
              <View style={styles.resolvedBadge}>
                <Text style={styles.resolvedText}>RESOLVIDO</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.alertTitle}>{item.titulo}</Text>
        </View>

        {item.ativo && (
          <TouchableOpacity
            style={styles.resolveButton}
            onPress={() => handleResolveAlert(item.id)}
          >
            <MaterialIcons name="check" size={20} color={colors.success} />
          </TouchableOpacity>
        )}
      </View>

      {item.descricao && (
        <Text style={styles.description}>{item.descricao}</Text>
      )}

      <View style={styles.alertFooter}>
        <View style={styles.dateContainer}>
          <MaterialIcons name="access-time" size={16} color={colors.textSecondary} />
          <Text style={styles.dateText}>
            {new Date(item.dataHora).toLocaleString('pt-BR')}
          </Text>
        </View>

        <View style={styles.statusIndicator}>
          <View style={[
            styles.statusDot,
            { backgroundColor: item.ativo ? getAlertColor(item.nivel) : colors.success }
          ]} />
          <Text style={styles.statusText}>
            {item.ativo ? 'Ativo' : 'Resolvido'}
          </Text>
        </View>
      </View>
    </Card>
  );
};


  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="notifications-off" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>
        {filter === 'ativos' 
          ? 'Nenhum alerta ativo' 
          : filter === 'inativos'
          ? 'Nenhum alerta resolvido'
          : 'Nenhum alerta encontrado'
        }
      </Text>
      <Text style={styles.emptySubtitle}>
        {filter === 'ativos'
          ? 'Todos os alertas foram resolvidos. Sistema funcionando normalmente.'
          : filter === 'inativos'
          ? 'Ainda não há alertas resolvidos no sistema.'
          : 'O sistema de monitoramento não detectou alertas.'
        }
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Carregando alertas...</Text>
      </View>
    );
  }

  const filteredAlerts = getFilteredAlerts();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sistema de Alertas</Text>
        <Text style={styles.subtitle}>
          {alerts.filter(a => a.ativo).length} alerta(s) ativo(s) de {alerts.length} total
        </Text>
      </View>

      {renderFilterButtons()}

      <FlatList
        data={filteredAlerts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAlertItem}
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
  alertCard: {
    marginBottom: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertInfo: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  nivelText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  resolvedBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  resolvedText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: 'bold',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  resolveButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: colors.successLight || '#E6F7E6',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
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
});
