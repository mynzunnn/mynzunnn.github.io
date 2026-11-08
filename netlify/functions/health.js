// Netlify 서버리스 함수 (구조용 예시)
//
// 이 프로젝트의 방명록은 브라우저에서 Supabase anon(public) key로 직접 호출한다.
// 따라서 서버 함수가 필수는 아니다. 이 함수는 Netlify Functions 폴더 구조를 갖추고
// 함수 엔드포인트가 동작하는지 확인하기 위한 최소 헬스체크다.
//
// 주의:
// - 이 파일에는 어떤 비밀 키도 하드코딩하지 않는다.
// - service_role 등 서버 전용 비밀이 필요해지면 Netlify 환경변수(process.env)로만 읽는다.
// - 이 netlify/ 폴더는 .netlifyignore 로 공개 정적 출력에서 제외된다.

exports.handler = async () => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "ok",
      service: "guestbook-site",
      time: new Date().toISOString(),
    }),
  };
};
