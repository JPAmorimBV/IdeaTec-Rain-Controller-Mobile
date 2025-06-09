import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors } from '../../styles/colors';

interface FilterFormProps {
  onFilterChange: (regiao: string) => void;
  selectedRegion: string;
}

export default function FilterForm({ onFilterChange, selectedRegion }: FilterFormProps) {
  const [searchText, setSearchText] = useState(selectedRegion);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setSearchText(selectedRegion);
  }, [selectedRegion]);

  const handleSearch = () => {
    onFilterChange(searchText.trim());
  };

  const handleClear = () => {
    setSearchText('');
    onFilterChange('');
  };

  const predefinedRegions = [
    'Centro',
    'Zona Norte',
    'Zona Sul',
    'Zona Leste',
    'Zona Oeste',
  ];

  const handleRegionSelect = (regiao: string) => {
    setSearchText(regiao);
    onFilterChange(regiao);
    setIsExpanded(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterHeader}>
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <MaterialIcons 
            name={isExpanded ? 'expand-less' : 'expand-more'} 
            size={24} 
            color={colors.textPrimary} 
          />
          <Text style={styles.filterTitle}>Filtrar por Região</Text>
        </TouchableOpacity>
        
        {selectedRegion ? (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <MaterialIcons name="clear" size={20} color={colors.danger} />
          </TouchableOpacity>
        ) : null}
      </View>

      {isExpanded && (
        <View style={styles.filterContent}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <MaterialIcons name="search" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Digite o nome da região..."
                placeholderTextColor={colors.textSecondary}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {searchText ? (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <MaterialIcons name="close" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              ) : null}
            </View>
            
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Buscar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.predefinedContainer}>
            <Text style={styles.predefinedTitle}>Regiões Disponíveis:</Text>
            <View style={styles.predefinedButtons}>
              {predefinedRegions.map((regiao) => (
                <TouchableOpacity
                  key={regiao}
                  style={[
                    styles.regionButton,
                    selectedRegion === regiao && styles.regionButtonActive
                  ]}
                  onPress={() => handleRegionSelect(regiao)}
                >
                  <Text style={[
                    styles.regionButtonText,
                    selectedRegion === regiao && styles.regionButtonTextActive
                  ]}>
                    {regiao}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  clearButton: {
    padding: 4,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.background,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  searchButton: {
    backgroundColor: colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  predefinedContainer: {
    gap: 8,
  },
  predefinedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  predefinedButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  regionButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  regionButtonActive: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  regionButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  regionButtonTextActive: {
    color: colors.primary,
  },
});
