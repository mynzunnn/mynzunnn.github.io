// 서버 측 공용 유틸: Supabase 관리 클라이언트 + 입력 검증
//
// 중요: 이 모듈은 service_role 키로 Supabase에 붙는다. service_role 은 RLS 를 우회하므로
// 모든 검사(필수값, 길이, 타입)를 여기(서버)에서 책임진다. 이 키는 Netlify 환경변수에만 둔다.

const { createClient } = require("@supabase/supabase-js");

// 입력 길이 한도 (DB check 제약과 동일하게 유지)
const LIMITS = {
  author_name: { min: 1, max: 40 },
  destination: { min: 1, max: 60 },
  message: { min: 1, max: 200 },
};

// 허용된 필드만 통과시키고, 아닌 값은 거른다.
const ALLOWED_FIELDS = ["author_name", "destination", "message"];

function getAdminClient() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("server_not_configured");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// 들어온 payload 를 서버에서 검증. { ok, value|errors } 반환.
function validateEntry(body) {
  const errors = [];
  const value = {};

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, errors: ["요청 본문이 올바르지 않습니다."] };
  }

  // 허용되지 않은 키가 섞여 있으면 조용히 무시하고, 허용 필드만 취한다.
  for (const field of ALLOWED_FIELDS) {
    let v = body[field];
    if (typeof v !== "string") {
      errors.push(`${field}: 문자열이어야 합니다.`);
      continue;
    }
    v = v.trim();
    const { min, max } = LIMITS[field];
    if (v.length < min) {
      errors.push(`${field}: 비어 있을 수 없습니다.`);
    } else if (v.length > max) {
      errors.push(`${field}: ${max}자를 넘을 수 없습니다.`);
    } else {
      value[field] = v;
    }
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value };
}

function json(statusCode, obj) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(obj),
  };
}

module.exports = { getAdminClient, validateEntry, json, LIMITS };
