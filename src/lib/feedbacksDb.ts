import { getStoriesSql, skipDatabaseRuntimeSchemaDdl } from "./waterStoriesDb";
import type { Feedback } from "@/types/feedback";
import type postgres from "postgres";
import fs from "fs";
import path from "path";

let feedbacksSchemaPromise: Promise<void> | null = null;

function ensureFeedbacksSchema(sql: ReturnType<typeof postgres>) {
  if (!feedbacksSchemaPromise) {
    if (skipDatabaseRuntimeSchemaDdl()) {
      feedbacksSchemaPromise = Promise.resolve();
      return feedbacksSchemaPromise;
    }
    feedbacksSchemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS feedbacks (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          center_id text NOT NULL,
          center_name text NOT NULL,
          title text NOT NULL,
          content text NOT NULL,
          writer_type text NOT NULL,
          writer_name text NOT NULL,
          password text NOT NULL,
          is_private boolean NOT NULL DEFAULT false,
          admin_reply text,
          admin_replied_at timestamptz,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS feedbacks_created_idx ON feedbacks (created_at DESC)
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS feedbacks_center_idx ON feedbacks (center_id)
      `;
    })();
  }
  return feedbacksSchemaPromise;
}

type FeedbackRow = {
  id: string;
  center_id: string;
  center_name: string;
  title: string;
  content: string;
  writer_type: string;
  writer_name: string;
  password: string;
  is_private: boolean;
  admin_reply: string | null;
  admin_replied_at: Date | null;
  created_at: Date;
};

function rowToFeedback(r: FeedbackRow, includePassword = false): Feedback {
  return {
    id: r.id,
    centerId: r.center_id,
    centerName: r.center_name,
    title: r.title,
    content: r.content,
    writerType: r.writer_type as "실명" | "익명",
    writerName: r.writer_name,
    password: includePassword ? r.password : undefined,
    isPrivate: r.is_private,
    adminReply: r.admin_reply ?? undefined,
    adminRepliedAt: r.admin_replied_at instanceof Date ? r.admin_replied_at.toISOString() : undefined,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  };
}

// ── 로컬 파일 DB 헬퍼 (로컬 테스트용) ──
const LOCAL_FEEDBACKS_FILE = path.join(process.cwd(), "db", "local_feedbacks.json");

function readLocalFeedbacks(): FeedbackRow[] {
  try {
    if (!fs.existsSync(LOCAL_FEEDBACKS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(LOCAL_FEEDBACKS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return parsed.map((item: any) => ({
      ...item,
      admin_replied_at: item.admin_replied_at ? new Date(item.admin_replied_at) : null,
      created_at: new Date(item.created_at)
    }));
  } catch (e) {
    console.error("Failed to read local feedbacks file", e);
    return [];
  }
}

function writeLocalFeedbacks(list: FeedbackRow[]) {
  try {
    const dir = path.dirname(LOCAL_FEEDBACKS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_FEEDBACKS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write local feedbacks file", e);
  }
}

export async function listFeedbacksFromDb(centerId?: string): Promise<Feedback[]> {
  const sql = getStoriesSql();
  if (!sql) {
    const rows = readLocalFeedbacks();
    const filtered = centerId && centerId !== "all"
      ? rows.filter((r) => r.center_id === centerId)
      : rows;
    const sorted = [...filtered].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    return sorted.map((r) => rowToFeedback(r, false));
  }

  await ensureFeedbacksSchema(sql);

  const rows = centerId && centerId !== "all"
    ? await sql<FeedbackRow[]>`
        SELECT id, center_id, center_name, title, content, writer_type, writer_name, password, is_private, admin_reply, admin_replied_at, created_at
        FROM feedbacks
        WHERE center_id = ${centerId}
        ORDER BY created_at DESC
      `
    : await sql<FeedbackRow[]>`
        SELECT id, center_id, center_name, title, content, writer_type, writer_name, password, is_private, admin_reply, admin_replied_at, created_at
        FROM feedbacks
        ORDER BY created_at DESC
      `;

  // We do NOT expose passwords in the list
  return rows.map((r) => rowToFeedback(r, false));
}

export async function getFeedbackDetailFromDb(id: string, includePassword = false): Promise<Feedback | null> {
  const sql = getStoriesSql();
  if (!sql) {
    const rows = readLocalFeedbacks();
    const row = rows.find((r) => r.id === id);
    return row ? rowToFeedback(row, includePassword) : null;
  }

  await ensureFeedbacksSchema(sql);

  const [row] = await sql<FeedbackRow[]>`
    SELECT id, center_id, center_name, title, content, writer_type, writer_name, password, is_private, admin_reply, admin_replied_at, created_at
    FROM feedbacks
    WHERE id = ${id}::uuid
  `;

  return row ? rowToFeedback(row, includePassword) : null;
}

export async function insertFeedbackDb(input: {
  centerId: string;
  centerName: string;
  title: string;
  content: string;
  writerType: "실명" | "익명";
  writerName: string;
  passwordHash: string;
  isPrivate: boolean;
}): Promise<Feedback> {
  const sql = getStoriesSql();
  if (!sql) {
    const rows = readLocalFeedbacks();
    const newRow: FeedbackRow = {
      id: crypto.randomUUID(),
      center_id: input.centerId,
      center_name: input.centerName,
      title: input.title,
      content: input.content,
      writer_type: input.writerType,
      writer_name: input.writerName,
      password: input.passwordHash,
      is_private: input.isPrivate,
      admin_reply: null,
      admin_replied_at: null,
      created_at: new Date()
    };
    rows.push(newRow);
    writeLocalFeedbacks(rows);
    return rowToFeedback(newRow, false);
  }

  await ensureFeedbacksSchema(sql);

  const [row] = await sql<FeedbackRow[]>`
    INSERT INTO feedbacks (center_id, center_name, title, content, writer_type, writer_name, password, is_private)
    VALUES (
      ${input.centerId},
      ${input.centerName},
      ${input.title},
      ${input.content},
      ${input.writerType},
      ${input.writerName},
      ${input.passwordHash},
      ${input.isPrivate}
    )
    RETURNING id, center_id, center_name, title, content, writer_type, writer_name, password, is_private, admin_reply, admin_replied_at, created_at
  `;

  if (!row) throw new Error("INSERT 실패");
  return rowToFeedback(row, false);
}

export async function updateFeedbackReplyDb(
  id: string,
  replyText: string | null
): Promise<Feedback> {
  const sql = getStoriesSql();
  if (!sql) {
    const rows = readLocalFeedbacks();
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error("문의글이 존재하지 않습니다.");
    const updatedRow: FeedbackRow = {
      ...rows[idx]!,
      admin_reply: replyText,
      admin_replied_at: replyText ? new Date() : null,
    };
    rows[idx] = updatedRow;
    writeLocalFeedbacks(rows);
    return rowToFeedback(updatedRow, false);
  }

  await ensureFeedbacksSchema(sql);

  const [row] = await sql<FeedbackRow[]>`
    UPDATE feedbacks
    SET
      admin_reply = ${replyText},
      admin_replied_at = ${replyText ? sql`now()` : null}
    WHERE id = ${id}::uuid
    RETURNING id, center_id, center_name, title, content, writer_type, writer_name, password, is_private, admin_reply, admin_replied_at, created_at
  `;

  if (!row) throw new Error("UPDATE 답변 실패 — 문의글이 존재하지 않습니다.");
  return rowToFeedback(row, false);
}

export async function deleteFeedbackDb(id: string): Promise<void> {
  const sql = getStoriesSql();
  if (!sql) {
    const rows = readLocalFeedbacks();
    const filtered = rows.filter((r) => r.id !== id);
    writeLocalFeedbacks(filtered);
    return;
  }

  await ensureFeedbacksSchema(sql);

  await sql`DELETE FROM feedbacks WHERE id = ${id}::uuid`;
}
