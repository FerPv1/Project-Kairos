import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave para almacenar datos de asistencia
const ATTENDANCE_KEY = 'attendance_data';

// Inicializar datos de asistencia
const initializeAttendanceData = async () => {
  try {
    const existingData = await AsyncStorage.getItem(ATTENDANCE_KEY);
    if (!existingData) {
      // Estructura inicial vacía
      const initialData = {
        records: {}
      };
      await AsyncStorage.setItem(ATTENDANCE_KEY, JSON.stringify(initialData));
    }
  } catch (error) {
    console.error('Error al inicializar datos de asistencia:', error);
  }
};

// Inicializar al importar el servicio
initializeAttendanceData();

export const attendanceService = {
  /**
   * Registrar asistencia de un estudiante
   * @param {string} studentId - ID del estudiante
   * @param {string} date - Fecha en formato YYYY-MM-DD
   * @param {boolean} present - true si está presente, false si está ausente
   * @param {string} classId - ID de la clase (opcional)
   * @returns {Promise<Object>} - Registro de asistencia
   */
  registerAttendance: async (studentId, date, present, classId = null) => {
    try {
      // Si no se proporciona una fecha, usar la fecha actual
      if (!date) {
        const today = new Date();
        date = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      }
      
      const attendanceData = await AsyncStorage.getItem(ATTENDANCE_KEY);
      let data = JSON.parse(attendanceData);
      
      // Crear clave para la fecha si no existe
      if (!data.records[date]) {
        data.records[date] = {};
      }
      
      // Registrar asistencia
      const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      
      const attendanceRecord = {
        studentId,
        present,
        time,
        classId,
        timestamp: Date.now()
      };
      
      data.records[date][studentId] = attendanceRecord;
      
      // Guardar datos actualizados
      await AsyncStorage.setItem(ATTENDANCE_KEY, JSON.stringify(data));
      
      return attendanceRecord;
    } catch (error) {
      console.error('Error al registrar asistencia:', error);
      throw error;
    }
  },
  
  /**
   * Obtener asistencia de un día específico
   * @param {string} date - Fecha en formato YYYY-MM-DD
   * @returns {Promise<Object>} - Registros de asistencia del día
   */
  getAttendanceByDate: async (date) => {
    try {
      // Si no se proporciona una fecha, usar la fecha actual
      if (!date) {
        const today = new Date();
        date = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      }
      
      const attendanceData = await AsyncStorage.getItem(ATTENDANCE_KEY);
      const data = JSON.parse(attendanceData);
      
      return data.records[date] || {};
    } catch (error) {
      console.error('Error al obtener asistencia por fecha:', error);
      return {};
    }
  },
  
  /**
   * Obtener historial de asistencia de un estudiante
   * @param {string} studentId - ID del estudiante
   * @returns {Promise<Array>} - Historial de asistencia
   */
  getStudentAttendanceHistory: async (studentId) => {
    try {
      const attendanceData = await AsyncStorage.getItem(ATTENDANCE_KEY);
      const data = JSON.parse(attendanceData);
      
      const history = [];
      
      // Recorrer todas las fechas
      for (const date in data.records) {
        // Si hay un registro para este estudiante en esta fecha
        if (data.records[date][studentId]) {
          history.push({
            date,
            ...data.records[date][studentId]
          });
        }
      }
      
      // Ordenar por fecha (más reciente primero)
      return history.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Error al obtener historial de asistencia:', error);
      return [];
    }
  },
  
  /**
   * Obtener estadísticas de asistencia
   * @param {string} classId - ID de la clase (opcional)
   * @param {string} startDate - Fecha de inicio en formato YYYY-MM-DD (opcional)
   * @param {string} endDate - Fecha de fin en formato YYYY-MM-DD (opcional)
   * @returns {Promise<Object>} - Estadísticas de asistencia
   */
  getAttendanceStats: async (classId = null, startDate = null, endDate = null) => {
    try {
      const attendanceData = await AsyncStorage.getItem(ATTENDANCE_KEY);
      const data = JSON.parse(attendanceData);
      
      let totalRecords = 0;
      let presentCount = 0;
      
      // Filtrar por fechas si se especifican
      const dates = Object.keys(data.records);
      const filteredDates = dates.filter(date => {
        if (startDate && date < startDate) return false;
        if (endDate && date > endDate) return false;
        return true;
      });
      
      // Calcular estadísticas
      filteredDates.forEach(date => {
        const dayRecords = data.records[date];
        
        for (const studentId in dayRecords) {
          const record = dayRecords[studentId];
          
          // Filtrar por clase si se especifica
          if (classId && record.classId !== classId) continue;
          
          totalRecords++;
          if (record.present) {
            presentCount++;
          }
        }
      });
      
      const attendanceRate = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;
      
      return {
        totalRecords,
        presentCount,
        absentCount: totalRecords - presentCount,
        attendanceRate: attendanceRate.toFixed(2)
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de asistencia:', error);
      return {
        totalRecords: 0,
        presentCount: 0,
        absentCount: 0,
        attendanceRate: 0
      };
    }
  }
};

export default attendanceService;