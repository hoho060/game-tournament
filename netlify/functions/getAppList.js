const axios = require("axios");

exports.handler = async function(event, context) {
  try {
			const page = event.queryStringParameters.page || 1; // 페이지 번호
			const limit = 100; //한 번에 가져올 앱 수 (최대 100개로 설정)
    const response = await axios.get(
      "https://api.steampowered.com/ISteamApps/GetAppList/v2/"
    );

			const apps = response.data.applist.apps;
			
			// 응답 데이터에서 필요한 범위만 필터링 (페이지와 limit을 고려)
			const paginatedApps = apps.slice((page - 1) * limit, page * limit);

    // CORS 헤더 추가: 모든 도메인에서 접근 가능하도록 설정
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',  // 모든 도메인에서 API 접근 허용
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',  // 허용할 HTTP 메서드
        'Access-Control-Allow-Headers': 'Content-Type',  // 허용할 헤더 설정
      },
      body: JSON.stringify({
						apps: paginatedApps, 
						total: apps.length,
						page,
						limit,
					}),  // 응답 본문에 Steam App List 데이터를 반환
    };
  } catch (error) {
    console.error("Error fetching app list:", error.message);
    return {
      statusCode: 500,
      body: "Error fetching app list from Steam",
    };
  }
};

