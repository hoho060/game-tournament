const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
const cors = require("cors");
const PORT = 3000;

const STEAM_API_KEY = "C25F968E9DCFA3C75952CBBFD1B15911"; // 본인의 Steam API 키로 대체하세요

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// 기본 라우팅 처리
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // index.html 파일을 반환
});

// Steam 게임 목록 가져오기 (CORS 문제 해결을 위해 서버에서 호출)
app.get("/api/applist", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.steampowered.com/ISteamApps/GetAppList/v2/"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching app list:", error);
    res.status(500).send("Error fetching app list from Steam");
  }
});
// 게임 목록 가져오기 API 엔드포인트
app.get("/api/games/:steamid", async (req, res) => {
  const steamid = req.params.steamid;
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamid}&format=json;`;

  try {
    const response = await axios.get(url);
    const games = response.data.response?.games || [];

    if (games.length === 0) {
      return res.status(404).send("해당 Steam ID에 등록된 게임이 없습니다.");
    }
    res.json(games); // 사용자의 게임 목록을 JSON 형식으로 클라이언트에 전송
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).send("Error fetching games from Steam");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
