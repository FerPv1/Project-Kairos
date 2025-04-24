import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave para almacenamiento
const NOTIFICATIONS_KEY = 'user_notifications';

export const notificationService = {
  /**
   * Obtener todas las notificaciones del usuario
   * @returns {Promise<Array>} - Lista de notificaciones
   */
  getNotifications: async () => {
    try {
      const notificationsData = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      return notificationsData ? JSON.parse(notificationsData) : [];
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      return [];
    }
  },

  /**
   * Guardar una nueva notificación
   * @param {Object} notification - Datos de la notificación
   * @returns {Promise<boolean>} - true si se guardó correctamente
   */
  saveNotification: async (notification) => {
    try {
      // Validar que la notificación tenga los campos requeridos
      if (!notification.title || !notification.message) {
        throw new Error('La notificación debe tener título y mensaje');
      }

      // Generar ID único si no tiene
      if (!notification.id) {
        notification.id = Date.now().toString();
      }

      // Obtener notificaciones existentes
      const notifications = await notificationService.getNotifications();
      
      // Agregar la nueva notificación
      notifications.push({
        ...notification,
        read: false,
        createdAt: new Date().toISOString()
      });
      
      // Guardar la lista actualizada
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
      
      return true;
    } catch (error) {
      console.error('Error al guardar notificación:', error);
      return false;
    }
  },

  /**
   * Marcar una notificación como leída
   * @param {string} notificationId - ID de la notificación
   * @returns {Promise<boolean>} - true si se actualizó correctamente
   */
  markAsRead: async (notificationId) => {
    try {
      // Obtener notificaciones existentes
      const notifications = await notificationService.getNotifications();
      
      // Encontrar el índice de la notificación
      const notificationIndex = notifications.findIndex(n => n.id === notificationId);
      
      if (notificationIndex === -1) {
        throw new Error('Notificación no encontrada');
      }
      
      // Marcar como leída
      notifications[notificationIndex].read = true;
      notifications[notificationIndex].readAt = new Date().toISOString();
      
      // Guardar la lista actualizada
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
      
      return true;
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      return false;
    }
  },

  /**
   * Eliminar una notificación
   * @param {string} notificationId - ID de la notificación a eliminar
   * @returns {Promise<boolean>} - true si se eliminó correctamente
   */
  deleteNotification: async (notificationId) => {
    try {
      // Obtener notificaciones existentes
      const notifications = await notificationService.getNotifications();
      
      // Filtrar la notificación a eliminar
      const updatedNotifications = notifications.filter(n => n.id !== notificationId);
      
      // Guardar la lista actualizada
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
      
      return true;
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      return false;
    }
  },

  /**
   * Eliminar todas las notificaciones
   * @returns {Promise<boolean>} - true si se eliminaron correctamente
   */
  clearAllNotifications: async () => {
    try {
      await AsyncStorage.removeItem(NOTIFICATIONS_KEY);
      return true;
    } catch (error) {
      console.error('Error al eliminar todas las notificaciones:', error);
      return false;
    }
  },

  /**
   * Inicializar notificaciones de ejemplo
   * @returns {Promise<boolean>} - true si se inicializaron correctamente
   */
  initializeExampleNotifications: async () => {
    try {
      // Verificar si ya existen notificaciones
      const existingNotifications = await notificationService.getNotifications();
      
      // Si ya hay notificaciones, no hacer nada
      if (existingNotifications.length > 0) {
        return true;
      }
      
      // Crear notificaciones de ejemplo
      const exampleNotifications = [
        {
          id: '1',
          title: 'Bienvenido a kAIros',
          message: 'Gracias por usar nuestra aplicación de gestión escolar inteligente.',
          read: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Reunión de padres',
          message: 'Se le recuerda que la reunión de padres está programada para el próximo viernes a las 18:00.',
          read: false,
          createdAt: new Date(Date.now() - 86400000).toISOString() // Ayer
        },
        {
          id: '3',
          title: 'Entrega de calificaciones',
          message: 'Las calificaciones del primer trimestre ya están disponibles en la plataforma.',
          read: false,
          createdAt: new Date(Date.now() - 172800000).toISOString() // Hace 2 días
        },
        {
          id: '4',
          title: 'Actualización del sistema',
          message: 'Hemos actualizado la aplicación con nuevas funcionalidades. ¡Explora las novedades!',
          read: false,
          createdAt: new Date(Date.now() - 259200000).toISOString() // Hace 3 días
        }
      ];
      
      // Guardar notificaciones de ejemplo
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(exampleNotifications));
      
      return true;
    } catch (error) {
      console.error('Error al inicializar notificaciones de ejemplo:', error);
      return false;
    }
  }
};

export default notificationService;