import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { attendanceService } from '../services/attendanceService';
import { studentService } from '../services/studentService';

const FaceRecognitionScreen = ({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const cameraRef = useRef(null);
  
  // Obtener parámetros de la ruta
  const { date, purpose } = route.params || {};
  
  // Solicitar permisos de cámara al montar el componente
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Se necesitan permisos de cámara para usar esta función',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    })();
  }, []);
  
  // Función para tomar foto
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setLoading(true);
        
        // Tomar foto
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true
        });
        
        // Simular reconocimiento facial
        setTimeout(async () => {
          try {
            // En una implementación real, aquí llamarías a un servicio de reconocimiento facial
            const students = await studentService.getStudents();
            
            if (students && students.length > 0) {
              const student = students[0]; // Simulación: primer estudiante encontrado
              setStudentData(student);
              
              // Si el propósito es registrar asistencia, lo hacemos
              if (purpose === 'attendance' && date) {
                await attendanceService.updateAttendance(student.id, date, true);
                
                // Esperar un momento para mostrar los datos del estudiante antes de volver
                setTimeout(() => {
                  navigation.navigate('Asistencia', {
                    attendanceRegistered: true,
                    studentId: student.id,
                    studentName: `${student.firstName} ${student.lastName}`,
                    timestamp: new Date().toISOString()
                  });
                }, 2000);
              }
            } else {
              Alert.alert('Error', 'No se pudo reconocer ningún estudiante');
              setLoading(false);
            }
          } catch (error) {
            console.error('Error en reconocimiento:', error);
            Alert.alert('Error', 'Ocurrió un error durante el reconocimiento');
            setLoading(false);
          }
        }, 2000);
        
      } catch (error) {
        console.error('Error al tomar foto:', error);
        Alert.alert('Error', 'No se pudo tomar la foto');
        setLoading(false);
      }
    }
  };
  
  // Función para volver a la pantalla anterior
  const handleGoBack = () => {
    navigation.goBack();
  };
  
  // Si no tenemos permisos, mostramos un mensaje
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.messageText}>Solicitando permisos de cámara...</Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <MaterialIcons name="no-photography" size={80} color="#e74c3c" />
        <Text style={styles.messageText}>No hay acceso a la cámara</Text>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reconocimiento Facial</Text>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>
            {studentData ? 'Registrando asistencia...' : 'Procesando reconocimiento...'}
          </Text>
          
          {studentData && (
            <View style={styles.studentInfoContainer}>
              <Text style={styles.studentName}>
                {studentData.firstName} {studentData.lastName}
              </Text>
              <Text style={styles.studentDetails}>
                {studentData.grade} - Sección {studentData.section}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <>
          <Camera 
            style={styles.camera} 
            type={type}
            ref={cameraRef}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.faceFrame} />
            </View>
          </Camera>
          
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <MaterialIcons name="camera" size={40} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.flipButton}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <MaterialIcons name="flip-camera-ios" size={30} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>
              Coloca tu rostro dentro del marco y presiona el botón de cámara
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 125,
    opacity: 0.7,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(52, 152, 219, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 30,
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
  },
  instructionsText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#2c3e50',
    textAlign: 'center',
  },
  studentInfoContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  studentName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  studentDetails: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  messageText: {
    marginTop: 20,
    fontSize: 18,
    color: '#2c3e50',
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FaceRecognitionScreen;