import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { notificationService } from '../services/notificationService';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: ''
  });

  // Cargar notificaciones al iniciar
  useEffect(() => {
    loadNotifications();
    // Inicializar notificaciones de ejemplo si no hay
    notificationService.initializeExampleNotifications();
  }, []);

  // Cargar notificaciones desde el servicio
  const loadNotifications = async () => {
    setRefreshing(true);
    const notificationsData = await notificationService.getNotifications();
    // Ordenar por fecha de creación (más recientes primero)
    notificationsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setNotifications(notificationsData);
    setRefreshing(false);
  };

  // Marcar notificación como leída
  const handleMarkAsRead = async (notificationId) => {
    const success = await notificationService.markAsRead(notificationId);
    if (success) {
      loadNotifications();
    }
  };

  // Eliminar notificación
  const handleDeleteNotification = async (notificationId) => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que deseas eliminar esta notificación?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            const success = await notificationService.deleteNotification(notificationId);
            if (success) {
              loadNotifications();
            } else {
              Alert.alert('Error', 'No se pudo eliminar la notificación');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Eliminar todas las notificaciones
  const handleClearAll = () => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que deseas eliminar todas las notificaciones?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar todas',
          onPress: async () => {
            const success = await notificationService.clearAllNotifications();
            if (success) {
              loadNotifications();
              Alert.alert('Éxito', 'Todas las notificaciones han sido eliminadas');
            } else {
              Alert.alert('Error', 'No se pudieron eliminar las notificaciones');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Crear nueva notificación
  const handleCreateNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      Alert.alert('Error', 'Por favor ingresa título y mensaje');
      return;
    }

    const success = await notificationService.saveNotification(newNotification);
    
    if (success) {
      setModalVisible(false);
      setNewNotification({
        title: '',
        message: ''
      });
      loadNotifications();
      Alert.alert('Éxito', 'Notificación creada correctamente');
    } else {
      Alert.alert('Error', 'No se pudo crear la notificación');
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Renderizar item de notificación
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => handleMarkAsRead(item.id)}
    >
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationDate}>{formatDate(item.createdAt)}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteNotification(item.id)}
      >
        <MaterialIcons name="delete" size={24} color="#e74c3c" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        {notifications.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={handleClearAll}
          >
            <Text style={styles.clearAllText}>Borrar todo</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          refreshing={refreshing}
          onRefresh={loadNotifications}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes notificaciones</Text>
        </View>
      )}

      {/* Botón flotante para agregar notificación */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Modal para crear notificación */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Notificación</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={newNotification.title}
              onChangeText={(text) => setNewNotification({...newNotification, title: text})}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Mensaje"
              value={newNotification.message}
              onChangeText={(text) => setNewNotification({...newNotification, message: text})}
              multiline
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNewNotification({
                    title: '',
                    message: ''
                  });
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleCreateNotification}
              >
                <Text style={styles.saveButtonText}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  clearAllText: {
    color: '#e74c3c',
    fontSize: 14,
  },
  notificationItem: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
  },
  unreadNotification: {
    backgroundColor: '#ecf0f1',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  // Estilo para el botón flotante
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ecf0f1',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#7f8c8d',
  },
  saveButton: {
    backgroundColor: '#3498db',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NotificationsScreen;