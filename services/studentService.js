import AsyncStorage from '@react-native-async-storage/async-storage';

// Claves para almacenamiento
const STUDENTS_KEY = 'students_data';
const ATTENDANCE_KEY = 'attendance_records';

// Datos de ejemplo para estudiantes
const DEMO_STUDENTS = [
  {
    id: '1',
    firstName: 'Ana',
    lastName: 'García',
    studentCode: 'B001',
    level: 'primaria',
    section: '3',
    grade: '3° Grado',
    parentId: '101',
    photoUrl: null
  },
  {
    id: '2',
    firstName: 'Carlos',
    lastName: 'López',
    studentCode: 'B002',
    level: 'primaria',
    section: '3',
    grade: '3° Grado',
    parentId: '102',
    photoUrl: null
  },
  {
    id: '3',
    firstName: 'María',
    lastName: 'Rodríguez',
    studentCode: 'A001',
    level: 'inicial',
    section: 'II',
    grade: 'Sección II',
    parentId: '103',
    photoUrl: null
  },
  {
    id: '4',
    firstName: 'Juan',
    lastName: 'Pérez',
    studentCode: 'B003',
    level: 'primaria',
    section: '1',
    grade: '1° Grado',
    parentId: '104',
    photoUrl: null
  },
  {
    id: '5',
    firstName: 'Laura',
    lastName: 'Martínez',
    studentCode: 'A002',
    level: 'inicial',
    section: 'I',
    grade: 'Sección I',
    parentId: '105',
    photoUrl: null
  }
];

export const studentService = {
  /**
   * Inicializa los datos de demostración
   */
  initDemoData: async () => {
    try {
      // Verificar si ya existen datos
      const studentsData = await AsyncStorage.getItem(STUDENTS_KEY);
      
      if (!studentsData) {
        // Guardar datos de demostración
        await AsyncStorage.setItem(STUDENTS_KEY, JSON.stringify(DEMO_STUDENTS));
        console.log('Datos de demostración inicializados');
      }
    } catch (error) {
      console.error('Error al inicializar datos de demostración:', error);
    }
  },
  
  /**
   * Obtiene la lista de estudiantes
   * @returns {Promise<Array>} - Lista de estudiantes
   */
  getStudents: async () => {
    try {
      // Inicializar datos de demostración si es necesario
      await studentService.initDemoData();
      
      // Obtener datos de estudiantes
      const studentsData = await AsyncStorage.getItem(STUDENTS_KEY);
      return studentsData ? JSON.parse(studentsData) : [];
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
      return [];
    }
  },
  
  /**
   * Obtiene un estudiante por su ID
   * @param {string} id - ID del estudiante
   * @returns {Promise<Object>} - Datos del estudiante
   */
  getStudentById: async (id) => {
    try {
      const students = await studentService.getStudents();
      return students.find(student => student.id === id) || null;
    } catch (error) {
      console.error('Error al obtener estudiante por ID:', error);
      return null;
    }
  },
  
  /**
   * Obtiene un estudiante por su código
   * @param {string} code - Código del estudiante
   * @returns {Promise<Object|null>} - Datos del estudiante o null si no existe
   */
  getStudentByCode: async (code) => {
    try {
      const students = await studentService.getStudents();
      return students.find(student => student.studentCode === code) || null;
    } catch (error) {
      console.error('Error al obtener estudiante por código:', error);
      return null;
    }
  },
  
  /**
   * Genera un código de estudiante basado en su nivel, grado y sección
   * @param {string} level - Nivel (inicial o primaria)
   * @param {string} grade - Grado o edad
   * @param {string} section - Sección (I, II, III para inicial; I, II, III para primaria)
   * @returns {string} - Código de estudiante generado
   */
  generateStudentCode: async (level, grade, section) => {
    try {
      const students = await studentService.getStudents();
      
      // Prefijo según nivel
      let prefix = level === 'inicial' ? 'A' : 'B';
      
      // Número de grado
      let gradeNumber = '';
      if (level === 'inicial') {
        // Para inicial, extraer la edad (3, 4 o 5 años)
        gradeNumber = grade.split(' ')[0];
      } else {
        // Para primaria, extraer el número de grado (1ro, 2do, etc.)
        const gradeMatch = grade.match(/(\d+)/);
        gradeNumber = gradeMatch ? gradeMatch[1] : '';
      }
      
      // Construir la base del código
      const codeBase = `${prefix}${gradeNumber}${section}`;
      
      // Filtrar estudiantes con el mismo código base
      const sameCodeStudents = students.filter(s => 
        s.studentCode && s.studentCode.startsWith(codeBase)
      );
      
      // Generar número secuencial
      const nextNumber = sameCodeStudents.length + 1;
      const paddedNumber = nextNumber.toString().padStart(3, '0');
      
      return `${codeBase}${paddedNumber}`;
    } catch (error) {
      console.error('Error al generar código de estudiante:', error);
      return `${level === 'inicial' ? 'A' : 'B'}000`;
    }
  },
  
  /**
   * Agrega un nuevo estudiante
   * @param {Object} studentData - Datos del nuevo estudiante
   * @returns {Promise<Object>} - Datos del estudiante agregado
   */
  addStudent: async (studentData) => {
    try {
      const students = await studentService.getStudents();
      
      // Generar código de estudiante si no se proporciona
      if (!studentData.studentCode) {
        studentData.studentCode = await studentService.generateStudentCode(
          studentData.level,
          studentData.grade,
          studentData.section
        );
      }
      
      // Crear nuevo estudiante con ID único
      const newStudent = {
        id: Date.now().toString(),
        ...studentData
      };
      
      // Agregar a la lista
      students.push(newStudent);
      
      // Guardar en AsyncStorage
      await AsyncStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
      
      return newStudent;
    } catch (error) {
      console.error('Error al agregar estudiante:', error);
      throw error;
    }
  },
  
  /**
   * Actualiza los datos de un estudiante
   * @param {string} id - ID del estudiante
   * @param {Object} studentData - Nuevos datos del estudiante
   * @returns {Promise<Object>} - Datos actualizados del estudiante
   */
  updateStudent: async (id, studentData) => {
    try {
      const students = await studentService.getStudents();
      
      // Buscar índice del estudiante
      const index = students.findIndex(student => student.id === id);
      
      if (index === -1) {
        throw new Error('Estudiante no encontrado');
      }
      
      // Actualizar datos
      students[index] = {
        ...students[index],
        ...studentData
      };
      
      // Guardar en AsyncStorage
      await AsyncStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
      
      return students[index];
    } catch (error) {
      console.error('Error al actualizar estudiante:', error);
      throw error;
    }
  },
  
  /**
   * Elimina un estudiante
   * @param {string} id - ID del estudiante
   * @returns {Promise<boolean>} - true si se eliminó correctamente
   */
  deleteStudent: async (id) => {
    try {
      const students = await studentService.getStudents();
      
      // Filtrar estudiante
      const updatedStudents = students.filter(student => student.id !== id);
      
      // Guardar en AsyncStorage
      await AsyncStorage.setItem(STUDENTS_KEY, JSON.stringify(updatedStudents));
      
      return true;
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      return false;
    }
  },
  
  /**
   * Registra la asistencia de un estudiante
   * @param {string} studentId - ID del estudiante
   * @param {string|null} arrivalTime - Hora de llegada (null si está ausente)
   * @param {string} status - Estado de asistencia ('presente' o 'ausente')
   * @param {string} date - Fecha de la ausencia (solo para ausentes)
   * @returns {Promise<Object>} - Registro de asistencia
   */
  registerAttendance: async (studentId, arrivalTime, status = 'presente', date = null) => {
    try {
      // Obtener registros existentes
      const records = await studentService.getAttendanceRecords();
      
      // Fecha actual en formato ISO (YYYY-MM-DD)
      const today = new Date().toISOString().split('T')[0];
      
      // Buscar si ya existe un registro para este estudiante en esta fecha
      const existingIndex = records.findIndex(
        r => r.studentId === studentId && r.date === today
      );
      
      // Crear nuevo registro
      const attendanceRecord = {
        id: Date.now().toString(),
        studentId,
        date: today,
        arrivalTime,
        status: status || 'presente',
        absenceDate: status === 'ausente' ? (date || today) : null
      };
      
      // Actualizar o agregar registro
      if (existingIndex !== -1) {
        records[existingIndex] = attendanceRecord;
      } else {
        records.push(attendanceRecord);
      }
      
      // Guardar registros actualizados
      await AsyncStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
      
      return attendanceRecord;
    } catch (error) {
      console.error('Error al registrar asistencia:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene los registros de asistencia para una fecha específica
   * @param {string} date - Fecha en formato YYYY-MM-DD
   * @returns {Promise<Array>} - Lista de registros de asistencia
   */
  getAttendanceRecords: async (date) => {
    try {
      const recordsJson = await AsyncStorage.getItem(ATTENDANCE_KEY);
      const records = recordsJson ? JSON.parse(recordsJson) : [];
      
      // Si no se proporciona fecha, devolver todos los registros
      if (!date) return records;
      
      // Filtrar por fecha
      return records.filter(record => {
        // Asegurarse de que estamos comparando el mismo formato de fecha
        // Convertir ambas fechas al formato YYYY-MM-DD para comparar
        const recordDate = record.date.includes('T') 
          ? record.date.split('T')[0] 
          : record.date;
        
        const compareDate = date.includes('T') 
          ? date.split('T')[0] 
          : date;
        
        return recordDate === compareDate;
      });
    } catch (error) {
      console.error('Error al obtener registros de asistencia:', error);
      return [];
    }
  },
  
  /**
   * Obtiene los registros de asistencia para un estudiante específico
   * @param {string} studentId - ID del estudiante
   * @returns {Promise<Array>} - Lista de registros de asistencia
   */
  getStudentAttendanceHistory: async (studentId) => {
    try {
      const recordsJson = await AsyncStorage.getItem(ATTENDANCE_KEY);
      const records = recordsJson ? JSON.parse(recordsJson) : [];
      
      // Filtrar por estudiante
      return records.filter(record => record.studentId === studentId);
    } catch (error) {
      console.error('Error al obtener historial de asistencia:', error);
      return [];
    }
  },
  
  /**
   * Obtiene estadísticas de asistencia para un período
   * @param {string} startDate - Fecha de inicio en formato YYYY-MM-DD
   * @param {string} endDate - Fecha de fin en formato YYYY-MM-DD
   * @returns {Promise<Object>} - Estadísticas de asistencia
   */
  getAttendanceStats: async (startDate, endDate) => {
    try {
      const recordsJson = await AsyncStorage.getItem(ATTENDANCE_KEY);
      const records = recordsJson ? JSON.parse(recordsJson) : [];
      
      // Filtrar por rango de fechas
      const filteredRecords = records.filter(record => {
        return record.date >= startDate && record.date <= endDate;
      });
      
      // Calcular estadísticas
      const totalRecords = filteredRecords.length;
      const presentCount = filteredRecords.filter(r => r.status === 'presente').length;
      const absentCount = filteredRecords.filter(r => r.status === 'ausente').length;
      
      return {
        total: totalRecords,
        present: presentCount,
        absent: absentCount,
        presentPercentage: totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0,
        absentPercentage: totalRecords > 0 ? (absentCount / totalRecords) * 100 : 0
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de asistencia:', error);
      return {
        total: 0,
        present: 0,
        absent: 0,
        presentPercentage: 0,
        absentPercentage: 0
      };
    }
  },
  
  /**
   * Guarda una calificación para un estudiante
   * @param {string} studentId - ID del estudiante
   * @param {Object} grade - Objeto con la calificación
   * @returns {Promise<boolean>} - true si se guardó correctamente
   */
  saveGrade: async (studentId, grade) => {
    try {
      // Obtener calificaciones existentes
      const gradesKey = `grades_${studentId}`;
      const existingGradesJson = await AsyncStorage.getItem(gradesKey);
      const existingGrades = existingGradesJson ? JSON.parse(existingGradesJson) : [];
      
      // Agregar nueva calificación
      const updatedGrades = [...existingGrades, grade];
      
      // Guardar calificaciones actualizadas
      await AsyncStorage.setItem(gradesKey, JSON.stringify(updatedGrades));
      
      return true;
    } catch (error) {
      console.error('Error al guardar calificación:', error);
      return false;
    }
  },
  
  /**
   * Obtiene las calificaciones de un estudiante
   * @param {string} studentId - ID del estudiante
   * @returns {Promise<Array>} - Array de calificaciones
   */
  getGrades: async (studentId) => {
    try {
      const gradesKey = `grades_${studentId}`;
      const gradesJson = await AsyncStorage.getItem(gradesKey);
      return gradesJson ? JSON.parse(gradesJson) : [];
    } catch (error) {
      console.error('Error al obtener calificaciones:', error);
      return [];
    }
  }
};

export default studentService;
  
 