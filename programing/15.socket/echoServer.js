import net from "net"; // TCP 연결을 위한 소켓 모듈

const PORT_NUMBER = 2022;
const HOST = "0.0.0.0";

// 새로운 TCP 서버 인스턴스 생성 : 메인 접수원
const server = net.createServer((socket) => {
  // 이 콜백 함수가 새로운 클라이언트가 연결될 때마다 실행됩니다.
  // socket 객체를 통해 해당 클라이언트와의 개별 통신을 처리합니다.
  console.log(
    "서버에 연결된 클라이언트 IP주소, PORT번호: ",
    socket.remoteAddress,
    socket.remotePort
  );

  // 새로운 소켓이 들어왔을 때 수행해야하는 일들을 정의한다
  // 데이터가 들어오면 이렇게 해!
  socket.on("data", (data) => {
    const message = data.toString();
    console.log("클라이언트 데이터: ", message);

    socket.write(message);
  });

  // 클라이언트가 연결을 끊으면 이렇게 해!
  socket.on("end", () => {
    console.log("클라이언트 연결 종료");
  });

  // 에러가 발생하면 이렇게 해!
  socket.on("error", (error) => {
    console.log("소켓 오류 발생: ", error.message);
  });
});

// TCP 서버에 IP주소와 PORT번호를 바인딩 한다.
// 이 IP와 PORT번호로 들어오는 요청을 받아들일 준비를 했다는 뜻
server.listen(PORT_NUMBER, HOST, () => {
  const address = server.address();

  console.log(`서버가 ${address.address} 에서 수신 대기 중`);
});

// TCP 서버에 에러가 발생하면 이렇게 해라!
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`포트 ${port}가 이미 사용 중입니다. 다른 포트를 시도하세요.`);
  } else {
    console.error("서버 오류 발생:", err.message);
  }
});
