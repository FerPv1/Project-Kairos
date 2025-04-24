import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  ScrollView,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { authService } from '../services/authService';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Cargar datos del usuario
    const loadUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        
        // Si no hay datos de usuario, usar datos de ejemplo
        if (!userData) {
          setUser({
            name: 'Usuario Demo',
            username: 'usuario',
            role: 'teacher'
          });
        } else {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error al cargar datos de usuario:', error);
        // Usar datos de ejemplo en caso de error
        setUser({
          name: 'Usuario Demo',
          username: 'usuario',
          role: 'teacher'
        });
      }
    };
    
    loadUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          onPress: async () => {
            await authService.logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>
      
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
        </View>
        
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userRole}>{user.role === 'teacher' ? 'Profesor' : 'Padre/Tutor'}</Text>
      </View>
      
      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <MaterialIcons name="person" size={24} color="#3498db" style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>Nombre de Usuario</Text>
            <Text style={styles.infoValue}>{user.username}</Text>
          </View>
        </View>
        
        <View style={styles.infoItem}>
          <MaterialIcons name="assignment-ind" size={24} color="#3498db" style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>Rol</Text>
            <Text style={styles.infoValue}>{user.role === 'teacher' ? 'Profesor' : 'Padre/Tutor'}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="edit" size={24} color="#3498db" style={styles.actionIcon} />
          <Text style={styles.actionText}>Editar Perfil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="lock" size={24} color="#3498db" style={styles.actionIcon} />
          <Text style={styles.actionText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <MaterialIcons name="exit-to-app" size={24} color="#e74c3c" style={styles.actionIcon} />
          <Text style={[styles.actionText, { color: '#e74c3c' }]}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 15,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  userRole: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  infoSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  actionsSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionIcon: {
    marginRight: 15,
  },
  actionText: {
    fontSize: 16,
    color: '#2c3e50',
  },
});

export default ProfileScreen;