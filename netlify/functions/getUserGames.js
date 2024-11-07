const axios = require("axios");

const STEAM_API_KEY = "C25F968E9DCFA3C75952CBBFD1B15911"; // 본인의 Steam API 키로 대체하세요

exports.handler = async (event, context) => {
  const steamid = event.path.steamid('/')[3]; // 서버리스 함수에서는 URL 파라미터를 이렇게 가져옵니다
  console.log(`Request for Steam ID: ${steamid} // Steam ID 로그
  
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamid}&format=json;`;
  
  try {
    const response = await axios.get(url);
    console.log("Steam API Response:", response.data); // Steam API 응답 로그
    
    const games = response.data.response?.games || [];

    if (games.length === 0) {
      return {
        statusCode: 404,
        body: "해당 Steam ID에 등록된 게임이 없습니다.",
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',  // 모든 도메인에서 API 접근 허용
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',  // 허용할 HTTP 메서드
        'Access-Control-Allow-Headers': 'Content-Type',  // 허용할 헤더 설정
      },
      body: JSON.stringify(response.data.response.games),
    };
  } catch (error) {
    console.error("Error fetching games:", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: "게임 목록을 가져올 수 없습니다.", details: error.message }),
    };
  }
};
