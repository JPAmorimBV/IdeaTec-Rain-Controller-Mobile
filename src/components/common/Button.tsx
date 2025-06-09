import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../styles/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [styles.button];
    
    // Adicionar estilo de tamanho
    if (size === 'small') {
      baseStyle.push(styles.small);
    } else if (size === 'medium') {
      baseStyle.push(styles.medium);
    } else if (size === 'large') {
      baseStyle.push(styles.large);
    }
    
    // Adicionar estilo de variante ou disabled
    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    } else {
      if (variant === 'primary') {
        baseStyle.push(styles.primary);
      } else if (variant === 'secondary') {
        baseStyle.push(styles.secondary);
      } else if (variant === 'danger') {
        baseStyle.push(styles.danger);
      }
    }
    
    // Adicionar estilo customizado se fornecido
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyle: TextStyle[] = [styles.text];
    
    // Adicionar estilo de tamanho do texto
    if (size === 'small') {
      baseStyle.push(styles.smallText);
    } else if (size === 'medium') {
      baseStyle.push(styles.mediumText);
    } else if (size === 'large') {
      baseStyle.push(styles.largeText);
    }
    
    // Adicionar cor do texto baseada no estado/variante
    if (disabled || loading) {
      baseStyle.push(styles.disabledText);
    } else {
      if (variant === 'primary') {
        baseStyle.push(styles.primaryText);
      } else if (variant === 'secondary') {
        baseStyle.push(styles.secondaryText);
      } else if (variant === 'danger') {
        baseStyle.push(styles.dangerText);
      }
    }
    
    // Adicionar estilo de texto customizado se fornecido
    if (textStyle) {
      baseStyle.push(textStyle);
    }
    
    return baseStyle;
  };

  const getActivityIndicatorColor = (): string => {
    if (variant === 'primary') {
      return colors.primary;
    } else if (variant === 'secondary') {
      return colors.textPrimary;
    } else if (variant === 'danger') {
      return colors.primary;
    }
    return colors.textPrimary;
  };

  const getActivityIndicatorSize = (): 'small' | 'large' => {
    return 'small';
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size={getActivityIndicatorSize()} 
          color={getActivityIndicatorColor()} 
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  } as ViewStyle,
  
  // Sizes
  small: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  } as ViewStyle,
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  } as ViewStyle,
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 52,
  } as ViewStyle,
  
  // Variants
  primary: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  } as ViewStyle,
  secondary: {
    backgroundColor: colors.background,
    borderColor: colors.textPrimary,
  } as ViewStyle,
  danger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  } as ViewStyle,
  disabled: {
    backgroundColor: colors.buttonDisabled || '#CCCCCC',
    borderColor: colors.buttonDisabled || '#CCCCCC',
  } as ViewStyle,
  
  // Text base
  text: {
    fontWeight: '600',
  } as TextStyle,
  
  // Text sizes
  smallText: {
    fontSize: 12,
  } as TextStyle,
  mediumText: {
    fontSize: 14,
  } as TextStyle,
  largeText: {
    fontSize: 16,
  } as TextStyle,
  
  // Text variants
  primaryText: {
    color: colors.primary,
  } as TextStyle,
  secondaryText: {
    color: colors.textPrimary,
  } as TextStyle,
  dangerText: {
    color: colors.primary,
  } as TextStyle,
  disabledText: {
    color: colors.textSecondary,
  } as TextStyle,
});
