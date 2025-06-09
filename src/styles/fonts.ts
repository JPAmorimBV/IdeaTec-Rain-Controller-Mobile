export const fonts = {
  // Família de fontes
  primary: 'System', 
  
  // Tamanhos de fonte
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
  },
  
  // Pesos de fonte
  weights: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  
  // Altura de linha
  lineHeights: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  // Espaçamento de letras
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },
};

// Utilitários de estilo de texto
export const textStyles = {
  // Headers
  h1: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes['5xl'],
    fontWeight: fonts.weights.bold,
    lineHeight: fonts.lineHeights.tight,
  },
  h2: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes['4xl'],
    fontWeight: fonts.weights.bold,
    lineHeight: fonts.lineHeights.tight,
  },
  h3: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes['3xl'],
    fontWeight: fonts.weights.semibold,
    lineHeight: fonts.lineHeights.snug,
  },
  h4: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes['2xl'],
    fontWeight: fonts.weights.semibold,
    lineHeight: fonts.lineHeights.snug,
  },
  
  // Body text
  body: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.normal,
    lineHeight: fonts.lineHeights.normal,
  },
  bodyLarge: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.normal,
    lineHeight: fonts.lineHeights.normal,
  },
  bodySmall: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.normal,
    lineHeight: fonts.lineHeights.normal,
  },
  
  // Labels
  label: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    lineHeight: fonts.lineHeights.snug,
  },
  labelSmall: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
    lineHeight: fonts.lineHeights.snug,
  },
  
  // Captions
  caption: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.normal,
    lineHeight: fonts.lineHeights.normal,
  },
  
  // Buttons
  button: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    lineHeight: fonts.lineHeights.snug,
  },
  buttonSmall: {
    fontFamily: fonts.primary,
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    lineHeight: fonts.lineHeights.snug,
  },
};
