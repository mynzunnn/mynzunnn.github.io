// POST /api/guestbook-create
// 방명록 글 하나를 생성한다. 서버에서 입력을 검증한 뒤 저장하고, 저장된 행을 돌려준다.
//
// service_role 로 붙으므로 RLS 가 우회된다 → 검증은 전적으로 이 서버 함수의 책임이다.

const { getAdminClient, validateEntry, json } = require("./_shared");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "method_not_allowed" });
  }

  // 본문 파싱 (깨진 JSON 방어)
  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return json(400, { error: "invalid_json" });
  }

  // 서버 측 검증: 허용 필드만, 빈 값·길이 초과 거부
  const result = validateEntry(body);
  if (!result.ok) {
    return json(400, { error: "validation_failed", details: result.errors });
  }

  let supabase;
  try {
    supabase = getAdminClient();
  } catch (e) {
    return json(500, { error: "server_not_configured" });
  }

  try {
    const { data, error } = await supabase
      .from("guestbook")
      .insert(result.value) // 검증을 통과한 값만 저장
      .select("id,author_name,destination,message,created_at")
      .single();

    if (error) {
      return json(500, { error: "insert_failed" });
    }
    return json(201, { entry: data });
  } catch (e) {
    return json(500, { error: "unexpected" });
  }
};
