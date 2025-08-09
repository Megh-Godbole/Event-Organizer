import { StyleSheet } from 'react-native';

const colors = {
  primary: '#007AFF',
  secondary: '#34C759',
  danger: '#FF3B30',
  textDark: '#333',
  textLight: '#666',
  border: '#ddd',
  background: '#fff',
  icon: '#555',
  onPrimary: '#fff',
};

export default StyleSheet.create({
  colors,

  header: {
    backgroundColor: colors.primary,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: 'gray',
  tabBarStyle: {
    backgroundColor: colors.background,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  authContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: colors.primary,
  },
  authInput: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },

  profileContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
    justifyContent: 'flex-start',
  },
  profileTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    color: colors.textDark,
  },
  profileInfo: {
    fontSize: 18,
    marginTop: 4,
    color: colors.textDark,
  },
  profileButtonContainer: {
    marginTop: 40,
    width: '50%',
    alignSelf: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: colors.background,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    elevation: 4,
  },
  container: {
    flex: 1,
    padding: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12
  },
  label: {
    fontWeight: '600',
    marginBottom: 6
  },
  dateBtn: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 12
  },
  favoriteIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffe6e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});