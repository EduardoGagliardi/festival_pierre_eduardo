import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { colors, fonts } from "../../constants/design_constants";
import { dbUrl } from "../../constants/api_constans";

type Stage = {
  id: number;
  name: string;
  slug: string;
  stage_typeId: number;
  poster: string;
  description: string[];
};

type StageType = {
  id: number;
  slug: string;
  name: string;
};

type StageGroup = {
  stageType: StageType;
  stages: Stage[];
};

const StagesScreen = (): React.JSX.Element => {
	const router = useRouter();
	const [stageGroups, setStageGroups] = useState<StageGroup[]>([]);
	const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStagesAndTypes = async () => {
      try {
        // Fetch stages and stage types in parallel
        const [stagesRes, stageTypesRes] = await Promise.all([
          fetch(`${dbUrl}/stages`),
          fetch(`${dbUrl}/stage_types`),
        ]);
        
        const [stagesData, stageTypesData] = await Promise.all([
          stagesRes.json(),
          stageTypesRes.json(),
        ]);

        // Convert string IDs to numbers
        const stages = stagesData.map((stage: any) => ({
          ...stage,
          id: Number(stage.id),
          stage_typeId: Number(stage.stage_typeId),
        }));

        const stageTypes = stageTypesData.map((type: any) => ({
          ...type,
          id: Number(type.id),
        }));

        // Group stages by stage type
        const grouped = stageTypes.map((stageType: StageType) => ({
          stageType,
          stages: stages.filter((stage: Stage) => stage.stage_typeId === stageType.id),
        })).filter((group: StageGroup) => group.stages.length > 0);

        setStageGroups(grouped);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stages:", error);
        setLoading(false);
      }
    };

    fetchStagesAndTypes();
  }, []);

  const handleStagePress = (stageName: string) => {
    // Navigate back to programmation screen with the stage name
    router.push({
      pathname: "/(tabs)/programmation",
      params: { searchQuery: stageName }
    });
  };



  const renderStageGroup = ({ item }: { item: StageGroup }) => (
    <View style={styles.stageGroup}>
      <Text style={styles.stageTypeTitle}>{item.stageType.name}</Text>
      <View style={styles.listContainer}>
        {item.stages.map((stage, index) => (
          <TouchableOpacity
            key={stage.id}
            style={[
              styles.listItem,
              index === item.stages.length - 1 && styles.lastItem
            ]}
            activeOpacity={0.7}
            onPress={() => handleStagePress(stage.name)}
          >
            <Text 
              style={styles.listItemText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {stage.name}
            </Text>
            <Feather name="chevron-right" style={styles.chevron} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement des scènes...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color={colors.quinary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sélectionner une scène</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <FlatList
          data={stageGroups}
          renderItem={renderStageGroup}
          keyExtractor={(group) => group.stageType.id.toString()}
          scrollEnabled={false}
        />
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default StagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.quinary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontFamily: fonts.subtitle,
    fontSize: 20,
    fontWeight: "bold",
    color: colors.quinary,
  },
  content: {
    flex: 1,
    backgroundColor: "#e5e5e5",
  },
  stageGroup: {
    backgroundColor: "#e5e5e5",
    paddingVertical: 18,
    paddingHorizontal: 0,
    marginBottom: 10,
  },
  stageTypeTitle: {
    fontFamily: fonts.heading,
    fontSize: 22,
    fontWeight: "bold",
    color: colors.quinary,
    marginBottom: 10,
    marginLeft: 18,
  },
  listContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  listItemText: {
    fontFamily: fonts.heading,
    fontSize: 17,
    color: "#111",
    flex: 1,
    numberOfLines: 1,
    ellipsizeMode: "tail",
    paddingRight: 40,
  },
  chevron: {
    color: "#222",
    fontSize: 22,
    marginLeft: 8,
    width: 30,
    textAlign: "center",
  },
}); 