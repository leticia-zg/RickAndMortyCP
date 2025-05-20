import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoritosScreen() {
  const [favoritos, setFavoritos] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const carregarFavoritos = async () => {
        const stored = await AsyncStorage.getItem("charactersFavoritos");
        if (stored) {
          setFavoritos(JSON.parse(stored));
        } else {
          setFavoritos([]);
        }
      };

      carregarFavoritos();
    }, [])
  );

  const removerFavorito = async (id) => {
    const atualizados = favoritos.filter((char) => char.id !== id);
    setFavoritos(atualizados);
    await AsyncStorage.setItem("charactersFavoritos", JSON.stringify(atualizados));
  };

  const AnimatedCard = ({ item, onRemove }) => {
    const slideAnim = useRef(new Animated.Value(50)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, [slideAnim, opacityAnim]);

    return (
      <Animated.View
        style={[
          styles.card,
          {
            opacity: opacityAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Image source={{ uri: item.image }} style={styles.avatar} />
        <View style={styles.info}>
          <View style={styles.topRow}>
            <Text style={styles.name}>{item.name}</Text>
            <TouchableOpacity onPress={() => onRemove(item.id)}>
              <Icon
                name="trash"
                size={20}
                color="#FF2D75"
                style={{
                  marginLeft: 10,
                  textShadowColor: "#FF2D75",
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 6,
                }}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.textoPadrao}>
            Status:{" "}
            <Text style={{ color: item.status === "Alive" ? "#A7F432" : "#FF2D75" }}>
              {item.status}
            </Text>
          </Text>
          <Text style={styles.textoPadrao}>Espécie: {item.species}</Text>
        </View>
      </Animated.View>
    );
  };

  const renderItem = ({ item }) => <AnimatedCard item={item} onRemove={removerFavorito} />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Personagens Favoritos ⭐</Text>
      {favoritos.length > 0 ? (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.emptyText}>Ainda não favoritou ninguém? Hora de escolher seus personagens preferidos de Rick and Morty!</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A18",
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#5CF1FF",
    textAlign: "center",
    paddingHorizontal: 16,
    textShadowColor: "#00B5CC",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 1,
    marginBottom: 10,
  },
  subscription: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
    margin: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#14213D",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#6B2CEE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 6,
    color: "#FFDE00",
  },
  textoPadrao: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#FFFF",
    fontSize: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
});
