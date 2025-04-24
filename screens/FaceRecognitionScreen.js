import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import FaceRecognition from '../components/FaceRecognition';

const FaceRecognitionScreen = ({ navigation, route }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const { purpose = 'attendance' } = route.params || {};

  const handleFaceDetected = (photo) => {
    setCapturedImage(photo);
    setShowCamera(false);
    
    // Aquí podríamos procesar la imagen o enviarla a un servicio
    // Por ahora, solo simulamos un proceso exitoso
    setTimeout(() => {
      if (purpose === 'attendance') {
        navigation.navigate('AttendanceConfirmation', { 
          success: true,
          message: 'Asistencia registrada correctamente'
        });
      } else {
        navigation.goBack();
      }
    }, 2000);
  };

  const handleStartRecognition = () => {
    setCapturedImage(null);
    setShowCamera(true);
  };

  if (showCamera) {
    return (
      <FaceRecognition 
        onFaceDetected={handleFaceDetected}
        onCancel={() => setShowCamera(false)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reconocimiento Facial</Text>
      
      {capturedImage ? (
        <View style={styles.resultContainer}>
          <Image 
            source={{ uri: capturedImage.uri }} 
            style={styles.capturedImage} 
          />
          <Text style={styles.processingText}>Procesando imagen...</Text>
        </View>
      ) : (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionText}>
            Para {purpose === 'attendance' ? 'registrar asistencia' : 'verificar identidad'}, 
            necesitamos escanear tu rostro.
          </Text>
          <Text style={styles.instructionText}>
            Por favor, asegúrate de estar en un lugar bien iluminado y mira directamente a la cámara.
          </Text>
          
          <TouchableOpacity 
            style={styles.startButton}
            onPress={handleStartRecognition}
          >
            <Text style={styles.startButtonText}>Iniciar Reconocimiento</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  startButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 30,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturedImage: {
    width: 250,
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
  },
  processingText: {
    fontSize: 18,
    color: '#3498db',
    fontWeight: 'bold',
  },
});

export default FaceRecognitionScreen;