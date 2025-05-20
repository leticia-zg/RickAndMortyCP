import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  Animated,
  Easing,
} from "react-native";
import axios from "axios";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import ConfettiCannon from "react-native-confetti-cannon";

const { height } = Dimensions.get("window");

const AnimatedTitle = React.memo(() => {
  const [animatedTitle, setAnimatedTitle] = useState("");
  const titleText = "Conheça o elenco mais instável do multiverso";
  const titleIndexRef = useRef(0);
  const animationStartedRef = useRef(false);

  useEffect(() => {
    if (animationStartedRef.current) return;
    animationStartedRef.current = true;

    const typeNextChar = () => {
      const currentIndex = titleIndexRef.current;
      if (currentIndex < titleText.length) {
        setAnimatedTitle((prev) => prev + titleText[currentIndex]);
        titleIndexRef.current += 1;
        setTimeout(typeNextChar, 80);
      }
    };

    typeNextChar();
  }, []);

  return <Text style={styles.title}>{animatedTitle}</Text>;
});

const CharacterItem = React.memo(({ item, isFavorito, onFavoritoToggle, onShowConfetti }) => {
  const scale = useRef(new Animated.Value(0.8)).current;
  const starButtonRef = useRef(null);

  React.useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleFavoritoPress = () => {
    onFavoritoToggle(item);

    if (!isFavorito && starButtonRef.current) {
      starButtonRef.current.measure((fx, fy, width, height, px, py) => {
        onShowConfetti({ x: px + width / 2, y: py + height / 2 });
      });
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        <View style={styles.info}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{item.name}</Text>
            <TouchableOpacity
              ref={starButtonRef}
              onPress={handleFavoritoPress}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <IconFavorito isFavorito={isFavorito} />
            </TouchableOpacity>
          </View>
          <Text style={styles.statusLabel}>
            Status:{" "}
            <Text
              style={{
                color: item.status === "Alive" ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {item.status}
            </Text>
          </Text>
          <Text style={styles.especieLabel}>Espécie: {item.species}</Text>
        </View>
      </View>
    </Animated.View>
  );
});

const IconFavorito = ({ isFavorito }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isFavorito) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFavorito]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Icon
        name={isFavorito ? "star" : "star-o"}
        size={20}
        color={isFavorito ? "yellow" : "black"}
      />
    </Animated.View>
  );
};

export default function App() {
  const [characters, setCharacters] = useState([]);
  const [charactersFavoritos, setCharactersFavoritos] = useState([]);
  const [page, setPage] = useState(1);
  const [inputPage, setInputPage] = useState("");
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Estados para confete
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiOrigin, setConfettiOrigin] = useState({ x: 0, y: 0 });

  const fetchCharacters = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://rickandmortyapi.com/api/character/?page=${pageNumber}`
      );
      setCharacters(response.data.results);
      setInfo(response.data.info);
      setPage(pageNumber);

      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Erro ao buscar personagens:", error);
    } finally {
      setLoading(false);
    }
  };

  const carregarFavoritos = async () => {
    const favoritosSalvos = await AsyncStorage.getItem("charactersFavoritos");
    if (favoritosSalvos) {
      setCharactersFavoritos(JSON.parse(favoritosSalvos));
    }
  };

  const initPage = useCallback(() => {
    fetchCharacters();
    carregarFavoritos();
  }, []);

  useFocusEffect(initPage);

  const handleGoToPage = () => {
    const pageNumber = parseInt(inputPage);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= info.pages) {
      fetchCharacters(pageNumber);
      Keyboard.dismiss();
    } else {
      alert("Página inválida");
    }
  };

  const setarFavorito = async (item) => {
    const favoritosAtualizados = [...charactersFavoritos];
    const index = favoritosAtualizados.findIndex((fav) => fav.id === item.id);

    if (index !== -1) {
      favoritosAtualizados.splice(index, 1);
    } else {
      favoritosAtualizados.push(item);
    }

    setCharactersFavoritos(favoritosAtualizados);
    await AsyncStorage.setItem(
      "charactersFavoritos",
      JSON.stringify(favoritosAtualizados)
    );
  };

  const handleShowConfetti = (origin) => {
    // Origem X igual à estrela clicada, Y fixo no topo (0) para confete cair da parte de cima da tela
    setConfettiOrigin({ x: origin.x, y: 0 });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const renderItem = ({ item }) => {
    const isFavorito = charactersFavoritos.some((fav) => fav.id === item.id);
    return (
      <CharacterItem
        item={item}
        isFavorito={isFavorito}
        onFavoritoToggle={setarFavorito}
        onShowConfetti={handleShowConfetti}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AnimatedTitle />
      <Text style={styles.subscription}>
        De cientistas bêbados a criaturas de gelatina — um mais estranho que o outro.
      </Text>
      {loading ? (
        <View style={styles.loaderContainer}>
          <LottieView
            source={require("../../assets/morty-loader.json")}
            autoPlay
            loop
            style={styles.loader}
          />
          <Text style={styles.loadingText}>Carregando personagens...</Text>
        </View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <FlatList
            data={characters}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            style={{ padding: 10 }}
          />
        </Animated.View>
      )}

      {/* Confete sobre a tela toda */}
      {showConfetti && (
        <ConfettiCannon
          count={50}
          origin={confettiOrigin}
          fadeOut={true}
          fallSpeed={3000}    // queda mais lenta para cair até o fim da tela
          explosionSpeed={350}
        />
      )}

      <View style={styles.pagination}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Nº da página"
            placeholderTextColor="#aaa"
            keyboardType="number-pad"
            value={inputPage}
            onChangeText={setInputPage}
          />
          <TouchableOpacity onPress={handleGoToPage} style={styles.arrowButton}>
            <Image
              source={require("../../assets/arrow-right.png")}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.pageText}>
          Página atual: {page} de {info.pages || "..."}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A18",
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
    marginTop: 10,
  },
  subscription: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
    margin: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    width: 200,
    height: 200,
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
  },
  card: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#2C2F3A",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#6B2CEE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  avatar: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#5CF1FF",
    marginBottom: 5,
  },
  statusLabel: {
    color: "#fff",
  },
  especieLabel: {
    color: "#fff",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "#0A0A18",
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#1E1E2E",
    borderRadius: 8,
    overflow: "hidden",
    width: 200,
  },
  input: {
    flex: 1,
    padding: 10,
    color: "#fff",
  },
  arrowButton: {
    padding: 10,
    backgroundColor: "#5CF1FF",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: "#000",
  },
  pageText: {
    color: "#aaa",
    textAlign: "center",
  },
});