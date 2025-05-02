import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave para almacenar datos de calificaciones
const GRADES_KEY = 'grades_data';

// Datos de ejemplo para simulación
const INITIAL_GRADES = {
  '1': { // studentId
    'Matemáticas': {
      'Primer Trimestre': 85,
      'Segundo Trimestre': 88,
      'Tercer Trimestre': 90,
      'Promedio': 87.7
    },
    'Español': {
      'Primer Trimestre': 78,
      'Segundo Trimestre': 82,
      'Tercer Trimestre': 85,
      'Promedio': 81.7
    },
    'Ciencias': {
      'Primer Trimestre': 92,
      'Segundo Trimestre': 90,
      'Tercer Trimestre': 94,
      'Promedio': 92.0
    }
  },
  '2': {
    'Matemáticas': {
      'Primer Trimestre': 75,
      'Segundo Trimestre': 78,
      'Tercer Trimestre': 80,
      'Promedio': 77.7
    },
    'Español': {
      'Primer Trimestre': 88,
      'Segundo Trimestre': 90,
      'Tercer Trimestre': 92,
      'Promedio': 90.0
    },
    'Ciencias': {
      'Primer Trimestre': 82,
      'Segundo Trimestre': 85,
      'Tercer Trimestre': 88,
      'Promedio': 85.0
    }
  },
  '3': {
    'Matemáticas': {
      'Primer Trimestre': 90,
      'Segundo Trimestre': 92,
      'Tercer Trimestre': 95,
      'Promedio': 92.3
    },
    'Español': {
      'Primer Trimestre': 85,
      'Segundo Trimestre': 88,
      'Tercer Trimestre': 90,
      'Promedio': 87.7
    },
    'Ciencias': {
      'Primer Trimestre': 78,
      'Segundo Trimestre': 80,
      'Tercer Trimestre': 85,
      'Promedio': 81.0
    }
  }
};

// Inicializar datos de ejemplo
const initializeGradesData = async () => {
  try {
    const existingData = await AsyncStorage.getItem(GRADES_KEY);
    if (!existingData) {
      await AsyncStorage.setItem(GRADES_KEY, JSON.stringify(INITIAL_GRADES));
    }
  } catch (error) {
    console.error('Error al inicializar datos de calificaciones:', error);
  }
};

// Inicializar al importar el servicio
initializeGradesData();

// Datos de ejemplo para el servicio de calificaciones
const studentsData = [
  { id: 1, firstName: 'Juan', lastName: 'Pérez', grade: '3° Grado', section: 'A' },
  { id: 2, firstName: 'María', lastName: 'González', grade: '3° Grado', section: 'A' },
  { id: 3, firstName: 'Carlos', lastName: 'Rodríguez', grade: '3° Grado', section: 'B' },
  { id: 4, firstName: 'Ana', lastName: 'López', grade: '4° Grado', section: 'A' },
  { id: 5, firstName: 'Luis', lastName: 'Martínez', grade: '4° Grado', section: 'B' },
];

// Datos de calificaciones de ejemplo (escala 0-20)
const gradesData = {
  1: { // Juan Pérez
    'Matemáticas': {
      'Primer Trimestre': 16,
      'Segundo Trimestre': 18,
      'Tercer Trimestre': 17,
      'Promedio': 17
    },
    'Comunicación': {
      'Primer Trimestre': 15,
      'Segundo Trimestre': 14,
      'Tercer Trimestre': 16,
      'Promedio': 15
    },
    'Ciencias': {
      'Primer Trimestre': 18,
      'Segundo Trimestre': 19,
      'Tercer Trimestre': 20,
      'Promedio': 19
    },
    'Historia': {
      'Primer Trimestre': 14,
      'Segundo Trimestre': 13,
      'Tercer Trimestre': 15,
      'Promedio': 14
    }
  },
  2: { // María González
    'Matemáticas': {
      'Primer Trimestre': 19,
      'Segundo Trimestre': 20,
      'Tercer Trimestre': 18,
      'Promedio': 19
    },
    'Comunicación': {
      'Primer Trimestre': 17,
      'Segundo Trimestre': 16,
      'Tercer Trimestre': 18,
      'Promedio': 17
    },
    'Ciencias': {
      'Primer Trimestre': 16,
      'Segundo Trimestre': 15,
      'Tercer Trimestre': 17,
      'Promedio': 16
    },
    'Historia': {
      'Primer Trimestre': 18,
      'Segundo Trimestre': 17,
      'Tercer Trimestre': 19,
      'Promedio': 18
    }
  },
  3: { // Carlos Rodríguez
    'Matemáticas': {
      'Primer Trimestre': 10,
      'Segundo Trimestre': 12,
      'Tercer Trimestre': 14,
      'Promedio': 12
    },
    'Comunicación': {
      'Primer Trimestre': 13,
      'Segundo Trimestre': 12,
      'Tercer Trimestre': 11,
      'Promedio': 12
    },
    'Ciencias': {
      'Primer Trimestre': 9,
      'Segundo Trimestre': 10,
      'Tercer Trimestre': 12,
      'Promedio': 10
    },
    'Historia': {
      'Primer Trimestre': 11,
      'Segundo Trimestre': 13,
      'Tercer Trimestre': 12,
      'Promedio': 12
    }
  },
  4: { // Ana López
    'Matemáticas': {
      'Primer Trimestre': 14,
      'Segundo Trimestre': 15,
      'Tercer Trimestre': 16,
      'Promedio': 15
    },
    'Comunicación': {
      'Primer Trimestre': 18,
      'Segundo Trimestre': 17,
      'Tercer Trimestre': 19,
      'Promedio': 18
    },
    'Ciencias': {
      'Primer Trimestre': 16,
      'Segundo Trimestre': 15,
      'Tercer Trimestre': 17,
      'Promedio': 16
    },
    'Historia': {
      'Primer Trimestre': 15,
      'Segundo Trimestre': 16,
      'Tercer Trimestre': 14,
      'Promedio': 15
    }
  },
  5: { // Luis Martínez
    'Matemáticas': {
      'Primer Trimestre': 8,
      'Segundo Trimestre': 10,
      'Tercer Trimestre': 12,
      'Promedio': 10
    },
    'Comunicación': {
      'Primer Trimestre': 11,
      'Segundo Trimestre': 13,
      'Tercer Trimestre': 12,
      'Promedio': 12
    },
    'Ciencias': {
      'Primer Trimestre': 9,
      'Segundo Trimestre': 11,
      'Tercer Trimestre': 10,
      'Promedio': 10
    },
    'Historia': {
      'Primer Trimestre': 12,
      'Segundo Trimestre': 10,
      'Tercer Trimestre': 11,
      'Promedio': 11
    }
  }
};

export const gradesService = {
  // Obtener lista de estudiantes
  getStudentsList: async () => {
    // Simular una llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(studentsData);
      }, 1000);
    });
  },
  
  // Obtener calificaciones de un estudiante específico
  getStudentGrades: async (studentId) => {
    // Simular una llamada a API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const studentGrades = gradesData[studentId];
        if (studentGrades) {
          resolve(studentGrades);
        } else {
          reject(new Error('No se encontraron calificaciones para este estudiante'));
        }
      }, 1000);
    });
  },
  
  // Actualizar una calificación
  /**
   * Actualizar una calificación específica
   * @param {string} studentId - ID del estudiante
   * @param {string} subject - Asignatura
   * @param {string} period - Período (trimestre)
   * @param {number} grade - Nueva calificación
   * @returns {Promise<boolean>} - true si se actualizó correctamente
   */
  updateGrade: async (studentId, subject, period, grade) => {
    // Validar que la calificación esté en el rango de 0 a 20
    if (grade < 0 || grade > 20) {
      throw new Error('La calificación debe estar entre 0 y 20');
    }
    
    // Simular una llamada a API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Verificar si existen los datos
          if (!gradesData[studentId] || !gradesData[studentId][subject]) {
            reject(new Error('No se encontró la asignatura para este estudiante'));
            return;
          }
          
          // Actualizar la calificación
          gradesData[studentId][subject][period] = grade;
          
          // Recalcular el promedio
          const subjectGrades = gradesData[studentId][subject];
          const periods = Object.keys(subjectGrades).filter(key => key !== 'Promedio');
          const sum = periods.reduce((total, p) => total + subjectGrades[p], 0);
          const average = Math.round(sum / periods.length);
          
          // Actualizar el promedio
          gradesData[studentId][subject]['Promedio'] = average;
          
          resolve(true);
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
  }
};

export default gradesService;