import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useBible } from '@/contexts/BibleContext';
import { useTheme } from '@/hooks/useTheme';
import { ChevronDown, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ModernModal from './ModernModal';
import { ScrollView } from 'react-native';

export default function BibleNavigation() {
  const { bibleData, currentBook, currentChapter, navigateToVerse, settings } =
    useBible();
  const { colors } = useTheme(settings);
  const [showBookPicker, setShowBookPicker] = useState(false);
  const [showChapterPicker, setShowChapterPicker] = useState(false);

  if (!bibleData) return null;

  const currentBookData = bibleData.books.find(
    (book) => book.name === currentBook
  );
  const oldTestamentBooks = bibleData.books.filter(
    (book) => book.testament === 'old'
  );
  const newTestamentBooks = bibleData.books.filter(
    (book) => book.testament === 'new'
  );

  const handleBookSelect = (bookName: string) => {
    navigateToVerse(bookName, 1, 1);
    setShowBookPicker(false);
  };

  const handleChapterSelect = (chapterNumber: number) => {
    navigateToVerse(currentBook, chapterNumber, 1);
    setShowChapterPicker(false);
  };

  const navigateChapter = (direction: 'prev' | 'next') => {
    if (!currentBookData) return;

    let newChapter = currentChapter;
    let newBook = currentBook;

    if (direction === 'next') {
      if (currentChapter < currentBookData.chapters.length) {
        newChapter = currentChapter + 1;
      } else {
        const currentBookIndex = bibleData.books.findIndex(
          (book) => book.name === currentBook
        );
        if (currentBookIndex < bibleData.books.length - 1) {
          newBook = bibleData.books[currentBookIndex + 1].name;
          newChapter = 1;
        }
      }
    } else {
      if (currentChapter > 1) {
        newChapter = currentChapter - 1;
      } else {
        const currentBookIndex = bibleData.books.findIndex(
          (book) => book.name === currentBook
        );
        if (currentBookIndex > 0) {
          const prevBook = bibleData.books[currentBookIndex - 1];
          newBook = prevBook.name;
          newChapter = prevBook.chapters.length;
        }
      }
    }

    navigateToVerse(newBook, newChapter, 1);
  };

  const renderBookSection = (
    title: string,
    books: typeof oldTestamentBooks
  ) => (
    <View className="mb-6">
      <Text
        className="text-lg font-bold mb-3 px-4"
        style={{ color: colors.text + 'CC' }}
      >
        {title}
      </Text>
      <FlatList
        data={books}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={{
          paddingHorizontal: 16,
          justifyContent: 'space-between',
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-1 p-3 mb-2 mx-1 rounded-lg"
            style={{
              backgroundColor:
                item.name === currentBook ? colors.accent : colors.card,
            }}
            onPress={() => handleBookSelect(item.name)}
          >
            <Text
              className="text-center font-medium"
              style={{
                color: item.name === currentBook ? '#ffffff' : colors.text,
              }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <View style={{ backgroundColor: colors.background }}>
      <View
        className="flex-row items-center justify-between p-4 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <TouchableOpacity
          onPress={() => setShowBookPicker(true)}
          className="flex flex-row items-center gap-2"
        >
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            {currentBook}
          </Text>

          <ChevronDown size={20} color={colors.text} />
        </TouchableOpacity>

        <View className="flex-row">
          <TouchableOpacity
            className="p-3 rounded-lg mr-2"
            style={{
              backgroundColor: colors.card,
              opacity:
                currentChapter === 1 && currentBook === bibleData.books[0].name
                  ? 0.5
                  : 1,
            }}
            onPress={() => navigateChapter('prev')}
            disabled={
              currentChapter === 1 && currentBook === bibleData.books[0].name
            }
          >
            <Text className="font-bold " style={{ color: colors.text }}>
              ‹
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-3 rounded-lg mr-2"
            style={{ backgroundColor: colors.card }}
            onPress={() => navigateChapter('next')}
          >
            <Text className="font-bold" style={{ color: colors.text }}>
              ›
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="mr-2"
            onPress={() => setShowChapterPicker(true)}
          >
            <View
              className="flex-row items-center justify-between p-3 rounded-lg min-w-20"
              style={{ backgroundColor: colors.card }}
            >
              <Text className="font-medium" style={{ color: colors.text }}>
                Chapter {currentChapter}
              </Text>
              <ChevronDown size={20} color={colors.text} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Book Picker Modal */}
      <ModernModal
        visible={showBookPicker}
        onClose={() => setShowBookPicker(false)}
        settings={settings}
        size="fullscreen"
      >
        <View className="flex-row justify-between items-center mb-6 w-full">
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            Select Book
          </Text>
          <TouchableOpacity onPress={() => setShowBookPicker(false)}>
            <X size={24} color={colors.text + 'AA'} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          {renderBookSection('Old Testament', oldTestamentBooks)}
          {renderBookSection('New Testament', newTestamentBooks)}
        </ScrollView>
      </ModernModal>

      {/* Chapter Picker Modal */}
      <ModernModal
        visible={showChapterPicker}
        onClose={() => setShowChapterPicker(false)}
        settings={settings}
        size="large"
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            {currentBook} - Select Chapter
          </Text>
          <TouchableOpacity onPress={() => setShowChapterPicker(false)}>
            <X size={24} color={colors.text + 'AA'} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={currentBookData?.chapters || []}
          keyExtractor={(item) => item.number.toString()}
          numColumns={6}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="w-12 h-12 rounded-lg items-center justify-center"
              style={{
                backgroundColor:
                  item.number === currentChapter ? colors.accent : colors.card,
              }}
              onPress={() => handleChapterSelect(item.number)}
            >
              <Text
                className="font-medium"
                style={{
                  color:
                    item.number === currentChapter ? '#ffffff' : colors.text,
                }}
              >
                {item.number}
              </Text>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
        />
      </ModernModal>
    </View>
  );
}
