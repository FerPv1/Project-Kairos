import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { gradesService } from '../services/gradesService';

const StudentGradesScreen = ({ route, navigation }) => {
  const { student } = route.params;
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [currentGrade, setCurrentGrade] = useState('');

  useEffect(() => {
    const loadGrades = async () => {
      try {
        const studentGrades = await gradesService.getStudentGrades(student.id);
        setGrades(studentGrades);
      } catch (error) {
        console.error('Error al cargar calificaciones:', error);
        Alert.alert('Error', 'No se pudieron cargar las calificaciones');
      } finally {
        setLoading(false);
      }
    };

    loadGrades();
  }, [student.id]);

  const handleEditGrade = (subject, period, grade) => {
    setCurrentSubject(subject);
    setCurrentPeriod(period);
    setCurrentGrade(grade.toString());
    setEditModalVisible(true);
  };

  const saveGrade = async () => {
    // Validar que sea un número válido
    const gradeValue = parseFloat(currentGrade);
    if (isNaN(gradeValue)) {
      Alert.alert('Error', 'Por favor ingrese una calificación válida');
      return;
    }

    try {
      // Actualizar en el servicio
      await gradesService.updateGrade(student.id, currentSubject, currentPeriod, gradeValue);
      
      // Actualizar estado local
      setGrades(prevGrades => {
        const updatedGrades = {...prevGrades};
        updatedGrades[currentSubject][currentPeriod] = gradeValue;
        
        // Recalcular promedio
        const periods = Object.keys(updatedGrades[currentSubject]).filter(key => key !== 'Promedio');
        const sum = periods.reduce((total, period) => total + updatedGrades[currentSubject][period], 0);
        updatedGrades[currentSubject]['Promedio'] = Math.round((sum / periods.length) * 10) / 10;
        
        return updatedGrades;
      });
      
      setEditModalVisible(false);
      Alert.alert('Éxito', 'Calificación actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar calificación:', error);
      Alert.alert('Error', 'No se pudo actualizar la calificación');
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 17) return '#2ecc71'; // Verde para excelente
    if (grade >= 14) return '#3498db'; // Azul para bueno
    if (grade >= 11) return '#f39c12'; // Naranja para regular
    return '#e74c3c'; // Rojo para insuficiente
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Cargando calificaciones...</Text>
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
        <Text style={styles.headerTitle}>Calificaciones</Text>
      </View>

      <View style={styles.studentInfoCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{student.firstName.charAt(0)}</Text>
          </View>
        </View>
        <Text style={styles.studentName}>{student.firstName} {student.lastName}</Text>
        <View style={styles.studentDetailsContainer}>
          <View style={styles.studentDetailItem}>
            <MaterialIcons name="school" size={16} color="#3498db" />
            <Text style={styles.studentDetail}>{student.grade}</Text>
          </View>
          <View style={styles.studentDetailItem}>
            <MaterialIcons name="group" size={16} color="#3498db" />
            <Text style={styles.studentDetail}>Sección {student.section}</Text>
          </View>
          <View style={styles.studentDetailItem}>
            <MaterialIcons name="badge" size={16} color="#3498db" />
            <Text style={styles.studentDetail}>Código: {student.studentCode || 'N/A'}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.gradesContainer}>
        {Object.keys(grades).length > 0 ? (
          Object.keys(grades).map(subject => (
            <View key={subject} style={styles.subjectCard}>
              <View style={styles.subjectHeader}>
                <MaterialIcons 
                  name={
                    subject === 'Matemáticas' ? 'calculate' : 
                    subject === 'Comunicación' ? 'menu-book' :
                    subject === 'Ciencias' ? 'science' :
                    subject === 'Historia' ? 'public' : 'school'
                  } 
                  size={24} 
                  color="#3498db" 
                />
                <Text style={styles.subjectName}>{subject}</Text>
              </View>
              
              <View style={styles.gradesTable}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>Periodo</Text>
                  <Text style={styles.tableHeaderText}>Calificación</Text>
                </View>
                
                {Object.keys(grades[subject])
                  .filter(period => period !== 'Promedio')
                  .map(period => (
                    <TouchableOpacity 
                      key={period} 
                      style={styles.gradeRow}
                      onPress={() => handleEditGrade(subject, period, grades[subject][period])}
                    >
                      <Text style={styles.periodName}>{period}</Text>
                      <View style={styles.gradeContainer}>
                        <Text 
                          style={[
                            styles.gradeValue, 
                            { color: getGradeColor(grades[subject][period]) }
                          ]}
                        >
                          {grades[subject][period]}
                        </Text>
                        <MaterialIcons name="edit" size={16} color="#7f8c8d" style={styles.editIcon} />
                      </View>
                    </TouchableOpacity>
                  ))}
                
                <View style={styles.averageRow}>
                  <Text style={styles.averageLabel}>Promedio</Text>
                  <Text 
                    style={[
                      styles.averageValue, 
                      { color: getGradeColor(grades[subject]['Promedio']) }
                    ]}
                  >
                    {grades[subject]['Promedio']}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noGradesContainer}>
            <MaterialIcons name="school" size={60} color="#e0e0e0" />
            <Text style={styles.noGradesText}>No hay calificaciones disponibles</Text>
          </View>
        )}
      </ScrollView>

      {/* Modal para editar calificación */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Calificación</Text>
            <View style={styles.modalSubjectContainer}>
              <MaterialIcons 
                name={
                  currentSubject === 'Matemáticas' ? 'calculate' : 
                  currentSubject === 'Comunicación' ? 'menu-book' :
                  currentSubject === 'Ciencias' ? 'science' :
                  currentSubject === 'Historia' ? 'public' : 'school'
                } 
                size={24} 
                color="#3498db" 
              />
              <Text style={styles.modalSubtitle}>{currentSubject} - {currentPeriod}</Text>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Calificación"
              value={currentGrade}
              onChangeText={setCurrentGrade}
              keyboardType="numeric"
              maxLength={5}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={saveGrade}
              >
                <Text style={styles.confirmButtonText}>Guardar</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  studentInfoCard: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  studentDetailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 5,
  },
  studentDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 3,
  },
  studentDetail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  gradesContainer: {
    flex: 1,
    padding: 15,
    paddingTop: 0,
  },
  subjectCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
  },
  gradesTable: {
    padding: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7f8c8d',
  },
  gradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  periodName: {
    fontSize: 15,
    color: '#2c3e50',
  },
  gradeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  editIcon: {
    opacity: 0.6,
  },
  averageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  averageLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  averageValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noGradesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 20,
  },
  noGradesText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalSubjectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#3498db',
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 12,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default StudentGradesScreen;