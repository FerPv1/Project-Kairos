import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { scheduleService } from '../services/scheduleService';

const ScheduleScreen = () => {
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const timeSlots = ['7:00 - 8:00', '8:00 - 9:00', '9:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00'];
  
  const [selectedDay, setSelectedDay] = useState('Lunes');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [className, setClassName] = useState('');
  const [classTeacher, setClassTeacher] = useState('');
  const [classRoom, setClassRoom] = useState('');
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Nuevo estado para el grado seleccionado
  const [selectedGrade, setSelectedGrade] = useState('3° Grado');
  
  // Lista de grados disponibles
  const availableGrades = [
    'Sección I', 'Sección II', 'Sección III',  // Inicial
    '1° Grado', '2° Grado', '3° Grado', '4° Grado', '5° Grado', '6° Grado'  // Primaria
  ];
  
  // Cargar datos del horario al iniciar
  useEffect(() => {
    loadScheduleData();
  }, [selectedGrade]);

  // Cargar datos del horario desde el servicio
  const loadScheduleData = async () => {
    setLoading(true);
    try {
      // En una implementación real, aquí se cargaría el horario específico para el grado seleccionado
      // Por ahora, usamos el mismo horario para todos los grados
      const scheduleData = await scheduleService.getFullSchedule();
      setSchedule(scheduleData);
    } catch (error) {
      console.error('Error al cargar datos del horario:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del horario');
    } finally {
      setLoading(false);
    }
  };

  const editClass = (timeSlot) => {
    const currentClass = schedule[selectedDay][timeSlot];
    
    setEditingClass(timeSlot);
    setClassName(currentClass.subject);
    setClassTeacher(currentClass.teacher);
    setClassRoom(currentClass.room);
    setModalVisible(true);
  };

  const saveClass = async () => {
    if (!className.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre de la clase');
      return;
    }

    try {
      const classData = {
        subject: className,
        teacher: classTeacher,
        room: classRoom,
        grade: selectedGrade  // Agregar el grado al guardar la clase
      };
      
      // Guardar en el servicio
      const success = await scheduleService.updateClass(selectedDay, editingClass, classData);
      
      if (success) {
        // Actualizar estado local
        setSchedule(prevSchedule => ({
          ...prevSchedule,
          [selectedDay]: {
            ...prevSchedule[selectedDay],
            [editingClass]: classData
          }
        }));

        // Limpiar el formulario y cerrar el modal
        setModalVisible(false);
        setEditingClass(null);
        setClassName('');
        setClassTeacher('');
        setClassRoom('');
        
        Alert.alert('Éxito', 'Clase actualizada correctamente');
      } else {
        Alert.alert('Error', 'No se pudo actualizar la clase');
      }
    } catch (error) {
      console.error('Error al guardar clase:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar la clase');
    }
  };

  const renderTimeSlot = (timeSlot) => {
    if (!schedule[selectedDay] || !schedule[selectedDay][timeSlot]) {
      return null;
    }
    
    const classInfo = schedule[selectedDay][timeSlot];
    
    return (
      <TouchableOpacity 
        key={timeSlot} 
        style={styles.classItem}
        onPress={() => editClass(timeSlot)}
      >
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{timeSlot}</Text>
        </View>
        
        <View style={styles.classInfoContainer}>
          <Text style={styles.classTitle}>{classInfo.subject}</Text>
          {classInfo.teacher ? (
            <Text style={styles.classDetails}>{classInfo.teacher}</Text>
          ) : null}
          {classInfo.room ? (
            <Text style={styles.classDetails}>Aula: {classInfo.room}</Text>
          ) : null}
        </View>
        
        <MaterialIcons name="edit" size={20} color="#3498db" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Cargando horario...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Horario Escolar</Text>
      </View>
      
      {/* Selector de grado */}
      <View style={styles.gradeSelector}>
        <Text style={styles.gradeSelectorLabel}>Grado:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gradeSelectorContent}
        >
          {availableGrades.map(grade => (
            <TouchableOpacity
              key={grade}
              style={[
                styles.gradeButton,
                selectedGrade === grade ? styles.selectedGradeButton : {}
              ]}
              onPress={() => setSelectedGrade(grade)}
            >
              <Text style={[
                styles.gradeButtonText,
                selectedGrade === grade ? styles.selectedGradeButtonText : {}
              ]}>
                {grade}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.daysContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {daysOfWeek.map(day => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                selectedDay === day ? styles.selectedDayButton : {}
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[
                styles.dayButtonText,
                selectedDay === day ? styles.selectedDayButtonText : {}
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.scheduleContainer}>
        <Text style={styles.scheduleTitle}>
          Horario para {selectedGrade} - {selectedDay}
        </Text>
        
        <ScrollView style={styles.classesList}>
          {timeSlots.map(timeSlot => renderTimeSlot(timeSlot))}
        </ScrollView>
      </View>
      
      {/* Modal para editar clase */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Editar Clase ({editingClass})
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nombre de la clase"
              value={className}
              onChangeText={setClassName}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Profesor"
              value={classTeacher}
              onChangeText={setClassTeacher}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Aula"
              value={classRoom}
              onChangeText={setClassRoom}
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
                onPress={saveClass}
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
  header: {
    backgroundColor: '#3498db',
    padding: 15,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  // Estilos para el selector de grado
  gradeSelector: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  gradeSelectorLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginBottom: 5,
  },
  gradeSelectorContent: {
    paddingVertical: 5,
  },
  gradeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  selectedGradeButton: {
    backgroundColor: '#3498db',
  },
  gradeButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  selectedGradeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  daysContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dayButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedDayButton: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
  },
  dayButtonText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  selectedDayButtonText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  scheduleContainer: {
    flex: 1,
    padding: 15,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  classesList: {
    flex: 1,
  },
  classItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  timeText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  classInfoContainer: {
    flex: 1,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  classDetails: {
    fontSize: 14,
    color: '#7f8c8d',
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
  input: {
    backgroundColor: '#f8f9fa',
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
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#3498db',
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ScheduleScreen;