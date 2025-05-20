import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Alert,
  Dimensions,
} from "react-native";
import axios from "axios";

const questions = [
  {
    question: "Qual é o nome completo do Rick?",
    options: ["Rick Sanchez", "Rick Johnson", "Rick Smith", "Rick Jones"],
    answer: "Rick Sanchez",
  },
  {
    question: "Quem é o melhor amigo do Morty?",
    options: ["Summer", "Rick", "Jessica", "Birdperson"],
    answer: "Rick",
  },
  {
    question: "Qual planeta Rick odeia?",
    options: ["Terra", "Gazorpazorp", "Plutão", "Froopyland"],
    answer: "Gazorpazorp",
  },
  {
    question: "Qual é a profissão do Jerry?",
    options: ["Publicitário", "Cientista", "Mecânico", "Desempregado"],
    answer: "Publicitário",
  },
  {
    question: "Quem é a filha do Rick?",
    options: ["Summer", "Beth", "Tammy", "Unity"],
    answer: "Beth",
  },
  {
    question: "Qual é o nome da nave do Rick?",
    options: ["Rickmobile", "Space Cruiser", "Mortymóvel", "RickShip"],
    answer: "Space Cruiser",
  },
  {
    question: "O que Rick costuma beber?",
    options: ["Cerveja", "Vodka", "Vinho", "Uísque"],
    answer: "Uísque",
  },
  {
    question: "Quem é Birdperson?",
    options: ["Inimigo do Rick", "Amigo do Rick", "Tio do Morty", "Clone da Beth"],
    answer: "Amigo do Rick",
  },
  {
    question: "Quem traiu Rick no casamento?",
    options: ["Beth", "Tammy", "Summer", "Unity"],
    answer: "Tammy",
  },
  {
    question: "Qual é o universo original do Rick e Morty?",
    options: ["C-137", "J-19-Zeta-7", "C-500", "D-99"],
    answer: "C-137",
  },
];

export default function RickAndMortyQuiz() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    axios
      .get("https://rickandmortyapi.com/api/character?page=1")
      .then((res) => setCharacters(res.data.results.slice(0, 6)))
      .catch((err) => console.error(err));
  }, []);

  const startGame = (character) => {
    setSelectedCharacter(character);
  };

  const handleAnswer = (option) => {
    if (option === questions[currentQuestion].answer) {
      setScore((prev) => prev + 10);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const resetGame = () => {
    setSelectedCharacter(null);
    setCurrentQuestion(0);
    setScore(0);
    setIsFinished(false);
  };

  if (!selectedCharacter) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Escolha seu personagem:</Text>
        <FlatList
          data={characters}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => startGame(item)} style={styles.charCard}>
              <Image source={{ uri: item.image }} style={styles.charImage} />
              <Text style={styles.charName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  if (isFinished) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Pontuação Final:</Text>
        <Text style={styles.score}>{score} pontos</Text>
        <TouchableOpacity onPress={resetGame} style={styles.resetButton}>
          <Text style={styles.resetText}>Jogar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const current = questions[currentQuestion];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pergunta {currentQuestion + 1}/10</Text>
      <Text style={styles.question}>{current.question}</Text>
      {current.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleAnswer(option)}
          style={styles.optionButton}
          activeOpacity={0.7}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0A0A18",
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#5CF1FF",
    marginBottom: 20,
    textAlign: "center",
  },
  question: {
    fontSize: 20,
    color: "white",
    marginVertical: 20,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  optionButton: {
    backgroundColor: "#1F1F3A",
    padding: 14,
    borderRadius: 8,
    marginVertical: 8,
    width: "100%",
    borderWidth: 1,
    borderColor: "#5CF1FF",
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  charCard: {
    width: (width - 64) / 2,
    alignItems: "center",
    margin: 8,
    backgroundColor: "#1F1F3A",
    borderRadius: 10,
    padding: 10,
    elevation: 4,
  },
  charImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  charName: {
    color: "#fff",
    marginTop: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  score: {
    fontSize: 32,
    color: "#5CF1FF",
    marginVertical: 20,
  },
  resetButton: {
    backgroundColor: "#5CF1FF",
    padding: 14,
    borderRadius: 8,
    paddingHorizontal: 24,
  },
  resetText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
