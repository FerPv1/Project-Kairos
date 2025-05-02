import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave para almacenar datos de asistencia
const ATTENDANCE_KEY = 'attendance_data';

// Datos de ejemplo para estudiantes
const studentsData = [
  { id: 1, firstName: 'Juan', lastName: 'Pérez', grade: '3° Grado', section: 'A' },
  { id: 2, firstName: 'María', lastName: 'González', grade: '3° Grado', section: 'A' },
  { id: 3, firstName: 'Carlos', lastName: 'Rodríguez', grade: '3° Grado', section: 'B' },
  { id: 4, firstName: 'Ana', lastName: 'López', grade: '4° Grado', section: 'A' },
  { id: 5, firstName: 'Luis', lastName: 'Martínez', grade: '4° Grado', section: 'B' },
];

// Inicializar datos de asistencia
const initializeAttendanceData = async () => {
  try {
    const existingData = await AsyncStorage.getItem(ATTENDANCE_KEY);
    if (!existingData) {
      // Crear estructura inicial vacía
      const initialData = {};
      await AsyncStorage.setItem(ATTENDANCE_KEY, JSON.stringify(initialData));
    }
  } catch (error) {
    console.error('Error al inicializar datos de asistencia:', error);
  }
};

// Inicializar al importar el servicio
initializeAttendanceData();

export const attendanceService = {
  // Obtener lista de estudiantes
  getStudents: async () => {
    // En una implementación real, esto vendría de una API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(studentsData);
      }, 1000);
    });
  },
  
  // Obtener asistencia por fecha
  getAttendanceByDate: async (date) => {
    try {
      const attendanceData = await AsyncStorage.getItem(ATTENDANCE_KEY);
      const parsedData = JSON.parse(attendanceData) || {};
      
      return parsedData[date] || {};
    } catch (error) {
      console.error('Error al obtener asistencia:', error);
      throw error;
    }
  },
  
  // Actualizar asistencia de un estudiante
  updateAttendance: async (studentId, date, isPresent) => {
    try {
      const attendanceData = await AsyncStorage.getItem(ATTENDANCE_KEY);
      const parsedData = JSON.parse(attendanceData) || {};
      
      // Asegurarse de que existe la estructura para la fecha
      if (!parsedData[date]) {
        parsedData[date] = {};
      }
      
      // Actualizar el estado de asistencia
      parsedData[date][studentId] = isPresent;
      
      // Guardar los datos actualizados
      await AsyncStorage.setItem(ATTENDANCE_KEY, JSON.stringify(parsedData));
      
      return true;
    } catch (error) {
      console.error('Error al actualizar asistencia:', error);
      throw error;
    }
  },
  
  // Registrar asistencia mediante reconocimiento facial
  registerAttendanceByFace: async (studentId, date) => {
    try {
      return await attendanceService.updateAttendance(studentId, date, true);
    } catch (error) {
      console.error('Error al registrar asistencia por reconocimiento facial:', error);
      throw error;
    }
  }
};

export default attendanceService;