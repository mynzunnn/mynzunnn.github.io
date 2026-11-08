// (사용하지 않음) 구조 B 전환 안내
//
// 방명록은 이제 브라우저에서 Supabase 에 직접 붙지 않는다.
// 대신 같은 사이트의 서버 함수(/api/guestbook-list, /api/guestbook-create)를 호출한다.
// 따라서 이 파일은 index.html 에서 더 이상 로드되지 않으며, 여기에 키를 둘 필요가 없다.
//
// Supabase 접속 정보는 서버(Netlify 환경변수)에만 둔다:
//   - SUPABASE_URL
//   - SUPABASE_SERVICE_ROLE_KEY   (절대 브라우저/깃에 노출 금지)
//
// 이 파일은 참고용으로만 남겨 둔다.
window.SUPABASE_CONFIG = {
  url: "YOUR_SUPABASE_URL",
  anonKey: "YOUR_SUPABASE_ANON_KEY",
};
