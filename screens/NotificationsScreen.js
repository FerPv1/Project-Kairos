import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  Modal,
  TextInput,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { notificationService } from '../services/notificationService';
import NotificationItem from '../components/NotificationItem';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'message'
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
  const handleMarkAsRead = async (notification) => {
    if (!notification.read) {
      const success = await notificationService.markAsRead(notification.id);
      if (success) {
        loadNotifications();
      }
    }
    
    // Mostrar detalles de la notificación
    Alert.alert(
      notification.title,
      notification.message,
      [{ text: 'Cerrar', style: 'default' }]
    );
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
        message: '',
        type: 'message'
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

  // Renderizar encabezado con contador de no leídas
  const renderHeader = () => {
    const unreadCount = notifications.filter(n => !n.read).length;
    
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        {unreadCount > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
        {notifications.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={handleClearAll}
          >
            <Text style={styles.clearAllText}>Borrar todo</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#3498db" barStyle="light-content" />
      
      {renderHeader()}
      
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={({ item }) => (
            <NotificationItem 
              notification={{
                ...item,
                time: formatDate(item.createdAt)
              }}
              onPress={handleMarkAsRead}
              onDelete={handleDeleteNotification}
            />
          )}
          keyExtractor={item => item.id}
          refreshing={refreshing}
          onRefresh={loadNotifications}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="notifications-off" size={60} color="#e0e0e0" />
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
            
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newNotification.type === 'message' && styles.selectedTypeButton
                ]}
                onPress={() => setNewNotification({...newNotification, type: 'message'})}
              >
                <MaterialIcons 
                  name="message" 
                  size={24} 
                  color={newNotification.type === 'message' ? 'white' : '#9b59b6'} 
                />
                <Text style={[
                  styles.typeText,
                  newNotification.type === 'message' && styles.selectedTypeText
                ]}>Mensaje</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newNotification.type === 'event' && styles.selectedTypeButton,
                  newNotification.type === 'event' && {backgroundColor: '#3498db20'}
                ]}
                onPress={() => setNewNotification({...newNotification, type: 'event'})}
              >
                <MaterialIcons 
                  name="event" 
                  size={24} 
                  color={newNotification.type === 'event' ? 'white' : '#3498db'} 
                />
                <Text style={[
                  styles.typeText,
                  newNotification.type === 'event' && styles.selectedTypeText
                ]}>Evento</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newNotification.type === 'grade' && styles.selectedTypeButton,
                  newNotification.type === 'grade' && {backgroundColor: '#f39c1220'}
                ]}
                onPress={() => setNewNotification({...newNotification, type: 'grade'})}
              >
                <MaterialIcons 
                  name="school" 
                  size={24} 
                  color={newNotification.type === 'grade' ? 'white' : '#f39c12'} 
                />
                <Text style={[
                  styles.typeText,
                  newNotification.type === 'grade' && styles.selectedTypeText
                ]}>Calificación</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={newNotification.title}
              onChangeText={(text) => setNewNotification({...newNotification, title: text})}
            />
            
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Mensaje"
              value={newNotification.message}
              onChangeText={(text) => setNewNotification({...newNotification, message: text})}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleCreateNotification}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 15,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  badgeContainer: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 8,
  },
  clearAllText: {
    color: 'white',
    fontSize: 14,
  },
  listContainer: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#95a5a6',
    marginTop: 10,
  },
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: '#f5f5f5',
  },
  selectedTypeButton: {
    backgroundColor: '#9b59b6',
  },
  typeText: {
    marginTop: 5,
    fontSize: 12,
    color: '#7f8c8d',
  },
  selectedTypeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  messageInput: {
    height: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ecf0f1',
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontWeight: 'bold',
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