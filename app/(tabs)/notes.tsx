import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useBible } from '@/contexts/BibleContext';
import { useTheme } from '@/hooks/useTheme';
import { FileText, Trash2, Plus, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ModernModal from '@/components/ModernModal';

export default function NotesScreen() {
  const {
    notes,
    navigateToVerse,
    removeNote,
    settings,
    noteGroups,
    addNoteGroup,
  } = useBible();
  const { colors } = useTheme(settings);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('#3b82f6');

  const groupColors = [
    '#3b82f6',
    '#ef4444',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
  ];

  const createGroup = () => {
    if (newGroupName.trim()) {
      addNoteGroup(newGroupName, newGroupColor);
      setNewGroupName('');
      setNewGroupColor('#3b82f6');
      setShowGroupModal(false);
    }
  };

  const filteredNotes = selectedGroup
    ? notes.filter((n) => n.groupId === selectedGroup)
    : notes.filter((n) => !n.groupId);

  const groupedNotes =
    selectedGroup === null
      ? filteredNotes
      : notes.filter((n) => n.groupId === selectedGroup);

  const renderNote = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="p-4 border-b"
      style={{
        backgroundColor: colors.background,
        borderBottomColor: colors.border,
      }}
      onPress={() => navigateToVerse(item.book, item.chapter, item.verse)}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-4">
          <Text className="font-bold mb-2" style={{ color: colors.accent }}>
            {item.book} {item.chapter}:{item.verse}
          </Text>
          <Text className="mb-2" style={{ color: colors.text, lineHeight: 22 }}>
            {item.text}
          </Text>
          <Text className="text-xs" style={{ color: colors.text + '80' }}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity className="p-2" onPress={() => removeNote(item.id)}>
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <SafeAreaView
        edges={['top']}
        style={{ backgroundColor: colors.background }}
      >
        <View
          className="pb-4 px-4 border-b"
          style={{ borderBottomColor: colors.border }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold" style={{ color: colors.text }}>
              My Notes
            </Text>
            <TouchableOpacity
              className="p-2"
              onPress={() => setShowGroupModal(true)}
            >
              <Plus size={24} color={colors.accent} />
            </TouchableOpacity>
          </View>

          <Text className="mt-1" style={{ color: colors.text + 'CC' }}>
            {groupedNotes.length} notes saved
          </Text>

          {/* Groups Filter */}
          {noteGroups.length > 0 && (
            <View className="mt-4">
              <FlatList
                horizontal
                data={[
                  { id: null, name: 'All', color: colors.accent },
                  ...noteGroups,
                ]}
                keyExtractor={(item) => item.id || 'all'}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="mr-2 px-4 py-2 rounded-full border"
                    style={{
                      backgroundColor:
                        selectedGroup === item.id ? item.color : colors.card,
                      borderColor: item.color,
                    }}
                    onPress={() => setSelectedGroup(item.id)}
                  >
                    <Text
                      className="font-medium"
                      style={{
                        color:
                          selectedGroup === item.id ? '#ffffff' : colors.text,
                      }}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}
        </View>
      </SafeAreaView>

      {/* Notes List */}
      <FlatList
        data={groupedNotes.sort((a, b) => b.timestamp - a.timestamp)}
        keyExtractor={(item) => item.id}
        renderItem={renderNote}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <FileText size={48} color={colors.text + '40'} />
            <Text
              className="mt-4 text-lg"
              style={{ color: colors.text + 'AA' }}
            >
              No notes yet
            </Text>
            <Text
              className="mt-2 text-center px-8"
              style={{ color: colors.text + '80' }}
            >
              Long press on verses while reading to add personal notes
            </Text>
          </View>
        }
      />

      {/* Group Creation Modal */}
      <ModernModal
        visible={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        settings={settings}
        size="medium"
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            Create Note Group
          </Text>
          <TouchableOpacity onPress={() => setShowGroupModal(false)}>
            <X size={24} color={colors.text + 'AA'} />
          </TouchableOpacity>
        </View>

        <TextInput
          className="p-4 rounded-2xl mb-6 border text-base"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          }}
          placeholder="Group name"
          placeholderTextColor={colors.text + '80'}
          value={newGroupName}
          onChangeText={setNewGroupName}
        />

        <Text
          className="text-sm font-semibold mb-3"
          style={{ color: colors.text + 'CC' }}
        >
          Group Color:
        </Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
          {groupColors.map((color) => (
            <TouchableOpacity
              key={color}
              className="w-10 h-10 rounded-full border-2"
              style={{
                backgroundColor: color,
                borderColor:
                  newGroupColor === color ? colors.text : colors.border,
              }}
              onPress={() => setNewGroupColor(color)}
            />
          ))}
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 p-4 rounded-2xl"
            style={{ backgroundColor: colors.accent }}
            onPress={createGroup}
          >
            <Text className="text-white text-center font-semibold text-base">
              Create Group
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 p-4 rounded-2xl"
            style={{ backgroundColor: colors.card }}
            onPress={() => setShowGroupModal(false)}
          >
            <Text
              className="text-center font-semibold text-base"
              style={{ color: colors.text }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ModernModal>
    </View>
  );
}
