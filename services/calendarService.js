import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave para almacenamiento
const CALENDAR_EVENTS_KEY = 'calendar_events';

export const calendarService = {
  /**
   * Obtener todos los eventos del calendario
   * @returns {Promise<Array>} - Lista de eventos
   */
  getEvents: async () => {
    try {
      const eventsData = await AsyncStorage.getItem(CALENDAR_EVENTS_KEY);
      return eventsData ? JSON.parse(eventsData) : [];
    } catch (error) {
      console.error('Error al obtener eventos del calendario:', error);
      return [];
    }
  },

  /**
   * Guardar un nuevo evento en el calendario
   * @param {Object} event - Datos del evento
   * @returns {Promise<boolean>} - true si se guardó correctamente
   */
  saveEvent: async (event) => {
    try {
      // Validar que el evento tenga los campos requeridos
      if (!event.title || !event.date) {
        throw new Error('El evento debe tener título y fecha');
      }

      // Generar ID único si no tiene
      if (!event.id) {
        event.id = Date.now().toString();
      }

      // Obtener eventos existentes
      const events = await calendarService.getEvents();
      
      // Agregar el nuevo evento
      events.push({
        ...event,
        createdAt: new Date().toISOString()
      });
      
      // Guardar la lista actualizada
      await AsyncStorage.setItem(CALENDAR_EVENTS_KEY, JSON.stringify(events));
      
      return true;
    } catch (error) {
      console.error('Error al guardar evento del calendario:', error);
      return false;
    }
  },

  /**
   * Actualizar un evento existente
   * @param {Object} updatedEvent - Datos actualizados del evento
   * @returns {Promise<boolean>} - true si se actualizó correctamente
   */
  updateEvent: async (updatedEvent) => {
    try {
      if (!updatedEvent.id) {
        throw new Error('Se requiere ID para actualizar el evento');
      }

      // Obtener eventos existentes
      const events = await calendarService.getEvents();
      
      // Encontrar el índice del evento a actualizar
      const eventIndex = events.findIndex(e => e.id === updatedEvent.id);
      
      if (eventIndex === -1) {
        throw new Error('Evento no encontrado');
      }
      
      // Actualizar el evento
      events[eventIndex] = {
        ...events[eventIndex],
        ...updatedEvent,
        updatedAt: new Date().toISOString()
      };
      
      // Guardar la lista actualizada
      await AsyncStorage.setItem(CALENDAR_EVENTS_KEY, JSON.stringify(events));
      
      return true;
    } catch (error) {
      console.error('Error al actualizar evento del calendario:', error);
      return false;
    }
  },

  /**
   * Eliminar un evento
   * @param {string} eventId - ID del evento a eliminar
   * @returns {Promise<boolean>} - true si se eliminó correctamente
   */
  deleteEvent: async (eventId) => {
    try {
      // Obtener eventos existentes
      const events = await calendarService.getEvents();
      
      // Filtrar el evento a eliminar
      const updatedEvents = events.filter(e => e.id !== eventId);
      
      // Guardar la lista actualizada
      await AsyncStorage.setItem(CALENDAR_EVENTS_KEY, JSON.stringify(updatedEvents));
      
      return true;
    } catch (error) {
      console.error('Error al eliminar evento del calendario:', error);
      return false;
    }
  }
};

export default calendarService;