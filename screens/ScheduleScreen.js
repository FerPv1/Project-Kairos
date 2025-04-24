import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ScheduleScreen = () => {
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const timeSlots = ['7:00 - 8:00', '8:00 - 9:00', '9:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00'];
  
  const [selectedDay, setSelectedDay] = useState('Lunes');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [className, setClassName] = useState('');
  const [classTeacher, setClassTeacher] = useState('');
  const [classRoom, setClassRoom] = useState('');
  
  // Estado inicial del horario
  const [schedule, setSchedule] = useState({
    'Lunes': {
      '7:00 - 8:00': { subject: 'Matemáticas', teacher: 'Prof. García', room: 'A101' },
      '8:00 - 9:00': { subject: 'Español', teacher: 'Prof. Rodríguez', room: 'A102' },
      '9:00 - 10:00': { subject: 'Ciencias', teacher: 'Prof. López', room: 'B201' },
      '10:00 - 11:00': { subject: 'Recreo', teacher: '', room: 'Patio' },
      '11:00 - 12:00': { subject: 'Historia', teacher: 'Prof. Martínez', room: 'A103' },
      '12:00 - 13:00': { subject: 'Inglés', teacher: 'Prof. Smith', room: 'B202' },
      '13:00 - 14:00': { subject: 'Educación Física', teacher: 'Prof. Hernández', room: 'Gimnasio' },
    },
    'Martes': {
      '7:00 - 8:00': { subject: 'Ciencias', teacher: 'Prof. López', room: 'B201' },
      '8:00 - 9:00': { subject: 'Matemáticas', teacher: 'Prof. García', room: 'A101' },
      '9:00 - 10:00': { subject: 'Inglés', teacher: 'Prof. Smith', room: 'B202' },
      '10:00 - 11:00': { subject: 'Recreo', teacher: '', room: 'Patio' },
      '11:00 - 12:00': { subject: 'Español', teacher: 'Prof. Rodríguez', room: 'A102' },
      '12:00 - 13:00': { subject: 'Arte', teacher: 'Prof. Gómez', room: 'C301' },
      '13:00 - 14:00': { subject: 'Tutoría', teacher: 'Prof. Martínez', room: 'A103' },
    },
    'Miércoles': {
      '7:00 - 8:00': { subject: 'Historia', teacher: 'Prof. Martínez', room: 'A103' },
      '8:00 - 9:00': { subject: 'Ciencias', teacher: 'Prof. López', room: 'B201' },
      '9:00 - 10:00': { subject: 'Matemáticas', teacher: 'Prof. García', room: 'A101' },
      '10:00 - 11:00': { subject: 'Recreo', teacher: '', room: 'Patio' },
      '11:00 - 12:00': { subject: 'Educación Física', teacher: 'Prof. Hernández', room: 'Gimnasio' },
      '12:00 - 13:00': { subject: 'Español', teacher: 'Prof. Rodríguez', room: 'A102' },
      '13:00 - 14:00': { subject: 'Tecnología', teacher: 'Prof. Ramírez', room: 'Lab 1' },
    },
    'Jueves': {
      '7:00 - 8:00': { subject: 'Inglés', teacher: 'Prof. Smith', room: 'B202' },
      '8:00 - 9:00': { subject: 'Historia', teacher: 'Prof. Martínez', room: 'A103' },
      '9:00 - 10:00': { subject: 'Español', teacher: 'Prof. Rodríguez', room: 'A102' },
      '10:00 - 11:00': { subject: 'Recreo', teacher: '', room: 'Patio' },
      '11:00 - 12:00': { subject: 'Matemáticas', teacher: 'Prof. García', room: 'A101' },
      '12:00 - 13:00': { subject: 'Ciencias', teacher: 'Prof. López', room: 'B201' },
      '13:00 - 14:00': { subject: 'Música', teacher: 'Prof. Torres', room: 'Auditorio' },
    },
    'Viernes': {
      '7:00 - 8:00': { subject: 'Educación Física', teacher: 'Prof. Hernández', room: 'Gimnasio' },
      '8:00 - 9:00': { subject: 'Tecnología', teacher: 'Prof. Ramírez', room: 'Lab 1' },
      '9:00 - 10:00': { subject: 'Matemáticas', teacher: 'Prof. García', room: 'A101' },
      '10:00 - 11:00': { subject: 'Recreo', teacher: '', room: 'Patio' },
      '11:00 - 12:00': { subject: 'Ciencias', teacher: 'Prof. López', room: 'B201' },
      '12:00 - 13:00': { subject: 'Español', teacher: 'Prof. Rodríguez', room: 'A102' },
      '13:00 - 14:00': { subject: 'Arte', teacher: 'Prof. Gómez', room: 'C301' },
    },
  });

  const editClass = (timeSlot) => {
    const currentClass = schedule[selectedDay][timeSlot];
    
    setEditingClass(timeSlot);
    setClassName(currentClass.subject);
    setClassTeacher(currentClass.teacher);
    setClassRoom(currentClass.room);
    setModalVisible(true);
  };

  const saveClass = () => {
    if (!className.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre de la clase');
      return;
    }

    setSchedule(prevSchedule => ({
      ...prevSchedule,
      [selectedDay]: {
        ...prevSchedule[selectedDay],
        [editingClass]: {
          subject: className,
          teacher: classTeacher,
          room: classRoom
        }
      }
    }));

    // Limpiar el formulario y cerrar el modal
    setModalVisible(false);
    setEditingClass(null);
    setClassName('');
    setClassTeacher('');
    setClassRoom('');
  };

  const renderTimeSlot = (timeSlot) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Horario Escolar</Text>
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
        <Text style={styles.scheduleTitle}>Horario para {selectedDay}</Text>
        
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
  header: {
    backgroundColor: '#3498db',
    padding: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  daysContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  dayButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
  },
  selectedDayButton: {
    backgroundColor: '#3498db',
  },
  dayButtonText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  selectedDayButtonText: {
    color: 'white',
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
    marginBottom: 10,
  },
  classesList: {
    flex: 1,
  },
  classItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeContainer: {
    backgroundColor: '#3498db',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 15,
  },
  timeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  classInfoContainer: {
    flex: 1,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  classDetails: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
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
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
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

export default ScheduleScreen;