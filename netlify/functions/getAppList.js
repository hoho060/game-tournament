const axios = require("axios");

exports.handler = async function(event, context) {
  try {
    const response = await axios.get(
      "https://api.steampowered.com/ISteamApps/GetAppList/v2/"
    );
    // CORS 헤더 추가: 모든 도메인에서 접근 가능하도록 설정
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',  // 모든 도메인에서 API 접근 허용
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',  // 허용할 HTTP 메서드
        'Access-Control-Allow-Headers': 'Content-Type',  // 허용할 헤더 설정
      },
      body: JSON.stringify(response.data),  // 응답 본문에 Steam App List 데이터를 반환
    };
  } catch (error) {
    console.error("Error fetching app list:", error);
    return {
      statusCode: 500,
      body: "Error fetching app list from Steam",
    };
  }
};
