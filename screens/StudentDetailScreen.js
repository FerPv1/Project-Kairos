import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { studentService } from '../services/studentService';

const StudentDetailScreen = ({ route, navigation }) => {
  const { studentId } = route.params;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const studentData = await studentService.getStudentById(studentId);
        if (studentData) {
          setStudent(studentData);
        } else {
          Alert.alert('Error', 'No se pudo encontrar la información del estudiante');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error al cargar datos del estudiante:', error);
        Alert.alert('Error', 'No se pudo cargar la información del estudiante');
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, [studentId]);

  const handleViewGrades = () => {
    navigation.navigate('StudentGrades', { student });
  };

  const handleEditStudent = () => {
    // Aquí iría la lógica para editar el estudiante
    Alert.alert('Función en desarrollo', 'La edición de estudiantes estará disponible próximamente');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando información del estudiante...</Text>
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.errorContainer}>
        <Text>No se pudo cargar la información del estudiante</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Estudiante</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{student.firstName.charAt(0)}</Text>
            </View>
          </View>
          
          <Text style={styles.studentName}>{student.firstName} {student.lastName}</Text>
          <Text style={styles.studentCode}>Código: {student.studentCode}</Text>
          <View style={styles.levelGradeContainer}>
            <Text style={styles.studentLevel}>
              {student.level === 'inicial' ? 'Nivel Inicial' : 'Nivel Primaria'}
            </Text>
            <Text style={styles.studentGrade}>
              {student.grade} - Sección {student.section}
            </Text>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleViewGrades}
          >
            <MaterialIcons name="school" size={24} color="#3498db" style={styles.actionIcon} />
            <Text style={styles.actionText}>Ver Calificaciones</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Attendance')}
          >
            <MaterialIcons name="event-available" size={24} color="#3498db" style={styles.actionIcon} />
            <Text style={styles.actionText}>Ver Asistencia</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleEditStudent}
          >
            <MaterialIcons name="edit" size={24} color="#3498db" style={styles.actionIcon} />
            <Text style={styles.actionText}>Editar Información</Text>
          </TouchableOpacity>
        </View>

        {student.recommendation && (
          <View style={styles.recommendationSection}>
            <Text style={styles.sectionTitle}>Recomendación</Text>
            <Text style={styles.recommendationText}>{student.recommendation}</Text>
          </View>
        )}
      </ScrollView>
    </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: '#3498db',
    padding: 15,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 20,
    borderRadius: 10,
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
  studentName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  studentCode: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  studentGrade: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
    alignItems: 'center',
  },
  studentLevel: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: 'bold',
  },
  actionsSection: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
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
  recommendationSection: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
  },
});

export default StudentDetailScreen;