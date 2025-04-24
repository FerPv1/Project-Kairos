import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { authService } from '../services/authService';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('teacher'); // 'teacher' o 'parent'
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Intentar iniciar sesión
      const success = await authService.login(username, password);
      
      if (success) {
        // Actualizar estado global de autenticación
        global.updateAuthStatus(true);
        
        // Registrar en consola para depuración
        console.log('Inicio de sesión exitoso, redirigiendo...');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>kAIros</Text>
        <Text style={styles.headerSubtitle}>Gestión escolar inteligente</Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.userTypeContainer}>
          <TouchableOpacity 
            style={[
              styles.userTypeButton, 
              userType === 'teacher' ? styles.activeUserType : {}
            ]}
            onPress={() => setUserType('teacher')}
          >
            <Text style={[
              styles.userTypeText,
              userType === 'teacher' ? styles.activeUserTypeText : {}
            ]}>
              Profesor
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.userTypeButton, 
              userType === 'parent' ? styles.activeUserType : {}
            ]}
            onPress={() => setUserType('parent')}
          >
            <Text style={[
              styles.userTypeText,
              userType === 'parent' ? styles.activeUserTypeText : {}
            ]}>
              Padre/Tutor
            </Text>
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerLinkText}>¿No tienes una cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 30,
    paddingTop: 60,
    backgroundColor: '#3498db',
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formContainer: {
    padding: 20,
  },
  userTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeUserType: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
  },
  userTypeText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  activeUserTypeText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loginButton: {
    backgroundColor: '#3498db',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    alignItems: 'center',
  },
  registerLinkText: {
    color: '#3498db',
    fontSize: 16,
  },
});

export default LoginScreen;