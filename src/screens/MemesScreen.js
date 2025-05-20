import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Share,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;
const memeWidth = (screenWidth - 36) / 2;

const memes = [
  {
    id: "1",
    image: "https://super.abril.com.br/wp-content/uploads/2018/07/wubba.jpg?quality=70&w=720&crop=1",
    caption: "Quando o Rick solta um 'Wubba Lubba Dub Dub!'",
  },
  {
    id: "2",
    image: "https://i0.wp.com/imagens.formigaeletrica.com.br/2017/10/rick-and-morty-1.jpg?resize=720%2C400",
    caption: "Tentando explicar as coisas pro Morty...",
  },
  {
    id: "3",
    image: "https://i.redd.it/why-was-churry-effectively-immortal-but-pickle-rick-so-v0-z1tt4nhofv0f1.jpg?width=1800&format=pjpg&auto=webp&s=449883567191d86d2ee3e8eb120543f168d980ce",
    caption: "Pickle Rick, porque tudo que é estranho é melhor!",
  },
  {
    id: "4",
    image: "https://preview.redd.it/segj9itqwmr81.png?auto=webp&s=9c979a4581ce72b579a34fb0037193700fa1f97c",
    caption: "Morty sempre sendo o alívio cômico, mas a gente ama.",
  },
  {
    id: "5",
    image: "https://www.planocritico.com/wp-content/uploads/2021/08/rick-and-morty-2-plano-critico.jpg",
    caption: "Quando alguém tenta entender os planos do Rick.",
  },
  {
    id: "6",
    image: "https://preview.redd.it/the-whirly-dirly-conspiracy-is-probably-the-closest-well-v0-wdkgo9ffphva1.jpg?width=640&crop=smart&auto=webp&s=36caefb97230f88153e9e005c32769f4592b2502",
    caption: "Quando o Jerry tenta ajudar e só piora tudo.",
  },
  {
    id: "7",
    image: "https://wallpapers.com/images/hd/morty-smith-teary-eyed-filled-with-bruises-avjcu6ctbjksx1zv.jpg",
    caption: "Eu tentando lidar com problemas da vida real.",
  },
  {
    id: "8",
    image: "https://static1.srcdn.com/wordpress/wp-content/uploads/2023/11/morty-is-mad-at-rick-while-in-the-lair.jpg",
    caption: "Quando o Rick fala algo que só ele entende.",
  },
  {
    id: "9",
    image: "https://preview.redd.it/what-would-be-your-perfect-rick-and-morty-series-finale-v0-vmi8wm0p5fhd1.jpeg?width=640&crop=smart&auto=webp&s=e4e3a8a05372a2cce72aa8c6ae65e26cac30861c",
    caption: "Eu depois de ver 3 episódios seguidos.",
  },
  {
    id: "10",
    image: "https://cdn.ome.lt/uB7JqbIlX2G5cvnDaooEut0uFf8=/570x0/smart/uploads/conteudo/fotos/rick_and_morty_4_temporada_episodio_6b.jpg",
    caption: "Morty tentando fugir das enrascadas do Rick.",
  },
  {
    id: "11",
    image: "https://uploads.jovemnerd.com.br/wp-content/uploads/2023/11/rick_and_morty_guia_episodios__f89025526.jpg",
    caption: "Quando o Rick tem um plano genial (ou não).",
  },
  {
    id: "12",
    image: "https://observatoriodocinema.com.br/wp-content/plugins/seox-image-magick/imagick_convert.php?width=904&height=508&format=.jpg&quality=91&imagick=uploads-observatoriodocinema.seox.com.br/2025/04/space-beth-and-beth-smile-at-each-other-in-the-snow-from-rick-and-morty-season-6-1024x512.jpg",
    caption: "Esse é o verdadeiro herói da série: a Beth.",
  },
  {
    id: "13",
    image: "https://multiversonoticias.com.br/wp-content/uploads/2022/12/rick-e-morty-1.jpg",
    caption: "Eu quando tento entender física quântica.",
  },
  {
    id: "14",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFbzodlQWteJ9AVA_KKayNZwXP7Dozlf5I4w&s",
    caption: "Quando a dimensão paralela é ainda mais doida.",
  },
  {
    id: "15",
    image: "https://static.wikia.nocookie.net/rickandmorty/images/6/6a/Rick_Jerry.jpg/revision/latest?cb=20240422121804",
    caption: "Jerry perdendo a paciência com tudo e todos.",
  },
  {
    id: "26",
    image: "https://i.ytimg.com/vi/X7bGoush4fE/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC8d2cMPFT-Uz8fMTNDGhCM1lf7tw",
    caption: "Quando você só quer paz, mas o Rick chama pra aventura.",
  },
];

export default function MemesScreen() {
  const [likedMemes, setLikedMemes] = useState({});

  const toggleLike = (id) => {
    setLikedMemes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const shareMeme = async (caption, image) => {
    try {
      await Share.share({
        message: `${caption}\n${image}`,
      });
    } catch (error) {
      alert("Erro ao compartilhar meme");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.memeImage} />
      <Text style={styles.caption}>{item.caption}</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => toggleLike(item.id)}>
          <FontAwesome
            name="thumbs-up"
            size={20}
            color={likedMemes[item.id] ? "#FFD700" : "#00CFFF"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => shareMeme(item.caption, item.image)}
        >
          <FontAwesome name="share" size={20} color="#00CFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Memes Rick and Morty</Text>
      <Text style={styles.subscription}>Uma dose de caos, aventuras interdimensionais e muitas risadas direto do universo de Rick and Morty!</Text>
      <FlatList
        data={memes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
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
  card: {
    backgroundColor: "#2C2F3A",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#6B2CEE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    marginBottom: 20,
    padding: 10,
    width: memeWidth,
    margin: 10,
  },
  memeImage: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginBottom: 8,
  },
  caption: {
    color: "#E0E0E0",
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  iconButton: {
    padding: 6,
  },
});
