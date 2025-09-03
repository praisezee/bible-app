import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { Verse, AppSettings } from '@/types/bible';
import { useBible } from '@/contexts/BibleContext';
import { useTheme } from '@/hooks/useTheme';
import {
  Bookmark,
  Palette,
  FileText,
  X,
  Plus,
  Folder,
} from 'lucide-react-native';
import ModernModal from './ModernModal';
import ColorPickerComponent from './ColorPickerComponent';

interface VerseComponentProps {
  verse: Verse;
  book: string;
  chapter: number;
  settings: AppSettings;
  isBookmarked: boolean;
  highlightColor?: string;
  hasNote: boolean;
  isTemporarilyHighlighted?: boolean;
}

const highlightColors = [
  { name: 'Yellow', color: 'bg-yellow-200', value: '#fef08a' },
  { name: 'Blue', color: 'bg-blue-200', value: '#bfdbfe' },
  { name: 'Green', color: 'bg-green-200', value: '#bbf7d0' },
  { name: 'Pink', color: 'bg-pink-200', value: '#f9a8d4' },
  { name: 'Purple', color: 'bg-purple-200', value: '#ddd6fe' },
];

export default function VerseComponent({
  verse,
  book,
  chapter,
  settings,
  isBookmarked,
  highlightColor,
  hasNote,
  isTemporarilyHighlighted,
}: VerseComponentProps) {
  const {
    addBookmark,
    removeBookmark,
    addHighlight,
    removeHighlight,
    addNote,
    updateNote,
    removeNote,
    bookmarks,
    highlights,
    notes,
    bookmarkGroups,
    noteGroups,
    customHighlightColors,
    addCustomHighlightColor,
  } = useBible();
  const { colors } = useTheme(settings);

  const [showActions, setShowActions] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showGroupSelector, setShowGroupSelector] = useState<
    'bookmark' | 'note' | null
  >(null);
  const [noteText, setNoteText] = useState('');
  const [customColorName, setCustomColorName] = useState('');
  const [selectedCustomColor, setSelectedCustomColor] = useState('#ffff00');

  const handlePress = () => {
    setShowActions(true);
  };

  const handleBookmark = () => {
    if (isBookmarked) {
      const bookmark = bookmarks.find(
        (b) =>
          b.book === book && b.chapter === chapter && b.verse === verse.number
      );
      if (bookmark) {
        removeBookmark(bookmark.id);
      }
    } else {
      if (bookmarkGroups.length > 0) {
        setShowGroupSelector('bookmark');
      } else {
        addBookmark(book, chapter, verse.number, verse.text);
      }
    }
    setShowActions(false);
  };

  const handleHighlight = (color: string, colorName?: string) => {
    if (highlightColor) {
      const highlight = highlights.find(
        (h) =>
          h.book === book && h.chapter === chapter && h.verse === verse.number
      );
      if (highlight) {
        removeHighlight(highlight.id);
      }
    }
    addHighlight(book, chapter, verse.number, color, colorName);
    setShowActions(false);
  };

  const handleNote = () => {
    const existingNote = notes.find(
      (n) =>
        n.book === book && n.chapter === chapter && n.verse === verse.number
    );
    setNoteText(existingNote?.text || '');
    if (noteGroups.length > 0 && !existingNote) {
      setShowGroupSelector('note');
    } else {
      setShowNoteModal(true);
    }
    setShowActions(false);
  };

  const saveNote = (groupId?: string) => {
    const existingNote = notes.find(
      (n) =>
        n.book === book && n.chapter === chapter && n.verse === verse.number
    );

    if (noteText.trim()) {
      if (existingNote) {
        updateNote(existingNote.id, noteText);
      } else {
        addNote(book, chapter, verse.number, noteText, groupId);
      }
    } else if (existingNote) {
      removeNote(existingNote.id);
    }

    setShowNoteModal(false);
    setNoteText('');
  };

  const saveCustomColor = () => {
    if (customColorName.trim()) {
      addCustomHighlightColor(customColorName, selectedCustomColor);
      handleHighlight(selectedCustomColor, customColorName);
      setCustomColorName('');
      setSelectedCustomColor('#ffff00');
      setShowColorPicker(false);
    }
  };

  const getHighlightStyle = () => {
    if (isTemporarilyHighlighted) {
      return { backgroundColor: colors.accent + '40' };
    }
    if (!highlightColor) return {};
    return { backgroundColor: highlightColor };
  };

  const allHighlightColors = [
    ...highlightColors,
    ...customHighlightColors.map((c) => ({
      name: c.name,
      color: '',
      value: c.color,
    })),
  ];

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        className="flex-row p-2 mb-1 rounded-lg"
        style={getHighlightStyle()}
      >
        <Text
          className="text-sm font-bold mr-3 mt-1"
          style={{
            color: colors.text + 'AA',
            fontSize: settings.fontSize * 0.8,
          }}
        >
          {verse.number}
        </Text>
        <View className="flex-1">
          <Text
            style={{
              color: colors.text,
              fontSize: settings.fontSize,
              lineHeight: settings.fontSize * settings.lineSpacing,
            }}
          >
            {verse.text}
          </Text>
          {(isBookmarked || hasNote) && (
            <View className="flex-row mt-2 space-x-2">
              {isBookmarked && (
                <Bookmark
                  size={16}
                  color={colors.accent}
                  fill={colors.accent}
                />
              )}
              {hasNote && <FileText size={16} color="#f59e0b" />}
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Actions Modal */}
      <ModernModal
        visible={showActions}
        onClose={() => setShowActions(false)}
        settings={settings}
        size="medium"
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            {book} {chapter}:{verse.number}
          </Text>
          <TouchableOpacity onPress={() => setShowActions(false)}>
            <X size={24} color={colors.text + 'AA'} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="flex-row items-center p-4 rounded-2xl mb-3"
          style={{ backgroundColor: colors.card }}
          onPress={handleBookmark}
        >
          <Bookmark
            size={22}
            color={colors.accent}
            fill={isBookmarked ? colors.accent : 'none'}
          />
          <Text
            className="ml-4 font-semibold text-base"
            style={{ color: colors.text }}
          >
            {isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
          </Text>
        </TouchableOpacity>

        <View className="mb-3">
          <Text
            className="text-sm font-semibold mb-3"
            style={{ color: colors.text + 'CC' }}
          >
            Highlight Color:
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {allHighlightColors.map((color, index) => (
              <TouchableOpacity
                key={`${color.name}-${index}`}
                className="w-10 h-10 rounded-full border-2"
                style={{
                  backgroundColor: color.value,
                  borderColor:
                    highlightColor === color.value
                      ? colors.text
                      : colors.border,
                }}
                onPress={() => handleHighlight(color.value, color.name)}
              />
            ))}
            <TouchableOpacity
              className="w-10 h-10 rounded-full border-2 items-center justify-center"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.card,
              }}
              onPress={() => setShowColorPicker(true)}
            >
              <Plus size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className="flex-row items-center p-4 rounded-2xl mb-4"
          style={{ backgroundColor: colors.card }}
          onPress={handleNote}
        >
          <FileText size={22} color="#f59e0b" />
          <Text
            className="ml-4 font-semibold text-base"
            style={{ color: colors.text }}
          >
            {hasNote ? 'Edit Note' : 'Add Note'}
          </Text>
        </TouchableOpacity>
      </ModernModal>

      {/* Custom Color Picker Modal */}
      <ModernModal
        visible={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        settings={settings}
        size="large"
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            Create Custom Color
          </Text>
          <TouchableOpacity onPress={() => setShowColorPicker(false)}>
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
          placeholder="Color name (e.g., 'My Blue')"
          placeholderTextColor={colors.text + '80'}
          value={customColorName}
          onChangeText={setCustomColorName}
        />

        <ColorPickerComponent
          selectedColor={selectedCustomColor}
          onColorChange={setSelectedCustomColor}
          colors={colors}
        />

        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity
            className="flex-1 p-4 rounded-2xl"
            style={{ backgroundColor: colors.accent }}
            onPress={saveCustomColor}
          >
            <Text className="text-white text-center font-semibold text-base">
              Save Color
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 p-4 rounded-2xl"
            style={{ backgroundColor: colors.card }}
            onPress={() => setShowColorPicker(false)}
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

      {/* Group Selector Modal */}
      <ModernModal
        visible={showGroupSelector !== null}
        onClose={() => setShowGroupSelector(null)}
        settings={settings}
        size="medium"
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            Select {showGroupSelector === 'bookmark' ? 'Bookmark' : 'Note'}{' '}
            Group
          </Text>
          <TouchableOpacity onPress={() => setShowGroupSelector(null)}>
            <X size={24} color={colors.text + 'AA'} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="flex-row items-center p-4 rounded-2xl mb-3"
          style={{ backgroundColor: colors.card }}
          onPress={() => {
            if (showGroupSelector === 'bookmark') {
              addBookmark(book, chapter, verse.number, verse.text);
            } else {
              setShowNoteModal(true);
            }
            setShowGroupSelector(null);
          }}
        >
          <Text
            className="font-semibold text-base"
            style={{ color: colors.text }}
          >
            No Group
          </Text>
        </TouchableOpacity>

        <FlatList
          data={showGroupSelector === 'bookmark' ? bookmarkGroups : noteGroups}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex-row items-center p-4 rounded-2xl mb-3"
              style={{ backgroundColor: colors.card }}
              onPress={() => {
                if (showGroupSelector === 'bookmark') {
                  addBookmark(book, chapter, verse.number, verse.text, item.id);
                } else {
                  setShowNoteModal(true);
                }
                setShowGroupSelector(null);
              }}
            >
              <View
                className="w-4 h-4 rounded-full mr-4"
                style={{ backgroundColor: item.color }}
              />
              <Text
                className="font-semibold text-base"
                style={{ color: colors.text }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </ModernModal>

      {/* Note Modal */}
      <ModernModal
        visible={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        settings={settings}
        size="large"
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            Note for {book} {chapter}:{verse.number}
          </Text>
          <TouchableOpacity onPress={() => setShowNoteModal(false)}>
            <X size={24} color={colors.text + 'AA'} />
          </TouchableOpacity>
        </View>

        <TextInput
          className="rounded-2xl p-4 min-h-32 text-base"
          style={{
            backgroundColor: colors.card,
            color: colors.text,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          multiline
          placeholder="Enter your note here..."
          placeholderTextColor={colors.text + '80'}
          value={noteText}
          onChangeText={setNoteText}
          textAlignVertical="top"
        />

        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity
            className="flex-1 p-4 rounded-2xl"
            style={{ backgroundColor: colors.accent }}
            onPress={() => saveNote()}
          >
            <Text className="text-white text-center font-semibold text-base">
              Save Note
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 p-4 rounded-2xl"
            style={{ backgroundColor: colors.card }}
            onPress={() => setShowNoteModal(false)}
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
    </>
  );
}
