let currentRound = []; //현재 라운드의 게임 리스트
let nextRound = []; // 다음 라운드의 승자 리스트



async function fetchGames() {
  
  const steamid = document.getElementById("steamidInput").value.trim();
  const apiUrl = `https://gameworldcup.netlify.app/.netlify/functions/getUserGames/${steamid}`  // 배포된 Netlify 환경

  if (!steamid) {
    alert("Steam ID를 입력하세요.");
    return;
  }

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("게임 목록을 가져올 수 없습니다.");
    const games = await response.json();
			console.log(`게임 목록:`, games);

			


    //플레이 시간이 0인 게임을 제외
    const filteredGames = games.filter((game) => game.playtime_forever > 0);
			
			
			
    renderGameList(filteredGames);
  } catch (error) {
    console.error("Error fetching games:", error);
			
    alert("게임 목록을 불러오는데 실패했습니다.");
  }
}

// Steam API에서 게임 목록을 가져오는 함수
async function fetchGameList() {
	 let nextPage = true; //  다음 페이지가 있는지 확인할 변수
  let page = 1; //페이지 번호
  
  // API URL을 동적으로 설정하는 함수
  const apiUrl = `https://gameworldcup.netlify.app/.netlify/functions/getAppList?limit=1&page=${page}` // 배포된 Netlify 서버
	 while (nextPage) {
			try {
				 

    	 const response = await fetch(apiUrl, {
						 method: 'GET',
						 headers: {
								 'Content-Type': 'application/json',
							}
						 
				 });

					

    	 if (!response.ok) {
      		 throw new Error(`HTTP error! Status: ${response.status}`);
   	  }

    	 const data = await response.json();
				 if (data.length === 1) {
					  page +=1; // 다음 페이지 번호로 이동
			  	} else {
				 		 nextPage = false;
				 }

      // 페이지가 더 있는지 확인
					const totalApps = data.total;
					const totalPages = Math.ceil(totalApps / 1);
					console.log(`현재 페이지: ${page}, 총 페이지 수: ${totalPages}`);

    
    	 return data.applist.apps;
  		} catch (error) {
   	 	 console.error("Error fetching app list:", error);
     	return [];
  		}
  }

  
}

async function renderGameList(games) {
  const gameList = document.getElementById("games");
  gameList.innerHTML = "";

  const appList = await fetchGameList();

  games.forEach((game) => {
    const app = appList.find((app) => app.appid === game.appid); // appid로 게임 찾기
    const gameName = app ? app.name : "게임 이름 없음"; // 게임 이름이 없으면 기본 메시지 표시

    // 게임 이름이 없으면 추가하지 않음
    if (gameName !== "게임 이름 없음") {
      const listItem = document.createElement("li");

      // 썸네일 이미지 생성
      const thumbnail = document.createElement("img");
      thumbnail.src = `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/capsule_184x69.jpg`;
      thumbnail.alt = gameName;
      thumbnail.style.width = "184px";
      thumbnail.style.height = "69px";
      thumbnail.style.marginRight = "10px";

      // 게임 이름 텍스트 추가
      const gameTitle = document.createElement("span");
      gameTitle.textContent = gameName;

      // 썸네일과 게임 이름을 리스트 아이템에 추가
      listItem.appendChild(thumbnail);
      listItem.appendChild(gameTitle);

      gameList.appendChild(listItem);
    }
  });

  document.getElementById("tournament").style.display = "block";
}
// 사용자가 Steam ID를 입력하면 게임 목록을 불러오는 이벤트 리스너 추가
document
  .getElementById("startTournamentBtn")
  .addEventListener("click", async () => {
    await fetchGames();
  });

// 버튼 클릭 시 토너먼트를 시작하는 기능
document.getElementById("start-tournament").addEventListener("click", () => {
  alert("토너먼트를 시작합니다!");
});

// 게임 목록에 게임 추가 기능
document.getElementById("add-game").addEventListener("click", () => {
  const gameName = document.getElementById("game-input").value.trim(); // 입력값을 가져옴

  if (!gameName) {
    alert("게임 이름을 입력하세요.");
  }

  // 입력값이 비어 있지 않으면
  const gameList = document.getElementById("games");
  const listItem = document.createElement("li");
  // 새로운 리스트 아이템 생성
  listItem.textContent = gameName; // 입력값을 리스트 아이템에 추가
  gameList.appendChild(listItem); // 게임 목록에 추가
});

let currentGame1 = "";
let currentGame2 = "";

//토너먼트 시작 기능
document.getElementById("start-tournament").addEventListener("click", () => {
  const gameList = document
    .getElementById("game-list")
    .getElementsByTagName("li");
  const games = Array.from(gameList).map((item) => item.textContent); //게임 목록 가져오기

  if (games.length < 2) {
    // 게임이 2개 이상 있어야 매치 가능
    alert("토너먼트를 시작하려면 게임을 두 개 이상 추가하세요.");
    return;
  }

  currentRound = [...games]; // 현재 라운드에 게임 리스트 저장
  nextRound = []; // 다음 라운드는 초기화

  // 첫 번째 매치업 시작
  startMatch();
});

// 첫 번째 매치업 시작 함수
function startMatch() {
  if (currentRound.length === 0) {
    alert("현재 라운드에 게임이 없습니다.");
    return;
  }
  // currentRound가 홀수 일 경우, 마지막 게임을 자동으로 다음 라운드로 넘김 (부전승 처리)
  if (currentRound.length % 2 !== 0) {
    const byeGame = currentRound.pop(); // 마지막 게임을 부전승으로 설정
    nextRound.push(byeGame);
  }

  // 랜덤으로 두 게임을 선택해서 매치업 생성
  currentGame1 = currentRound[Math.floor(Math.random() * currentRound.length)];
  let game2 = currentGame1;
  while (game2 === currentGame1) {
    game2 = currentRound[Math.floor(Math.random() * currentRound.length)];
  }
  currentGame2 = game2;

  //선택된 두 게임을 보여줌
  document.getElementById(
    "matchup"
  ).innerHTML = `<p>${currentGame1} VS ${currentGame2}<p>`;
  document.getElementById("winner-selection").style.display = "block"; // 승자 선택 버튼 보이기
}

// 승자 선택 기능
document.getElementById("select-winner-1").addEventListener("click", () => {
  alert(`${currentGame1}가 승리했습니다!`);
  nextRound.push(currentGame1); // 승자를 다음 라운드에 추가
  finishMatch(); // 매치 종료
});

document.getElementById("select-winner-2").addEventListener("click", () => {
  alert(`${currentGame2}가 승리했습니다!`);
  nextRound.push(currentGame2); // 승자를 다음 라운드에 추가
  finishMatch(); // 매치 종료
});

function finishMatch() {
  document.getElementById("winner-selection").style.display = "none"; //버튼 숨기기

  // 현재 매치의 두 게임을 제거
  currentRound = currentRound.filter(
    (game) => game !== currentGame1 && game !== currentGame2
  );

  // 모든 매치가 끝났다면 다음 라운드로 넘어감
  if (currentRound.length === 0) {
    currentRound = [...nextRound]; // 다음 라운드를 현재 라운드로 설정
    nextRound = []; // 다음 라운드 초기화
  }

  // 다음 매치 시작 또는 토너먼트 종료 확인
  if (currentRound.length > 1) {
    startMatch();
  } else {
    alert("토너먼트가 끝났습니다! 우승자는: " + currentRound[0]);
  }
}

