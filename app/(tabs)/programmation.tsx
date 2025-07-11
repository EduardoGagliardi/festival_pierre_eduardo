import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { colors, fonts } from "../../constants/design_constants";
import ProgrammationApiService from "../../services/programmation_api_service";
import type Day from "../../models/day";
import type Programme from "../../models/programme";
import { dbUrl } from "../../constants/api_constans";

const ProgrammationScreen = (): React.JSX.Element => {
	const router = useRouter();
	const params = useLocalSearchParams();
	const [days, setDays] = useState<Day[]>([]);
	const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
	const [programmes, setProgrammes] = useState<Programme[]>([]);
	const [filteredProgrammes, setFilteredProgrammes] = useState<Programme[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const programmationService = new ProgrammationApiService();
        const programmesData = await programmationService.getProgrammation();
        console.log("Loaded programmes:", programmesData.length);
        console.log("Sample programme:", programmesData[0]);
        setProgrammes(programmesData);
      } catch (error) {
        console.error("Error fetching programmes:", error);
      }
    };

    fetchProgrammes();
  }, []);

  useEffect(() => {
    // Filter programmes by selected day and search query
    let filtered = programmes;

    if (selectedDayId) {
      filtered = filtered.filter(
        (programme) => programme.dayId === selectedDayId
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((programme) => {
        const artistMatch = programme.artist?.name
          ?.toLowerCase()
          .includes(query);
        const stageMatch = programme.stage?.name?.toLowerCase().includes(query);
        return artistMatch || stageMatch;
      });
    }

    setFilteredProgrammes(filtered);
  }, [selectedDayId, searchQuery, programmes]);

  // Filter days to only show those with programmes and set first available day as selected
  useEffect(() => {
    if (programmes.length > 0) {
      // Get unique day IDs that have programmes
      const daysWithProgrammes = new Set(
        programmes.map((programme) => programme.dayId)
      );

      // Get all days from the original fetch
      const fetchDays = async () => {
        try {
          const response = await fetch(`${dbUrl}/days`);
          const daysData = await response.json();
          // Convert string IDs to numbers
          const processedDays = daysData.map((day: any) => ({
            ...day,
            id: Number(day.id),
          }));

          // Filter days to only include those with programmes
          const availableDays = processedDays.filter((day: any) =>
            daysWithProgrammes.has(day.id)
          );

          // Set the first available day as selected if no day is currently selected
          if (!selectedDayId && availableDays.length > 0) {
            setSelectedDayId(availableDays[0].id);
          }

          // Update days state to only show days with content
          setDays(availableDays);
        } catch (error) {
          console.error("Error fetching days:", error);
        }
      };

      fetchDays();
    }
  	}, [programmes, selectedDayId]);

	// Update days to show which ones have search results
	useEffect(() => {
		if (programmes.length > 0 && searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			
			// Get days that have programmes matching the search
			const daysWithSearchResults = new Set(
				programmes
					.filter(programme => {
						const artistMatch = programme.artist?.name?.toLowerCase().includes(query);
						const stageMatch = programme.stage?.name?.toLowerCase().includes(query);
						return artistMatch || stageMatch;
					})
					.map(programme => programme.dayId)
			);
			
			console.log("Search query:", query);
			console.log("Days with search results:", Array.from(daysWithSearchResults));
			
			// Update days to show which ones have search results
			setDays(prevDays => 
				prevDays.map(day => ({
					...day,
					hasSearchResults: daysWithSearchResults.has(day.id)
				}))
			);
		} else if (programmes.length > 0) {
			// Reset days when search is cleared
			setDays(prevDays => 
				prevDays.map(day => ({
					...day,
					hasSearchResults: true
				}))
			);
		}
	}, [searchQuery, programmes]);

	// Handle search query from navigation params
	useEffect(() => {
		if (params.searchQuery && typeof params.searchQuery === 'string') {
			setSearchQuery(params.searchQuery);
		}
	}, [params.searchQuery]);

	const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString("fr-FR", { weekday: "short" });
    const dayNumber = date.getDate();
    const monthNumber = date.getMonth() + 1;
    return `${dayName}. ${dayNumber}/${monthNumber}`;
  };

  const handleDayPress = (dayId: number) => {
    setSelectedDayId(dayId);
  };

  	const handleFavoritePress = (programmeId: number) => {
		setFavorites((prev) => {
			const newFavorites = new Set(prev);
			if (newFavorites.has(programmeId)) {
				newFavorites.delete(programmeId);
			} else {
				newFavorites.add(programmeId);
			}
			return newFavorites;
		});
	};

	const handleStagesButtonPress = () => {
		router.push("/(tabs)/stages");
	};

  const renderProgrammeItem = ({ item }: { item: Programme }) => {
    const imageUrl = `${dbUrl}/images/artists/${item.artist.poster}`;
    const isFavorite = favorites.has(item.id);

    return (
      <View style={styles.programmeItem}>
        {/* Left: Artist poster */}
        <View style={styles.posterContainer}>
          <Image source={{ uri: imageUrl }} style={styles.poster} />
        </View>

        {/* Center: Artist info */}
        <View style={styles.infoContainer}>
          <Text style={styles.artistName}>{item.artist.name}</Text>
          <Text style={styles.timeText}>
            {item.time_start} → {item.time_end}
          </Text>
          <Text style={styles.stageName}>{item.stage.name}</Text>
        </View>

        {/* Right: Favorite button */}
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            isFavorite && styles.favoriteButtonActive,
          ]}
          onPress={() => handleFavoritePress(item.id)}
        >
          <Feather
            name="heart"
            size={28}
            color={isFavorite ? colors.ternary : "#666"}
            fill={isFavorite ? colors.ternary : "none"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      			{/* Topbar */}
			<View style={styles.topbar}>
				{/* Orange calendar button */}
				<TouchableOpacity 
					style={styles.calendarButton}
					onPress={handleStagesButtonPress}
				>
					<Feather name="calendar" size={20} color="white" />
				</TouchableOpacity>

        {/* Horizontal scroll for dates */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.datesContainer}
        >
          {days.map((day) => (
            <TouchableOpacity
              key={day.id}
              style={[
                styles.dateButton,
                selectedDayId === day.id && styles.selectedDateButton,
              ]}
              onPress={() => handleDayPress(day.id)}
            >
              <Text
                style={[
                  styles.dateText,
                  selectedDayId === day.id && styles.selectedDateText,
                ]}
              >
                {formatDate(day.date)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        				{/* Search bar */}
				<View style={styles.searchContainer}>
					<TextInput
						style={styles.searchInput}
						placeholder="Rechercher un artiste ou une scène..."
						placeholderTextColor="#999"
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
					{searchQuery.length > 0 ? (
						<TouchableOpacity 
							style={styles.clearButton}
							onPress={() => setSearchQuery("")}
						>
							<Feather name="x" size={18} color="#999" />
						</TouchableOpacity>
					) : (
						<TouchableOpacity style={styles.searchIcon}>
							<Feather name="search" size={20} color="#999" />
						</TouchableOpacity>
					)}
				</View>

        				{/* Programmes list */}
				{filteredProgrammes.length > 0 ? (
					<FlatList
						data={filteredProgrammes}
						renderItem={renderProgrammeItem}
						keyExtractor={(item) => item.id.toString()}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.listContainer}
					/>
				) : searchQuery.trim() ? (
					<View style={styles.noResultsContainer}>
						<Feather name="search" size={48} color="#ccc" />
						<Text style={styles.noResultsTitle}>Aucun résultat trouvé</Text>
						<Text style={styles.noResultsText}>
							Aucun artiste ou scène ne correspond à "{searchQuery}"
						</Text>
					</View>
				) : (
					<FlatList
						data={filteredProgrammes}
						renderItem={renderProgrammeItem}
						keyExtractor={(item) => item.id.toString()}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.listContainer}
					/>
				)}
      </View>
    </GestureHandlerRootView>
  );
};

export default ProgrammationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topbar: {
    backgroundColor: colors.secondary,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0", // Gray border for visual separation
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  calendarButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary, // Orange color
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  datesContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
  },
  dateButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  selectedDateButton: {
    backgroundColor: "white",
    borderBottomWidth: 2,
    borderBottomColor: colors.ternary, // Pink bottom border
  },
  dateText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.quinary, // Black text
  },
  selectedDateText: {
    color: colors.quinary, // Black text for selected state
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.quinary,
  },
  	searchIcon: {
		padding: 4,
	},
	clearButton: {
		padding: 4,
	},
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  programmeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  posterContainer: {
    marginRight: 16,
  },
  poster: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  infoContainer: {
    flex: 1,
  },
  artistName: {
    fontFamily: fonts.subtitle,
    fontSize: 18,
    fontWeight: "bold",
    color: colors.quinary,
    marginBottom: 4,
  },
  timeText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.primary,
    marginBottom: 2,
  },
  stageName: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: "#666",
  },
  favoriteButton: {
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 16,
    padding: 2,
  },
  	favoriteButtonActive: {
		backgroundColor: "rgba(0,0,0,0.15)",
	},
	noResultsContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 32,
		marginTop: 60,
	},
	noResultsTitle: {
		fontFamily: fonts.subtitle,
		fontSize: 20,
		fontWeight: "bold",
		color: colors.quinary,
		marginTop: 16,
		marginBottom: 8,
		textAlign: "center",
	},
	noResultsText: {
		fontFamily: fonts.body,
		fontSize: 16,
		color: "#666",
		textAlign: "center",
		lineHeight: 22,
	},

});
