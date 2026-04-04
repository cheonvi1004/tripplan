function Hero() {
  return (
    <div className="hero">
      <h1>나만의 <span>여행 코스</span>를<br />이미지로 만들어보세요</h1>
      <p>출발지, 경유지, 도착지를 입력하면<br />SNS 감성 코스 이미지가 자동으로 완성됩니다</p>
      <div className="pills">
        <span className="pill">✦ 드래그로 순서 변경</span>
        <span className="pill">✦ 6가지 컬러 테마</span>
        <span className="pill">✦ 카카오맵 연동</span>
        <span className="pill">✦ PNG 다운로드</span>
      </div>
    </div>
  );
}

export default Hero;
