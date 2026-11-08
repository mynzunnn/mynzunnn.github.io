// GET /api/guestbook-list
// 방명록 전체 목록을 최신순으로 조회한다.
//
// 조회 건수 제한(기본 1000행) 때문에 글이 누락되지 않도록, range()로 페이지를 끝까지 넘겨
// 모든 행을 모은다. (집계/전체 조회 시 limit 누락 방지)

const { getAdminClient, json } = require("./_shared");

const PAGE_SIZE = 1000; // 한 번에 가져오는 행 수

exports.handler = async function (event) {
  if (event.httpMethod !== "GET") {
    return json(405, { error: "method_not_allowed" });
  }

  let supabase;
  try {
    supabase = getAdminClient();
  } catch (e) {
    return json(500, { error: "server_not_configured" });
  }

  try {
    const all = [];
    let from = 0;
    // 끝까지 반복해서 전부 수집
    for (;;) {
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await supabase
        .from("guestbook")
        .select("id,author_name,destination,message,created_at")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("guestbook list error:", error.message, error.code, error.details, error.hint);
        return json(500, { error: "query_failed", code: error.code || null });
      }
      if (!data || data.length === 0) break;
      all.push(...data);
      if (data.length < PAGE_SIZE) break; // 마지막 페이지
      from += PAGE_SIZE;
    }

    return json(200, { entries: all, count: all.length });
  } catch (e) {
    return json(500, { error: "unexpected" });
  }
};
