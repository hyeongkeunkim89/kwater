import { getStoriesSql, skipDatabaseRuntimeSchemaDdl } from "./waterStoriesDb";
import type { Event } from "@/types/event";
import type postgres from "postgres";
import fs from "fs";
import path from "path";

let eventsSchemaPromise: Promise<void> | null = null;

function ensureEventsSchema(sql: ReturnType<typeof postgres>) {
  if (!eventsSchemaPromise) {
    if (skipDatabaseRuntimeSchemaDdl()) {
      eventsSchemaPromise = Promise.resolve();
      return eventsSchemaPromise;
    }
    eventsSchemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS events (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          center_id text NOT NULL,
          center_name text NOT NULL,
          title text NOT NULL,
          content text NOT NULL,
          start_date date NOT NULL,
          end_date date NOT NULL,
          is_headquarters boolean NOT NULL DEFAULT false,
          image_url text,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS events_created_idx ON events (created_at DESC)
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS events_center_idx ON events (center_id)
      `;
    })();
  }
  return eventsSchemaPromise;
}

type EventRow = {
  id: string;
  center_id: string;
  center_name: string;
  title: string;
  content: string;
  start_date: Date | string;
  end_date: Date | string;
  is_headquarters: boolean;
  image_url: string | null;
  created_at: Date;
};

function formatDateString(d: Date | string): string {
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10);
  return String(d).slice(0, 10);
}

function rowToEvent(r: EventRow): Event {
  return {
    id: r.id,
    centerId: r.center_id,
    centerName: r.center_name,
    title: r.title,
    content: r.content,
    startDate: formatDateString(r.start_date),
    endDate: formatDateString(r.end_date),
    isHeadquarters: r.is_headquarters,
    imageUrl: r.image_url ?? undefined,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  };
}

// ── 로컬 파일 DB 헬퍼 (로컬 테스트용) ──
const LOCAL_EVENTS_FILE = path.join(process.cwd(), "db", "local_events.json");

function readLocalEvents(): EventRow[] {
  try {
    if (!fs.existsSync(LOCAL_EVENTS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(LOCAL_EVENTS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return parsed.map((item: any) => ({
      ...item,
      created_at: new Date(item.created_at)
    }));
  } catch (e) {
    console.error("Failed to read local events file", e);
    return [];
  }
}

function writeLocalEvents(list: EventRow[]) {
  try {
    const dir = path.dirname(LOCAL_EVENTS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_EVENTS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write local events file", e);
  }
}

export async function listEventsFromDb(centerId?: string): Promise<Event[]> {
  const sql = getStoriesSql();
  if (!sql) {
    const rows = readLocalEvents();
    const filtered = centerId && centerId !== "all"
      ? rows.filter((r) => r.center_id === centerId || r.is_headquarters)
      : rows;
    const sorted = [...filtered].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    return sorted.map(rowToEvent);
  }

  await ensureEventsSchema(sql);

  const rows = centerId && centerId !== "all"
    ? await sql<EventRow[]>`
        SELECT id, center_id, center_name, title, content, start_date, end_date, is_headquarters, image_url, created_at
        FROM events
        WHERE center_id = ${centerId} OR is_headquarters = true
        ORDER BY created_at DESC
      `
    : await sql<EventRow[]>`
        SELECT id, center_id, center_name, title, content, start_date, end_date, is_headquarters, image_url, created_at
        FROM events
        ORDER BY created_at DESC
      `;

  return rows.map(rowToEvent);
}

export async function getEventDetailFromDb(id: string): Promise<Event | null> {
  const sql = getStoriesSql();
  if (!sql) {
    const rows = readLocalEvents();
    const row = rows.find((r) => r.id === id);
    return row ? rowToEvent(row) : null;
  }

  await ensureEventsSchema(sql);

  const [row] = await sql<EventRow[]>`
    SELECT id, center_id, center_name, title, content, start_date, end_date, is_headquarters, image_url, created_at
    FROM events
    WHERE id = ${id}::uuid
  `;

  return row ? rowToEvent(row) : null;
}

export async function insertEventDb(input: {
  centerId: string;
  centerName: string;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  isHeadquarters: boolean;
  imageUrl?: string;
}): Promise<Event> {
  const sql = getStoriesSql();
  if (!sql) {
    const rows = readLocalEvents();
    const newRow: EventRow = {
      id: crypto.randomUUID(),
      center_id: input.centerId,
      center_name: input.centerName,
      title: input.title,
      content: input.content,
      start_date: input.startDate,
      end_date: input.endDate,
      is_headquarters: input.isHeadquarters,
      image_url: input.imageUrl ?? null,
      created_at: new Date()
    };
    rows.push(newRow);
    writeLocalEvents(rows);
    return rowToEvent(newRow);
  }

  await ensureEventsSchema(sql);

  const [row] = await sql<EventRow[]>`
    INSERT INTO events (center_id, center_name, title, content, start_date, end_date, is_headquarters, image_url)
    VALUES (
      ${input.centerId},
      ${input.centerName},
      ${input.title},
      ${input.content},
      ${input.startDate}::date,
      ${input.endDate}::date,
      ${input.isHeadquarters},
      ${input.imageUrl ?? null}
    )
    RETURNING id, center_id, center_name, title, content, start_date, end_date, is_headquarters, image_url, created_at
  `;

  if (!row) throw new Error("INSERT 실패");
  return rowToEvent(row);
}

export async function updateEventDb(
  id: string,
  input: {
    centerId: string;
    centerName: string;
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    isHeadquarters: boolean;
    imageUrl?: string;
  }
): Promise<Event> {
  const sql = getStoriesSql();
  if (!sql) {
    const rows = readLocalEvents();
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error("이벤트가 존재하지 않습니다.");
    const updatedRow: EventRow = {
      ...rows[idx]!,
      center_id: input.centerId,
      center_name: input.centerName,
      title: input.title,
      content: input.content,
      start_date: input.startDate,
      end_date: input.endDate,
      is_headquarters: input.isHeadquarters,
      image_url: input.imageUrl ?? null,
    };
    rows[idx] = updatedRow;
    writeLocalEvents(rows);
    return rowToEvent(updatedRow);
  }

  await ensureEventsSchema(sql);

  const [row] = await sql<EventRow[]>`
    UPDATE events
    SET
      center_id = ${input.centerId},
      center_name = ${input.centerName},
      title = ${input.title},
      content = ${input.content},
      start_date = ${input.startDate}::date,
      end_date = ${input.endDate}::date,
      is_headquarters = ${input.isHeadquarters},
      image_url = ${input.imageUrl ?? null}
    WHERE id = ${id}::uuid
    RETURNING id, center_id, center_name, title, content, start_date, end_date, is_headquarters, image_url, created_at
  `;

  if (!row) throw new Error("UPDATE 실패 — 이벤트가 존재하지 않습니다.");
  return rowToEvent(row);
}

export async function deleteEventDb(id: string): Promise<void> {
  const sql = getStoriesSql();
  if (!sql) {
    const rows = readLocalEvents();
    const filtered = rows.filter((r) => r.id !== id);
    writeLocalEvents(filtered);
    return;
  }

  await ensureEventsSchema(sql);

  await sql`DELETE FROM events WHERE id = ${id}::uuid`;
}
