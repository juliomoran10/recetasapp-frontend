export const COLORS = {
  primary: '#3B71F3',
  accent: '#FF7A00',
  background: '#F9FBFC',
  text: '#051C60',
  muted: '#999',
  card: '#FFFFFF'
};

export const SPACING = {
  page: 20,
  small: 8,
  medium: 15,
  large: 24,
};

export const commonStyles = {
  pageContainer: { flex: 1, backgroundColor: COLORS.background },
  centerContent: { alignItems: 'center', padding: SPACING.page }
};

export const TYPOGRAPHY = {
  h1: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  h2: { fontSize: 20, fontWeight: '600', color: COLORS.text },
  body: { fontSize: 15, color: '#444' },
  small: { fontSize: 12, color: 'gray' }
};

export default { COLORS, SPACING, commonStyles };
