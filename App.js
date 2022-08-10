import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import AnimatedColorView from "react-native-animated-colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "0c2ee5987784056747197baf1e9e7376";

const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Atmosphere: "cloudy-gusts",
  Rain: "rains",
  Drizzle: "rain",
  Snow: "snow",
  Thunderstorm: "lightning",
};
const mainKr = {
  Clear: "맑음",
  Clouds: "흐림",
  Atmosphere: "Atmosphere",
  Rain: "비",
  Drizzle: "이슬비",
  Snow: "눈",
  Thunderstorm: "뇌우",
};
const mainColor = {
  Clear: 0,
  Clouds: 1,
  Atmosphere: 2,
  Rain: 3,
  Drizzle: 4,
  Snow: 5,
  Thunderstorm: 6,
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const [scrollIndex, setScrollIndex] = useState(0);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric&lang=kr`
    );
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, []);

  const getDt = (t) => {
    const date = new Date(t * 1000);
    let day = "";
    switch (date.getDay()) {
      case 0:
        day = "일";
        break;
      case 1:
        day = "월";
        break;
      case 2:
        day = "화";
        break;
      case 3:
        day = "수";
        break;
      case 4:
        day = "목";
        break;
      case 5:
        day = "금";
        break;
      case 6:
        day = "토";
        break;
    }
    return `${date.getMonth() + 1}월 ${date.getDate()}일 ${day}`;
  };

  return (
    <AnimatedColorView
      style={styles.container}
      activeIndex={
        days.length === 0
          ? 0
          : mainColor[`${days[scrollIndex].weather[0].main}`]
      }
      colors={[
        "#3AB4F2",
        "#697A8C",
        "#697A8C",
        "#4A6583",
        "#5F82A2",
        "#B2DDFF",
        "#0E1E31",
      ]}
      duration={700}
      loop={false}
    >
      {ok ? (
        <>
          <View style={styles.city}>
            <Text style={styles.cityName}>{city}</Text>
          </View>
          <View style={styles.weather}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                setScrollIndex(
                  parseInt(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 40))
                );
              }}
            >
              {days.length === 0 ? (
                <View style={{ ...styles.day, alignItems: "center" }}>
                  <ActivityIndicator
                    style={{ marginTop: 10 }}
                    color="white"
                    size="large"
                  />
                </View>
              ) : (
                days.map((day, index) => (
                  <View key={index} style={styles.day}>
                    <Text style={styles.dtText}>{getDt(day.dt)}</Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.temp}>
                        {parseFloat(day.temp.day).toFixed(0)}°
                      </Text>
                      <Fontisto
                        name={icons[day.weather[0].main]}
                        style={{ marginLeft: 20 }}
                        size={68}
                        color="white"
                      />
                    </View>
                    <Text style={styles.description}>
                      {mainKr[day.weather[0].main]}
                    </Text>
                    {mainKr[day.weather[0].main] !==
                      day.weather[0].description && (
                      <Text style={styles.tinyText}>
                        {day.weather[0].description}
                      </Text>
                    )}
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </>
      ) : (
        <Text style={styles.tinyText}>위치 정보 동의 해줘</Text>
      )}
    </AnimatedColorView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
    color: "white",
  },
  weather: { flex: 1 },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  dtText: {
    fontSize: 20,
    color: "white",
  },
  temp: {
    fontSize: 100,
    color: "white",
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: "white",
    fontWeight: "500",
  },
  tinyText: {
    fontSize: 25,
    color: "white",
    fontWeight: "500",
  },
});
