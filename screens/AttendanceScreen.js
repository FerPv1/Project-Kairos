import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Alert,
  ActivityIndicator,
  Modal,
  TextInput
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { attendanceService } from '../services/attendanceService';
import { studentService } from '../services/studentService';
import { Camera } from 'expo-camera'; // Cambiado de react-native-vision-camera a expo-camera

const AttendanceScreen = ({ navigation, route }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [studentCode, setStudentCode] = useState('');

  // Procesar parámetros de la ruta si vienen de reconocimiento facial
  useEffect(() => {
    if (route.params?.attendanceRegistered) {
      const { studentId, studentName, timestamp } = route.params;
      
      // Mostrar mensaje de éxito
      Alert.alert(
        'Asistencia Registrada',
        `Se ha registrado la asistencia de ${studentName} correctamente.`,
        [{ text: 'OK' }]
      );
      
      // Actualizar la lista de asistencia
      loadAttendanceData();
    }
  }, [route.params]);

  useEffect(() => {
    loadStudents();
    loadAttendanceData();
  }, [date]);

  const loadStudents = async () => {
    try {
      const studentsData = await attendanceService.getStudents();
      setStudents(studentsData);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceData = async () => {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const data = await attendanceService.getAttendanceByDate(formattedDate);
      setAttendanceData(data);
    } catch (error) {
      console.error('Error al cargar datos de asistencia:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de asistencia');
    }
  };

  const toggleAttendance = async (studentId, isPresent) => {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      await attendanceService.updateAttendance(studentId, formattedDate, isPresent);
      
      // Actualizar estado local
      setAttendanceData(prev => ({
        ...prev,
        [studentId]: isPresent
      }));
    } catch (error) {
      console.error('Error al actualizar asistencia:', error);
      Alert.alert('Error', 'No se pudo actualizar la asistencia');
    }
  };

  const handlePreviousDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 1);
    setDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    setDate(newDate);
  };

  const handleFaceRecognition = async () => {
    console.log('Navegando a reconocimiento facial...');
    
    // Navegar directamente sin verificar permisos aquí
    // Los permisos se manejarán en la pantalla FaceRecognitionScreen
    navigation.navigate('FaceRecognition', { 
      date: date.toISOString().split('T')[0],
      purpose: 'attendance'
    });
  };

  const handleManualAttendance = () => {
    setModalVisible(true);
  };

  const handleAddStudentByCode = async () => {
    if (!studentCode.trim()) {
      Alert.alert('Error', 'Por favor ingrese un código de estudiante');
      return;
    }

    try {
      // Buscar estudiante por código
      const student = await studentService.getStudentByCode(studentCode);
      
      if (student) {
        // Marcar asistencia
        const formattedDate = date.toISOString().split('T')[0];
        await attendanceService.updateAttendance(student.id, formattedDate, true);
        
        // Actualizar estado local
        setAttendanceData(prev => ({
          ...prev,
          [student.id]: true
        }));
        
        // Verificar si el estudiante ya está en la lista
        const exists = students.some(s => s.id === student.id);
        if (!exists) {
          setStudents(prev => [...prev, student]);
        }
        
        // Cerrar modal y limpiar campo
        setModalVisible(false);
        setStudentCode('');
        
        Alert.alert('Éxito', `Se ha registrado la asistencia de ${student.firstName} ${student.lastName}`);
      } else {
        Alert.alert('Error', 'No se encontró ningún estudiante con ese código');
      }
    } catch (error) {
      console.error('Error al buscar estudiante:', error);
      Alert.alert('Error', 'No se pudo procesar la asistencia manual');
    }
  };

  const renderStudentItem = ({ item }) => {
    const isPresent = attendanceData[item.id] === true;
    const isAbsent = attendanceData[item.id] === false;
    
    return (
      <View style={styles.studentItem}>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.firstName} {item.lastName}</Text>
          <Text style={styles.studentGrade}>{item.grade} - Sección {item.section}</Text>
          <Text style={[
            styles.attendanceStatus,
            isPresent ? styles.presentStatus : isAbsent ? styles.absentStatus : styles.pendingStatus
          ]}>
            {isPresent ? 'Presente' : isAbsent ? 'Ausente' : 'Pendiente'}
          </Text>
        </View>
        
        <View style={styles.attendanceButtons}>
          <TouchableOpacity
            style={[
              styles.attendanceButton,
              styles.presentButton,
              isPresent ? [styles.activeButton, styles.presentActiveButton] : {}
            ]}
            onPress={() => toggleAttendance(item.id, true)}
          >
            <MaterialIcons 
              name={isPresent ? "check-circle" : "check"} 
              size={24} 
              color={isPresent ? "white" : "#2ecc71"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.attendanceButton,
              styles.absentButton,
              isAbsent ? [styles.activeButton, styles.absentActiveButton] : {}
            ]}
            onPress={() => toggleAttendance(item.id, false)}
          >
            <MaterialIcons 
              name={isAbsent ? "cancel" : "close"} 
              size={24} 
              color={isAbsent ? "white" : "#e74c3c"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Cargando datos de asistencia...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Asistencia</Text>
      </View>
      
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={handlePreviousDay} style={styles.dateButton}>
          <MaterialIcons name="chevron-left" size={24} color="#3498db" />
        </TouchableOpacity>
        
        <Text style={styles.dateText}>{formatDate(date)}</Text>
        
        <TouchableOpacity onPress={handleNextDay} style={styles.dateButton}>
          <MaterialIcons name="chevron-right" size={24} color="#3498db" />
        </TouchableOpacity>
      </View>
      
      {students.length > 0 ? (
        <FlatList
          data={students}
          renderItem={renderStudentItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="people" size={60} color="#e0e0e0" />
          <Text style={styles.emptyText}>No hay estudiantes registrados</Text>
        </View>
      )}
      
      {/* Botones en la parte inferior */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.manualAttendanceButton]}
          onPress={handleManualAttendance}
          activeOpacity={0.7}
        >
          <View style={styles.buttonIconContainer}>
            <MaterialIcons name="edit" size={30} color="white" />
          </View>
          <Text style={styles.actionButtonText}>Manual</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.faceRecognitionButton]}
          onPress={handleFaceRecognition}
          activeOpacity={0.7}
        >
          <View style={styles.buttonIconContainer}>
            <MaterialIcons name="face" size={30} color="white" />
          </View>
          <Text style={styles.actionButtonText}>Reconocimiento</Text>
        </TouchableOpacity>
      </View>
      
      {/* Modal para asistencia manual */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialIcons name="assignment-ind" size={32} color="#2ecc71" />
              <Text style={styles.modalTitle}>Asistencia Manual</Text>
            </View>
            
            <View style={styles.divider} />
            
            <Text style={styles.modalSubtitle}>
              Ingrese el código del estudiante para registrar su asistencia
            </Text>
            
            <View style={styles.inputContainer}>
              <MaterialIcons name="person" size={24} color="#7f8c8d" style={styles.inputIcon} />
              <TextInput
                style={styles.codeInput}
                value={studentCode}
                onChangeText={setStudentCode}
                placeholder="Código del estudiante"
                placeholderTextColor="#95a5a6"
                autoCapitalize="none"
                keyboardType="default"
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setStudentCode('');
                }}
              >
                <MaterialIcons name="close" size={20} color="#7f8c8d" />
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddStudentByCode}
              >
                <MaterialIcons name="check" size={20} color="white" />
                <Text style={styles.confirmButtonText}>Registrar</Text>
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
    textAlign: 'center',
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  studentGrade: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  attendanceButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  attendanceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  presentButton: {
    borderColor: '#2ecc71',
    backgroundColor: '#f8fffa',
  },
  absentButton: {
    borderColor: '#e74c3c',
    backgroundColor: '#fff8f8',
  },
  activeButton: {
    borderWidth: 0,
  },
  presentActiveButton: {
    backgroundColor: '#2ecc71',
  },
  absentActiveButton: {
    backgroundColor: '#e74c3c',
  },
  attendanceStatus: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: 'bold',
  },
  presentStatus: {
    color: '#2ecc71',
  },
  absentStatus: {
    color: '#e74c3c',
  },
  pendingStatus: {
    color: '#95a5a6',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    width: '100%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    width: '100%',
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 25,
  },
  inputIcon: {
    marginRight: 10,
  },
  codeInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#34495e',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#2ecc71',
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  registerButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  actionButton: {
    width: '48%',  // Asegura que cada botón ocupe aproximadamente la mitad del espacio
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  manualAttendanceButton: {
    backgroundColor: '#3498db',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  faceRecognitionButton: {
    backgroundColor: '#2ecc71',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
});

export default AttendanceScreen;