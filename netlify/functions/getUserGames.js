const axios = require("axios");

const STEAM_API_KEY = "C25F968E9DCFA3C75952CBBFD1B15911"; // 본인의 Steam API 키로 대체하세요

exports.handler = async (event, context) => {
  const steamid = event.queryStringParameters.steamid; // 서버리스 함수에서는 URL 파라미터를 이렇게 가져옵니다
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamid}&format=json;`;

  try {
    const response = await axios.get(url);
    const games = response.data.response?.games || [];

    if (games.length === 0) {
      return {
        statusCode: 404,
        body: "해당 Steam ID에 등록된 게임이 없습니다.",
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(games),
    };
  } catch (error) {
    console.error("Error fetching games:", error);
    return {
      statusCode: 500,
      body: "Error fetching games from Steam",
    };
  }
};
