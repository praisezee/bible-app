import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Dimensions } from 'react-native';
import { useBible } from '@/contexts/BibleContext';
import { useTheme } from '@/hooks/useTheme';
import BibleNavigation from '@/components/BibleNavigation';
import VerseComponent from '@/components/VerseComponent';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withSpring,
  runOnJS,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReadScreen() {
  const {
    bibleData,
    currentBook,
    currentChapter,
    settings,
    bookmarks,
    highlights,
    notes,
    highlightedVerse,
    navigateToVerse,
    isLoading,
  } = useBible();
  const { colors } = useTheme(settings);

  const [currentChapterData, setCurrentChapterData] = useState<any>(null);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (bibleData) {
      const book = bibleData.books.find((b) => b.name === currentBook);
      const chapter = book?.chapters.find((c) => c.number === currentChapter);
      setCurrentChapterData(chapter);
    }
  }, [bibleData, currentBook, currentChapter]);

  const navigateChapter = (direction: 'prev' | 'next') => {
    if (!bibleData) return;

    const currentBookData = bibleData.books.find(
      (book) => book.name === currentBook
    );
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

  const swipeGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const shouldNavigate = Math.abs(event.translationX) > 100;

      if (shouldNavigate) {
        if (event.translationX > 0) {
          runOnJS(navigateChapter)('prev');
        } else {
          runOnJS(navigateChapter)('next');
        }
      }

      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  if (isLoading) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
        <Text className="text-lg" style={{ color: colors.text }}>
          Loading Bible...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <SafeAreaView
        edges={['top']}
        style={{ backgroundColor: colors.background }}
      >
        <BibleNavigation />
      </SafeAreaView>

      <GestureDetector gesture={swipeGesture}>
        <Animated.View className="flex-1" style={animatedStyle}>
          <ScrollView className="flex-1 px-4">
            <View className="py-4">
              {currentChapterData?.verses.map((verse: any) => {
                const isBookmarked = bookmarks.some(
                  (b) =>
                    b.book === currentBook &&
                    b.chapter === currentChapter &&
                    b.verse === verse.number
                );
                const highlight = highlights.find(
                  (h) =>
                    h.book === currentBook &&
                    h.chapter === currentChapter &&
                    h.verse === verse.number
                );
                const hasNote = notes.some(
                  (n) =>
                    n.book === currentBook &&
                    n.chapter === currentChapter &&
                    n.verse === verse.number
                );
                const isHighlighted =
                  ((highlightedVerse &&
                    highlightedVerse.book === currentBook &&
                    highlightedVerse.chapter === currentChapter &&
                    highlightedVerse.verse === verse.number) as boolean) ||
                  undefined;

                return (
                  <VerseComponent
                    key={verse.number}
                    verse={verse}
                    book={currentBook}
                    chapter={currentChapter}
                    settings={settings}
                    isBookmarked={isBookmarked}
                    highlightColor={highlight?.color}
                    hasNote={hasNote}
                    isTemporarilyHighlighted={isHighlighted}
                  />
                );
              })}
            </View>
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
