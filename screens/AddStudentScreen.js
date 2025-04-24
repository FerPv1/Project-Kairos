import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { studentService } from '../services/studentService';

const AddStudentScreen = ({ navigation }) => {
  const [student, setStudent] = useState({
    firstName: '',
    lastName: '',
    level: 'inicial', // 'inicial' o 'primaria'
    section: 'I',     // Para inicial: 'I', 'II', 'III'; Para primaria: '1', '2', '3', '4', '5', '6'
    grade: '',
    parentId: '',
  });

  const [loading, setLoading] = useState(false);

  // Opciones para nivel inicial
  const inicialSections = ['I', 'II', 'III'];
  
  // Opciones para nivel primaria
  const primariaSections = ['1', '2', '3', '4', '5', '6'];

  const handleSave = async () => {
    if (!student.firstName || !student.lastName) {
      Alert.alert('Error', 'Por favor ingresa nombre y apellido');
      return;
    }

    try {
      setLoading(true);
      
      // Generar código automáticamente según el nivel (A para inicial, B para primaria)
      // El servicio se encargará de generar el código completo
      const newStudent = {
        ...student,
        // El código se generará automáticamente en el servicio
      };
      
      const savedStudent = await studentService.addStudent(newStudent);
      
      Alert.alert(
        'Éxito', 
        `Estudiante agregado correctamente con código: ${savedStudent.studentCode}`,
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack() 
          }
        ]
      );
    } catch (error) {
      console.error('Error al guardar estudiante:', error);
      Alert.alert('Error', 'No se pudo guardar el estudiante');
    } finally {
      setLoading(false);
    }
  };

  const updateLevel = (level) => {
    // Actualizar nivel y reiniciar sección según el nivel seleccionado
    const newSection = level === 'inicial' ? 'I' : '1';
    const newGrade = level === 'inicial' ? 'Sección I' : '1° Grado';
    
    setStudent({
      ...student,
      level,
      section: newSection,
      grade: newGrade
    });
  };

  const updateSection = (section) => {
    // Actualizar sección y grado según la sección seleccionada
    let grade = '';
    
    if (student.level === 'inicial') {
      grade = `Sección ${section}`;
    } else {
      grade = `${section}° Grado`;
    }
    
    setStudent({
      ...student,
      section,
      grade
    });
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
        <Text style={styles.headerTitle}>Agregar Estudiante</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <Text style={styles.inputLabel}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={student.firstName}
            onChangeText={(text) => setStudent({...student, firstName: text})}
            placeholder="Nombre del estudiante"
          />
          
          <Text style={styles.inputLabel}>Apellido</Text>
          <TextInput
            style={styles.input}
            value={student.lastName}
            onChangeText={(text) => setStudent({...student, lastName: text})}
            placeholder="Apellido del estudiante"
          />
          
          <Text style={styles.sectionTitle}>Nivel y Sección</Text>
          
          <View style={styles.levelContainer}>
            <TouchableOpacity 
              style={[
                styles.levelButton, 
                student.level === 'inicial' ? styles.activeButton : {}
              ]}
              onPress={() => updateLevel('inicial')}
            >
              <Text style={[
                styles.levelButtonText,
                student.level === 'inicial' ? styles.activeButtonText : {}
              ]}>
                Inicial
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.levelButton, 
                student.level === 'primaria' ? styles.activeButton : {}
              ]}
              onPress={() => updateLevel('primaria')}
            >
              <Text style={[
                styles.levelButtonText,
                student.level === 'primaria' ? styles.activeButtonText : {}
              ]}>
                Primaria
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.inputLabel}>Sección</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.sectionsScrollView}
          >
            {student.level === 'inicial' ? (
              inicialSections.map(section => (
                <TouchableOpacity 
                  key={section}
                  style={[
                    styles.sectionButton, 
                    student.section === section ? styles.activeButton : {}
                  ]}
                  onPress={() => updateSection(section)}
                >
                  <Text style={[
                    styles.sectionButtonText,
                    student.section === section ? styles.activeButtonText : {}
                  ]}>
                    Sección {section}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              primariaSections.map(section => (
                <TouchableOpacity 
                  key={section}
                  style={[
                    styles.sectionButton, 
                    student.section === section ? styles.activeButton : {}
                  ]}
                  onPress={() => updateSection(section)}
                >
                  <Text style={[
                    styles.sectionButtonText,
                    student.section === section ? styles.activeButtonText : {}
                  ]}>
                    {section}° Grado
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
          
          <Text style={styles.codePreview}>
            El código del estudiante se generará automáticamente: 
            <Text style={styles.codeHighlight}>
              {student.level === 'inicial' ? 'A' : 'B'}
              {student.level === 'inicial' ? 
                (student.section === 'I' ? '1' : student.section === 'II' ? '2' : '3') : 
                student.section}
              XXX
            </Text>
          </Text>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Guardando...' : 'Guardar Estudiante'}
            </Text>
          </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  formSection: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  levelContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  levelButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  levelButtonText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  activeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionsScrollView: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  sectionButton: {
    padding: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  codePreview: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
    textAlign: 'center',
  },
  codeHighlight: {
    fontWeight: 'bold',
    color: '#3498db',
  },
  saveButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddStudentScreen;