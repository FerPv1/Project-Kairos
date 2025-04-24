import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  TextInput, 
  Alert,
  ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { studentService } from '../services/studentService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ATTENDANCE_KEY = 'attendance_records';

const AttendanceScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  
  // Estado para el nuevo alumno
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    studentCode: '',
    arrivalTime: ''
  });

  // Cargar datos al iniciar
  useEffect(() => {
    loadData();
  }, [selectedDate]);

  // Cargar datos de alumnos y asistencia
  const loadData = async () => {
    setRefreshing(true);
    try {
      const studentsData = await studentService.getStudents();
      setStudents(studentsData);
      setFilteredStudents(studentsData);
      
      // Asegurarse de que selectedDate esté en formato YYYY-MM-DD
      const formattedDate = selectedDate.includes('T') 
        ? selectedDate.split('T')[0] 
        : selectedDate;
      
      const records = await studentService.getAttendanceRecords(formattedDate);
      console.log('Registros cargados:', records);
      setAttendanceRecords(records);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setRefreshing(false);
    }
  };

  // Cambiar a día anterior
  const goToPreviousDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  // Cambiar a día siguiente
  const goToNextDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  // Mostrar selector de fecha
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  // Seleccionar fecha específica
  const selectDate = (date) => {
    setSelectedDate(date);
    setDatePickerVisible(false);
  };

  // Filtrar estudiantes según la búsqueda
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filtered = students.filter(
        student => 
          student.firstName.toLowerCase().includes(text.toLowerCase()) ||
          student.lastName.toLowerCase().includes(text.toLowerCase()) ||
          student.studentCode.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  };

  // Manejar registro de asistencia con reconocimiento facial
  const handleFaceRecognition = () => {
    navigation.navigate('FaceRecognition', { 
      purpose: 'attendance',
      onSuccess: loadData
    });
  };

  // Abrir modal para agregar nuevo alumno
  const handleAddStudent = () => {
    setModalVisible(true);
  };

  // Registrar asistencia para un estudiante seleccionado
  const handleSelectStudent = async (student) => {
    try {
      // Obtener hora actual
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;
      
      // Registrar asistencia
      await studentService.registerAttendance(student.id, currentTime);
      
      // Cerrar modal y recargar datos
      setModalVisible(false);
      setSearchQuery('');
      loadData();
      
      Alert.alert('Éxito', `Asistencia registrada para ${student.firstName} ${student.lastName}`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar la asistencia');
    }
  };

  // Registrar asistencia manualmente
  const handleRegisterAttendance = async (studentId) => {
    try {
      // Mostrar opciones de asistencia
      Alert.alert(
        'Registrar Asistencia',
        '¿El estudiante está presente o ausente?',
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Ausente',
            onPress: async () => {
              // Registrar como ausente con la fecha seleccionada
              await studentService.registerAttendance(studentId, null, 'ausente', selectedDate);
              
              // Recargar datos para actualizar la interfaz
              await loadData();
              Alert.alert('Éxito', 'Se ha registrado la ausencia correctamente');
            }
          },
          {
            text: 'Presente',
            onPress: async () => {
              // Obtener hora actual
              const now = new Date();
              const hours = now.getHours().toString().padStart(2, '0');
              const minutes = now.getMinutes().toString().padStart(2, '0');
              const currentTime = `${hours}:${minutes}`;
              
              // Registrar asistencia como presente con hora y fecha seleccionada
              await studentService.registerAttendance(studentId, currentTime, 'presente', selectedDate);
              
              // Recargar datos para actualizar la interfaz
              await loadData();
              Alert.alert('Éxito', 'Asistencia registrada correctamente');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error al registrar asistencia:', error);
      Alert.alert('Error', 'No se pudo registrar la asistencia');
    }
  };

  // Obtener información de asistencia para un estudiante
  const getAttendanceInfo = (studentId) => {
    const record = attendanceRecords.find(r => r.studentId === studentId);
    if (!record) return null;
    
    // Si está presente, devolver la hora, si está ausente, devolver el día
    if (record.status === 'presente') {
      return { status: 'presente', time: record.arrivalTime };
    } else {
      return { status: 'ausente', date: record.date };
    }
  };

  // Renderizar item de estudiante
  const renderStudentItem = ({ item }) => {
    const attendanceInfo = getAttendanceInfo(item.id);
    
    return (
      <View style={styles.studentItem}>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.firstName} {item.lastName}</Text>
          <Text style={styles.studentCode}>{item.studentCode}</Text>
        </View>
        
        <View style={styles.attendanceActions}>
          {attendanceInfo ? (
            <View style={styles.attendanceStatus}>
              {attendanceInfo.status === 'presente' ? (
                <>
                  <MaterialIcons name="check-circle" size={24} color="#2ecc71" />
                  <Text style={styles.presentText}>Presente ({attendanceInfo.time})</Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="cancel" size={24} color="#e74c3c" />
                  <Text style={styles.absentText}>Ausente</Text>
                </>
              )}
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={() => handleRegisterAttendance(item.id)}
            >
              <Text style={styles.registerButtonText}>Registrar</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.changeStatusButton}
            onPress={() => handleRegisterAttendance(item.id)}
          >
            <MaterialIcons name="edit" size={20} color="#3498db" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Asistencia</Text>
      </View>
      
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={goToPreviousDay}>
          <MaterialIcons name="chevron-left" size={30} color="#3498db" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
          <Text style={styles.dateText}>
            {new Date(selectedDate).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={goToNextDay}>
          <MaterialIcons name="chevron-right" size={30} color="#3498db" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleFaceRecognition}
        >
          <MaterialIcons name="face" size={24} color="white" />
          <Text style={styles.actionButtonText}>Reconocimiento Facial</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#2ecc71' }]}
          onPress={handleAddStudent}
        >
          <MaterialIcons name="person-add" size={24} color="white" />
          <Text style={styles.actionButtonText}>Agregar Manualmente</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderStudentItem}
        style={styles.list}
        refreshing={refreshing}
        onRefresh={loadData}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay estudiantes registrados</Text>
          </View>
        }
      />
      
      {/* Modal para buscar y seleccionar estudiante */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Nuevo Estudiante</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={newStudent.firstName}
              onChangeText={(text) => setNewStudent({...newStudent, firstName: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              value={newStudent.lastName}
              onChangeText={(text) => setNewStudent({...newStudent, lastName: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Código de estudiante"
              value={newStudent.studentCode}
              onChangeText={(text) => setNewStudent({...newStudent, studentCode: text})}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => {
                  // Aquí iría la lógica para guardar el nuevo estudiante
                  Alert.alert('Función en desarrollo', 'Esta funcionalidad estará disponible próximamente');
                  setModalVisible(false);
                }}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
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
  header: {
    backgroundColor: '#3498db',
    padding: 15,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  dateNavButton: {
    padding: 5,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#f8f9fa',
  },
  dateText: {
    fontSize: 16,
    marginRight: 10,
    color: '#2c3e50',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#2ecc71',
  },
  faceRecognitionButton: {
    backgroundColor: '#3498db',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  list: {
    flex: 1,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 1,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  studentCode: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  attendanceActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendanceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  presentText: {
    color: '#2ecc71',
    marginLeft: 5,
  },
  absentText: {
    color: '#e74c3c',
    marginLeft: 5,
  },
  registerButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  changeStatusButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#f8f9fa',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ecf0f1',
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#3498db',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AttendanceScreen;