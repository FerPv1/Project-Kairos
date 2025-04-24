import AsyncStorage from '@react-native-async-storage/async-storage';

// Claves para almacenamiento
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Usuarios de ejemplo para pruebas (con credenciales más simples)
const DEMO_USERS = [
  {
    id: '1',
    username: 'profesor',
    password: '123456',
    name: 'Profesor Demo',
    role: 'teacher'
  },
  {
    id: '2',
    username: 'padre',
    password: '123456',
    name: 'Padre Demo',
    role: 'parent'
  }
];

export const authService = {
  /**
   * Iniciar sesión con nombre de usuario y contraseña
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} - Datos del usuario autenticado
   */
  login: async (username, password) => {
    try {
      // Para pruebas: siempre autenticar con éxito
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, 'test-token');
      console.log('Token guardado para pruebas');
      return true;
      
      // Código original comentado para pruebas
      /*
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.token);
        return true;
      }
      
      return false;
      */
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  },
  
  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - Datos del nuevo usuario
   * @returns {Promise<Object>} - Datos del usuario registrado
   */
  register: async (userData) => {
    try {
      // En una aplicación real, aquí se enviarían los datos al servidor
      // Para esta demo, simplemente devolvemos los datos del usuario
      
      // Crear objeto de usuario sin la contraseña
      const newUser = {
        id: Date.now().toString(),
        username: userData.username,
        name: userData.name,
        role: userData.role
      };
      
      return newUser;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },
  
  /**
   * Cerrar sesión
   * @returns {Promise<boolean>} - true si se cerró sesión correctamente
   */
  logout: async () => {
    try {
      // Eliminar datos de sesión
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
      
      return true;
    } catch (error) {
      console.error('Error en logout:', error);
      return false;
    }
  },
  
  /**
   * Verifica si el usuario está autenticado
   * @returns {Promise<boolean>} - true si está autenticado
   */
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      console.log('Token encontrado:', token);
      return !!token; // Devuelve true si hay un token, false si no
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      return false;
    }
  },
  
  /**
   * Obtener datos del usuario actual
   * @returns {Promise<Object|null>} - Datos del usuario o null si no hay sesión
   */
  getCurrentUser: async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  }
};

export default authService;