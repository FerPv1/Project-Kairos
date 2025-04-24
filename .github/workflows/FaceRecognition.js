import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';

const FaceRecognition = ({ onFaceDetected, onCancel }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleFacesDetected = ({ faces }) => {
    if (faces.length > 0) {
      setFaceDetected(true);
      // Aquí podríamos agregar lógica adicional para verificar la identidad
    } else {
      setFaceDetected(false);
    }
  };

  const handleCapture = async () => {
    if (cameraRef.current && faceDetected) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        
        // Aquí enviaríamos la foto para procesamiento
        onFaceDetected && onFaceDetected(photo);
      } catch (error) {
        Alert.alert('Error', 'No se pudo capturar la imagen');
        console.error(error);
      }
    } else {
      Alert.alert('Aviso', 'Por favor, asegúrate que tu rostro esté visible en el recuadro');
    }
  };

  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.front
        ? Camera.Constants.Type.back
        : Camera.Constants.Type.front
    );
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Solicitando permiso de cámara...</Text></View>;
  }
  
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No hay acceso a la cámara</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: Camera.Constants.FaceDetector.Mode.fast,
          detectLandmarks: Camera.Constants.FaceDetector.Landmarks.none,
          runClassifications: Camera.Constants.FaceDetector.Classifications.none,
          minDetectionInterval: 100,
          tracking: true,
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.faceFrame}>
            {faceDetected && <View style={styles.faceDetectedIndicator} />}
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.flipButton} 
              onPress={toggleCameraType}
            >
              <MaterialIcons name="flip-camera-android" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.captureButton, !faceDetected && styles.disabledButton]} 
              onPress={handleCapture}
              disabled={!faceDetected}
            >
              <Text style={styles.buttonText}>Capturar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 20,
  },
  faceFrame: {
    alignSelf: 'center',
    marginTop: 100,
    width: 250,
    height: 300,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceDetectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    width: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    width: 120,
    alignItems: 'center',
  },
  flipButton: {
    backgroundColor: '#9b59b6',
    padding: 10,
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FaceRecognition;