import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useRef, useEffect, useState } from 'react';

const { width } = Dimensions.get('window');

const images = [
  require('../assets/images/worker1.png'),
  require('../assets/images/worker2.png'),
  require('../assets/images/worker3.png'),
];

export default function HomePage() {
  const router = useRouter();
  const flatListRef = useRef(null);
  const [index, setIndex] = useState(0);

  // Auto slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (index + 1) % images.length;
      setIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);

    return () => clearInterval(timer);
  }, [index]);

  return (
    <View style={styles.body}>
      {/* Background Image */}
      <Image
        source={require("../assets/images/Login-bg.jpg")}
        style={styles.Img}
        contentFit="cover"
      />
      <BlurView intensity={60} tint="light" style={styles.blur} />

      {/* Card */}
      <View style={styles.card}>
        {/* Auto Sliding Images */}
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          scrollEnabled={false}   // disable manual scroll
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, i) => i.toString()}
          renderItem={({ item }) => (
            <Image source={item} style={styles.image} contentFit="contain" />
          )}
        />

        {/* Dot Indicators */}
        <View style={styles.dotContainer}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === index ? styles.activeDot : null
              ]}
            />
          ))}
        </View>

        {/* Title */}
        <Text style={styles.title}>Create your profile and find</Text>
        <Text style={styles.title}>the best workers from home</Text>

        {/* Get Started Button */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

       
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#f1f5f9',
  },
  card: {
    width: '85%',
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  Img: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    zIndex: -3,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -2,
  },
  image: {
    width: width * 0.7,
    height: 200,
    marginBottom: 15,
    borderRadius: 15,
    alignSelf: "center",
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#bbb",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "red",
    width: 16,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    color: '#333',
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 25,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signInText: {
    fontSize: 14,
    color: '#555',
  },
  signInLink: {
    color: 'blue',
    fontWeight: '600',
  },
});
