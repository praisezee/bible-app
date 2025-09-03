import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useBible } from '@/contexts/BibleContext';
import { useTheme } from '@/hooks/useTheme';
import { Search as SearchIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const { searchVerses, navigateToVerse, settings } = useBible();
  const { colors } = useTheme(settings);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      const results = searchVerses(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleResultPress = (book: string, chapter: number, verse: number) => {
    navigateToVerse(book, chapter, verse, true);
  };

  const renderSearchResult = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="p-4 border-b"
      style={{
        backgroundColor: colors.background,
        borderBottomColor: colors.border,
      }}
      onPress={() => handleResultPress(item.book, item.chapter, item.verse)}
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="font-bold" style={{ color: colors.accent }}>
          {item.book} {item.chapter}:{item.verse}
        </Text>
      </View>
      <Text style={{ color: colors.text, lineHeight: 22}}>
        {item.text}
      </Text>
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
          <Text
            className="text-2xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            Search Scripture
          </Text>

          {/* Search Bar */}
          <View
            className="flex-row items-center px-4 py-3 rounded-lg border"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            <SearchIcon size={20} color={colors.text + 'AA'} />
            <TextInput
              className="flex-1 ml-3 text-base"
              style={{ color: colors.text }}
              placeholder="Search verses or references (e.g., 'John 3:16', 'love')"
              placeholderTextColor={colors.text + '80'}
              value={query}
              onChangeText={handleSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {query && (
            <Text
              className="mt-2 text-sm"
              style={{ color: colors.text + 'CC' }}
            >
              {searchResults.length} results found
            </Text>
          )}
        </View>
      </SafeAreaView>

      {/* Search Results */}
      <FlatList
        data={searchResults}
        keyExtractor={(item, index) =>
          `${item.book}-${item.chapter}-${item.verse}-${index}`
        }
        renderItem={renderSearchResult}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          query ? (
            <View className="flex-1 justify-center items-center py-20">
              <SearchIcon size={48} color={colors.text + '40'} />
              <Text
                className="mt-4 text-lg"
                style={{ color: colors.text + 'AA' }}
              >
                No results found
              </Text>
              <Text
                className="mt-2 text-center px-8"
                style={{ color: colors.text + '80' }}
              >
                Try searching for keywords, phrases, or Bible references like
                "John 3:16"
              </Text>
            </View>
          ) : (
            <View className="flex-1 justify-center items-center py-20">
              <SearchIcon size={48} color={colors.text + '40'} />
              <Text
                className="mt-4 text-lg"
                style={{ color: colors.text + 'AA' }}
              >
                Search the Bible
              </Text>
              <Text
                className="mt-2 text-center px-8"
                style={{ color: colors.text + '80' }}
              >
                Enter keywords, phrases, or references to find verses
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}
