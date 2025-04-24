import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave para almacenar datos del horario
const SCHEDULE_KEY = 'schedule_data';

// Datos de ejemplo para simulación
const INITIAL_SCHEDULE = {
  'Lunes': {
    '7:00 - 8:00': { subject: 'Matemáticas', teacher: 'Prof. García', room: 'A101' },
    '8:00 - 9:00': { subject: 'Español', teacher: 'Prof. Rodríguez', room: 'A102' },
    '9:00 - 10:00': { subject: 'Ciencias', teacher: 'Prof. López', room: 'B201' },
    '10:00 - 11:00': { subject: 'Recreo', teacher: '', room: 'Patio' },
    '11:00 - 12:00': { subject: 'Historia', teacher: 'Prof. Martínez', room: 'A103' },
    '12:00 - 13:00': { subject: 'Inglés', teacher: 'Prof. Smith', room: 'B202' },
    '13:00 - 14:00': { subject: 'Educación Física', teacher: 'Prof. Hernández', room: 'Gimnasio' },
  },
  'Martes': {
    '7:00 - 8:00': { subject: 'Ciencias', teacher: 'Prof. López', room: 'B201' },
    '8:00 - 9:00': { subject: 'Matemáticas', teacher: 'Prof. García', room: 'A101' },
    '9:00 - 10:00': { subject: 'Inglés', teacher: 'Prof. Smith', room: 'B202' },
    '10:00 - 11:00': { subject: 'Recreo', teacher: '', room: 'Patio' },
    '11:00 - 12:00': { subject: 'Español', teacher: 'Prof. Rodríguez', room: 'A102' },
    '12:00 - 13:00': { subject: 'Arte', teacher: 'Prof. Gómez', room: 'C301' },
    '13:00 - 14:00': { subject: 'Tutoría', teacher: 'Prof. Martínez', room: 'A103' },
  },
  'Miércoles': {
    '7:00 - 8:00': { subject: 'Historia', teacher: 'Prof. Martínez', room: 'A103' },
    '8:00 - 9:00': { subject: 'Ciencias', teacher: 'Prof. López', room: 'B201' },
    '9:00 - 10:00': { subject: 'Matemáticas', teacher: 'Prof. García', room: 'A101' },
    '10:00 - 11:00': { subject: 'Recreo', teacher: '', room: 'Patio' },
    '11:00 - 12:00': { subject: 'Educación Física', teacher: 'Prof. Hernández', room: 'Gimnasio' },
    '12:00 - 13:00': { subject: 'Español', teacher: 'Prof. Rodríguez', room: 'A102' },
    '13:00 - 14:00': { subject: 'Tecnología', teacher: 'Prof. Ramírez', room: 'Lab 1' },
  },
  'Jueves': {
    '7:00 - 8:00': { subject: 'Inglés', teacher: 'Prof. Smith', room: 'B202' },
    '8:00 - 9:00': { subject: 'Historia', teacher: 'Prof. Martínez', room: 'A103' },
    '9:00 - 10:00': { subject: 'Español', teacher: 'Prof. Rodríguez', room: 'A102' },
    '10:00 - 11:00': { subject: 'Recreo', teacher: '', room: 'Patio' },
    '11:00 - 12:00': { subject: 'Matemáticas', teacher: 'Prof. García', room: 'A101' },
    '12:00 - 13:00': { subject: 'Ciencias', teacher: 'Prof. López', room: 'B201' },
    '13:00 - 14:00': { subject: 'Música', teacher: 'Prof. Torres', room: 'Auditorio' },
  },
  'Viernes': {
    '7:00 - 8:00': { subject: 'Educación Física', teacher: 'Prof. Hernández', room: 'Gimnasio' },
    '8:00 - 9:00': { subject: 'Tecnología', teacher: 'Prof. Ramírez', room: 'Lab 1' },
    '9:00 - 10:00': { subject: 'Matemáticas', teacher: 'Prof. García', room: 'A101' },
    '10:00 - 11:00': { subject: 'Recreo', teacher: '', room: 'Patio' },
    '11:00 - 12:00': { subject: 'Ciencias', teacher: 'Prof. López', room: 'B201' },
    '12:00 - 13:00': { subject: 'Español', teacher: 'Prof. Rodríguez', room: 'A102' },
    '13:00 - 14:00': { subject: 'Arte', teacher: 'Prof. Gómez', room: 'C301' },
  },
};

// Inicializar datos de ejemplo
const initializeScheduleData = async () => {
  try {
    const existingData = await AsyncStorage.getItem(SCHEDULE_KEY);
    if (!existingData) {
      await AsyncStorage.setItem(SCHEDULE_KEY, JSON.stringify(INITIAL_SCHEDULE));
    }
  } catch (error) {
    console.error('Error al inicializar datos de horario:', error);
  }
};

// Inicializar al importar el servicio
initializeScheduleData();

export const scheduleService = {
  /**
   * Obtener horario completo
   * @returns {Promise<Object>} - Horario completo
   */
  getFullSchedule: async () => {
    try {
      const scheduleData = await AsyncStorage.getItem(SCHEDULE_KEY);
      return scheduleData ? JSON.parse(scheduleData) : {};
    } catch (error) {
      console.error('Error al obtener horario:', error);
      return {};
    }
  },
  
  /**
   * Obtener horario de un día específico
   * @param {string} day - Día de la semana ('Lunes', 'Martes', etc.)
   * @returns {Promise<Object>} - Horario del día
   */
  getDaySchedule: async (day) => {
    try {
      const scheduleData = await AsyncStorage.getItem(SCHEDULE_KEY);
      const schedule = JSON.parse(scheduleData);
      
      return schedule[day] || {};
    } catch (error) {
      console.error('Error al obtener horario del día:', error);
      return {};
    }
  },
  
  /**
   * Actualizar una clase en el horario
   * @param {string} day - Día de la semana ('Lunes', 'Martes', etc.)
   * @param {string} timeSlot - Franja horaria ('7:00 - 8:00', etc.)
   * @param {Object} classData - Datos de la clase
   * @returns {Promise<boolean>} - true si se actualizó correctamente
   */
  updateClass: async (day, timeSlot, classData) => {
    try {
      const scheduleData = await AsyncStorage.getItem(SCHEDULE_KEY);
      let schedule = JSON.parse(scheduleData);
      
      // Verificar si existe el día
      if (!schedule[day]) {
        schedule[day] = {};
      }
      
      // Actualizar la clase
      schedule[day][timeSlot] = classData;
      
      // Guardar datos actualizados
      await AsyncStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
      
      return true;
    } catch (error) {
      console.error('Error al actualizar clase:', error);
      return false;
    }
  },
  
  /**
   * Obtener clases de un profesor específico
   * @param {string} teacherName - Nombre del profesor
   * @returns {Promise<Array>} - Lista de clases del profesor
   */
  getTeacherClasses: async (teacherName) => {
    try {
      const scheduleData = await AsyncStorage.getItem(SCHEDULE_KEY);
      const schedule = JSON.parse(scheduleData);
      
      const teacherClasses = [];
      
      // Recorrer todos los días
      for (const day in schedule) {
        // Recorrer todas las franjas horarias del día
        for (const timeSlot in schedule[day]) {
          const classData = schedule[day][timeSlot];
          
          // Si la clase es del profesor, agregarla a la lista
          if (classData.teacher === teacherName) {
            teacherClasses.push({
              day,
              timeSlot,
              ...classData
            });
          }
        }
      }
      
      return teacherClasses;
    } catch (error) {
      console.error('Error al obtener clases del profesor:', error);
      return [];
    }
  },
  
  /**
   * Obtener clases actuales (basado en día y hora actual)
   * @returns {Promise<Array>} - Lista de clases actuales
   */
  getCurrentClasses: async () => {
    try {
      const now = new Date();
      
      // Obtener día de la semana en español
      const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const currentDay = daysOfWeek[now.getDay()];
      
      // Si es fin de semana, no hay clases
      if (currentDay === 'Domingo' || currentDay === 'Sábado') {
        return [];
      }
      
      // Obtener hora actual
      const currentHour = now.getHours();
      
      const scheduleData = await AsyncStorage.getItem(SCHEDULE_KEY);
      const schedule = JSON.parse(scheduleData);
      
      // Obtener horario del día actual
      const daySchedule = schedule[currentDay] || {};
      
      // Buscar clases que están en curso
      const currentClasses = [];
      
      for (const timeSlot in daySchedule) {
        // Extraer horas de inicio y fin
        const [startTime, endTime] = timeSlot.split(' - ');
        const startHour = parseInt(startTime.split(':')[0]);
        const endHour = parseInt(endTime.split(':')[0]);
        
        // Si la hora actual está dentro del rango de la clase
        if (currentHour >= startHour && currentHour < endHour) {
          currentClasses.push({
            timeSlot,
            ...daySchedule[timeSlot]
          });
        }
      }
      
      return currentClasses;
    } catch (error) {
      console.error('Error al obtener clases actuales:', error);
      return [];
    }
  }
};

export default scheduleService;