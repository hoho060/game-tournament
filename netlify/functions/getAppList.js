const axios = require("axios");

exports.handler = async (event, context) => {
  try {
    const response = await axios.get(
      "https://api.steampowered.com/ISteamApps/GetAppList/v2/"
    );
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error("Error fetching app list:", error);
    return {
      statusCode: 500,
      body: "Error fetching app list from Steam",
    };
  }
};
