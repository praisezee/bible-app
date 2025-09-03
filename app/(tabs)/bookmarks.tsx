import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useBible } from '@/contexts/BibleContext';
import { useTheme } from '@/hooks/useTheme';
import { Bookmark as BookmarkIcon, Trash2, Plus, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ModernModal from '@/components/ModernModal';

export default function BookmarksScreen() {
  const {
    bookmarks,
    highlights,
    removeBookmark,
    removeHighlight,
    navigateToVerse,
    settings,
    bookmarkGroups,
    addBookmarkGroup,
    removeBookmarkGroup,
  } = useBible();
  const { colors } = useTheme(settings);
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'highlights'>(
    'bookmarks'
  );
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

  const handleRemoveBookmark = (id: string) => {
    Alert.alert(
      'Remove Bookmark',
      'Are you sure you want to remove this bookmark?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeBookmark(id),
        },
      ]
    );
  };

  const handleRemoveHighlight = (id: string) => {
    Alert.alert(
      'Remove Highlight',
      'Are you sure you want to remove this highlight?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeHighlight(id),
        },
      ]
    );
  };

  const createGroup = () => {
    if (newGroupName.trim()) {
      addBookmarkGroup(newGroupName, newGroupColor);
      setNewGroupName('');
      setNewGroupColor('#3b82f6');
      setShowGroupModal(false);
    }
  };

  const filteredBookmarks = selectedGroup
    ? bookmarks.filter((b) => b.groupId === selectedGroup)
    : bookmarks.filter((b) => !b.groupId);

  const groupedBookmarks =
    selectedGroup === null
      ? filteredBookmarks
      : bookmarks.filter((b) => b.groupId === selectedGroup);

  const renderBookmark = ({ item }: { item: any }) => (
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
          <Text style={{ color: colors.text, lineHeight: 22 }}>
            {item.text}
          </Text>
          <Text className="text-xs mt-2" style={{ color: colors.text + '80' }}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity
          className="p-2"
          onPress={() => handleRemoveBookmark(item.id)}
        >
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderHighlight = ({ item }: { item: any }) => (
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
          <View className="flex-row items-center mb-2">
            <Text className="font-bold mr-2" style={{ color: colors.accent }}>
              {item.book} {item.chapter}:{item.verse}
            </Text>
            <View
              className="w-4 h-4 rounded-full border"
              style={{
                borderColor: colors.border,
                backgroundColor: item.color,
              }}
            />
            {item.colorName && (
              <Text
                className="ml-2 text-xs"
                style={{ color: colors.text + '80' }}
              >
                {item.colorName}
              </Text>
            )}
          </View>
          <Text className="text-xs mt-2" style={{ color: colors.text + '80' }}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity
          className="p-2"
          onPress={() => handleRemoveHighlight(item.id)}
        >
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
              Saved Content
            </Text>
            {activeTab === 'bookmarks' && (
              <TouchableOpacity
                className="p-2"
                onPress={() => setShowGroupModal(true)}
              >
                <Plus size={24} color={colors.accent} />
              </TouchableOpacity>
            )}
          </View>

          {/* Groups Filter for Bookmarks */}
          {activeTab === 'bookmarks' && bookmarkGroups.length > 0 && (
            <View className="mb-4">
              <FlatList
                horizontal
                data={[
                  { id: null, name: 'All', color: colors.accent },
                  ...bookmarkGroups,
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

          {/* Tab Selector */}
          <View
            className="flex-row rounded-lg p-1"
            style={{ backgroundColor: colors.card }}
          >
            <TouchableOpacity
              className="flex-1 py-2 px-4 rounded-md"
              style={{
                backgroundColor:
                  activeTab === 'bookmarks' ? colors.accent : 'transparent',
              }}
              onPress={() => setActiveTab('bookmarks')}
            >
              <Text
                className="text-center font-medium"
                style={{
                  color:
                    activeTab === 'bookmarks' ? '#ffffff' : colors.text + 'AA',
                }}
              >
                Bookmarks (
                {activeTab === 'bookmarks'
                  ? groupedBookmarks.length
                  : bookmarks.length}
                )
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-2 px-4 rounded-md"
              style={{
                backgroundColor:
                  activeTab === 'highlights' ? colors.accent : 'transparent',
              }}
              onPress={() => setActiveTab('highlights')}
            >
              <Text
                className="text-center font-medium"
                style={{
                  color:
                    activeTab === 'highlights' ? '#ffffff' : colors.text + 'AA',
                }}
              >
                Highlights ({highlights.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Content */}
      <FlatList
        data={activeTab === 'bookmarks' ? groupedBookmarks : highlights}
        keyExtractor={(item) => item.id}
        renderItem={
          activeTab === 'bookmarks' ? renderBookmark : renderHighlight
        }
        className="flex-1"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <BookmarkIcon size={48} color={colors.text + '40'} />
            <Text
              className="mt-4 text-lg"
              style={{ color: colors.text + 'AA' }}
            >
              No {activeTab} yet
            </Text>
            <Text
              className="mt-2 text-center px-8"
              style={{ color: colors.text + '80' }}
            >
              Tap on verses while reading to add {activeTab}
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
            Create Bookmark Group
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
