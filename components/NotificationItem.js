import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const NotificationItem = ({ notification, onPress, onDelete }) => {
  const getIconName = () => {
    switch (notification.type) {
      case 'event':
        return 'event';
      case 'attendance':
        return 'face';
      case 'grade':
        return 'school';
      case 'message':
        return 'message';
      default:
        return 'notifications';
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        notification.read ? styles.readContainer : styles.unreadContainer
      ]}
      onPress={() => onPress(notification)}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons 
          name={getIconName()} 
          size={24} 
          color="#3498db" 
        />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message} numberOfLines={2}>{notification.message}</Text>
        <Text style={styles.time}>{notification.time}</Text>
      </View>
      
      {onDelete && (
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => onDelete(notification.id)}
        >
          <MaterialIcons name="delete" size={20} color="#e74c3c" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  readContainer: {
    opacity: 0.8,
  },
  iconContainer: {
    marginRight: 15,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
    color: '#95a5a6',
  },
  deleteButton: {
    justifyContent: 'center',
    padding: 5,
  },
});

export default NotificationItem;