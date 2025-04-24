import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { studentService } from '../services/studentService';

const StudentGradesScreen = ({ route, navigation }) => {
  const { student } = route.params;
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGrade, setNewGrade] = useState({
    subject: '',
    score: '',
    date: new Date().toISOString().split('T')[0],
    comments: ''
  });

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      setLoading(true);
      const gradesData = await studentService.getGrades(student.id);
      setGrades(gradesData);
    } catch (error) {
      console.error('Error al cargar calificaciones:', error);
      Alert.alert('Error', 'No se pudieron cargar las calificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGrade = async () => {
    if (!newGrade.subject || !newGrade.score) {
      Alert.alert('Error', 'Por favor ingrese la materia y calificación');
      return;
    }

    try {
      const gradeData = {
        ...newGrade,
        id: Date.now().toString(),
        studentId: student.id
      };

      await studentService.saveGrade(student.id, gradeData);
      
      // Limpiar formulario
      setNewGrade({
        subject: '',
        score: '',
        date: new Date().toISOString().split('T')[0],
        comments: ''
      });
      
      // Recargar calificaciones
      loadGrades();
      
      Alert.alert('Éxito', 'Calificación guardada correctamente');
    } catch (error) {
      console.error('Error al guardar calificación:', error);
      Alert.alert('Error', 'No se pudo guardar la calificación');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calificaciones de {student.firstName}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.studentCard}>
          <View style={styles.studentAvatar}>
            <Text style={styles.avatarText}>{student.firstName.charAt(0)}</Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{student.firstName} {student.lastName}</Text>
            <Text style={styles.studentCode}>{student.studentCode}</Text>
            <Text style={styles.studentGrade}>{student.grade}</Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Agregar Calificación</Text>
          
          <Text style={styles.inputLabel}>Materia</Text>
          <TextInput
            style={styles.input}
            value={newGrade.subject}
            onChangeText={(text) => setNewGrade({...newGrade, subject: text})}
            placeholder="Ej: Matemáticas"
          />
          
          <Text style={styles.inputLabel}>Calificación</Text>
          <TextInput
            style={styles.input}
            value={newGrade.score}
            onChangeText={(text) => setNewGrade({...newGrade, score: text})}
            placeholder="Ej: 18/20"
            keyboardType="numeric"
          />
          
          <Text style={styles.inputLabel}>Comentarios</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={newGrade.comments}
            onChangeText={(text) => setNewGrade({...newGrade, comments: text})}
            placeholder="Comentarios adicionales"
            multiline={true}
            numberOfLines={4}
          />
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSaveGrade}
          >
            <Text style={styles.saveButtonText}>Guardar Calificación</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gradesSection}>
          <Text style={styles.sectionTitle}>Historial de Calificaciones</Text>
          
          {loading ? (
            <Text style={styles.loadingText}>Cargando calificaciones...</Text>
          ) : grades.length === 0 ? (
            <Text style={styles.emptyText}>No hay calificaciones registradas</Text>
          ) : (
            grades.map(grade => (
              <View key={grade.id} style={styles.gradeItem}>
                <View style={styles.gradeHeader}>
                  <Text style={styles.gradeSubject}>{grade.subject}</Text>
                  <Text style={styles.gradeScore}>{grade.score}</Text>
                </View>
                <Text style={styles.gradeDate}>Fecha: {new Date(grade.date).toLocaleDateString()}</Text>
                {grade.comments ? (
                  <Text style={styles.gradeComments}>{grade.comments}</Text>
                ) : null}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  studentAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  studentCode: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  studentGrade: {
    fontSize: 14,
    color: '#3498db',
    marginTop: 5,
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
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
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gradesSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loadingText: {
    textAlign: 'center',
    color: '#7f8c8d',
    padding: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#7f8c8d',
    padding: 20,
  },
  gradeItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  gradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  gradeSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  gradeScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
  },
  gradeDate: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  gradeComments: {
    fontSize: 14,
    color: '#34495e',
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default StudentGradesScreen;