"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { getCenterById, waterCenters } from "@/data/centers";
import { formatCenterRegionLine } from "@/lib/center-display";
import {
  TOUR_SLOTS,
  VISIT_PURPOSES,
  MAX_PER_SLOT,
  type VisitPurpose,
  type Reservation,
} from "@/types/reservation";
import {
  addReservation,
  getAvailableCount,
} from "@/lib/reservations";
import { STAFF_CONSOLE_HREF } from "@/lib/sitePaths";

// ─── 날짜 유틸 ──────────────────────────────────────────────
function toDateStr(d: Date) {
  return d.toLocaleDateString("sv-SE"); // YYYY-MM-DD
}
function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function formatDateKo(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  const dow = new Date(dateStr).toLocaleDateString("ko-KR", { weekday: "short" });
  return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일 (${dow})`;
}

// 오늘부터 90일간 선택 가능
const TODAY = toDateStr(new Date());
const MAX_DATE = toDateStr(addDays(new Date(), 90));

// ─── 단계 표시 ───────────────────────────────────────────────
const STEPS = ["시설·일시 선택", "방문자 정보", "예약 확인"] as const;
type StepIndex = 0 | 1 | 2;

function StepIndicator({ current }: { current: StepIndex }) {
  return (
    <ol className="flex items-center gap-0">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <span
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors",
                  done
                    ? "bg-sky-600 text-white"
                    : active
                      ? "bg-sky-600 text-white ring-4 ring-sky-100"
                      : "bg-slate-200 text-slate-500",
                ].join(" ")}
              >
                {done ? "✓" : i + 1}
              </span>
              <span
                className={[
                  "text-[11px] font-medium whitespace-nowrap",
                  active ? "text-sky-700" : done ? "text-slate-600" : "text-slate-400",
                ].join(" ")}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={[
                  "mx-2 mt-[-14px] h-0.5 w-12 sm:w-20 transition-colors",
                  done ? "bg-sky-500" : "bg-slate-200",
                ].join(" ")}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function initialCenterId(defaultId?: string) {
  if (defaultId && waterCenters.some((c) => c.id === defaultId)) return defaultId;
  return waterCenters[0].id;
}

// ─── 메인 컴포넌트 ───────────────────────────────────────────
export function ReservationForm({
  defaultCenterId,
  reservationsLive = false,
}: {
  defaultCenterId?: string;
  reservationsLive?: boolean;
}) {
  const [step, setStep] = useState<StepIndex>(0);
  const [done, setDone] = useState<Reservation | null>(null);

  // Step 0
  const [centerId, setCenterId] = useState(() => initialCenterId(defaultCenterId));
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Step 1
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [purpose, setPurpose] = useState<VisitPurpose>("개인·가족 관람");
  const [requests, setRequests] = useState("");

  const selectedCenter = useMemo(
    () => waterCenters.find((c) => c.id === centerId)!,
    [centerId],
  );

  const localSlotAvailability = useMemo(() => {
    if (!date) return {} as Record<string, number>;
    return Object.fromEntries(
      TOUR_SLOTS.map((t) => [t, getAvailableCount(centerId, date, t)]),
    );
  }, [centerId, date]);

  const [serverAvailMap, setServerAvailMap] = useState<Record<string, number> | null>(null);
  const [availLoading, setAvailLoading] = useState(false);
  const [availError, setAvailError] = useState<string | null>(null);
  const [availRetry, setAvailRetry] = useState(0);

  useEffect(() => {
    if (!reservationsLive || !date) {
      setServerAvailMap(null);
      setAvailError(null);
      setAvailLoading(false);
      return;
    }
    let cancelled = false;
    setAvailLoading(true);
    setAvailError(null);
    setServerAvailMap(null);
    const q = new URLSearchParams({ centerId, date });
    void fetch(`/api/reservations/availability?${q}`)
      .then(async (res) => {
        const raw = await res.text();
        let j: {
          availability?: Record<string, number>;
          error?: string;
          hint?: string;
          code?: string;
        } = {};
        try {
          j = raw ? (JSON.parse(raw) as typeof j) : {};
        } catch {
          throw new Error(
            `잔여 인원 조회 응답을 해석하지 못했습니다. (HTTP ${res.status})`,
          );
        }
        if (!res.ok) {
          const parts = [j.error, j.hint, j.code ? `코드: ${j.code}` : ""].filter(Boolean);
          throw new Error(parts.join(" ") || "잔여 인원을 불러오지 못했습니다.");
        }
        if (!j.availability || typeof j.availability !== "object") {
          throw new Error("응답 형식이 올바르지 않습니다.");
        }
        return j.availability;
      })
      .then((map) => {
        if (!cancelled) setServerAvailMap(map);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setAvailError(e instanceof Error ? e.message : "잔여 인원을 불러오지 못했습니다.");
          setServerAvailMap(null);
        }
      })
      .finally(() => {
        if (!cancelled) setAvailLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reservationsLive, centerId, date, availRetry]);

  const slotAvailability = reservationsLive ? (serverAvailMap ?? {}) : localSlotAvailability;

  const loadingSlots =
    reservationsLive && Boolean(date) && (availLoading || serverAvailMap === null) && !availError;

  const step0Valid = centerId && date && time;
  const maxForSelectedTime = reservationsLive
    ? (serverAvailMap?.[time] ?? 0)
    : (slotAvailability[time] ?? MAX_PER_SLOT);

  const step1Valid =
    name.trim().length >= 2 &&
    /^[0-9-]{9,13}$/.test(phone.replace(/\s/g, "")) &&
    partySize >= 1 &&
    partySize <= maxForSelectedTime &&
    (!reservationsLive || Boolean(serverAvailMap));

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    setSubmitError(null);
    if (reservationsLive) {
      setSubmitting(true);
      try {
        const res = await fetch("/api/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            centerId,
            centerName: selectedCenter.name,
            date,
            time,
            name: name.trim(),
            phone: phone.trim(),
            partySize,
            purpose,
            requests: requests.trim(),
          }),
        });
        const data = (await res.json().catch(() => ({}))) as Reservation | { error?: string };
        if (!res.ok) {
          setSubmitError(
            typeof (data as { error?: string }).error === "string"
              ? (data as { error: string }).error
              : "예약 접수에 실패했습니다.",
          );
          return;
        }
        setDone(data as Reservation);
      } finally {
        setSubmitting(false);
      }
      return;
    }
    const r = addReservation({
      centerId,
      centerName: selectedCenter.name,
      date,
      time,
      name: name.trim(),
      phone: phone.trim(),
      partySize,
      purpose,
      requests: requests.trim(),
    });
    setDone(r);
  }, [
    reservationsLive,
    centerId,
    date,
    time,
    name,
    phone,
    partySize,
    purpose,
    requests,
    selectedCenter,
  ]);

  // ── 완료 화면 ──────────────────────────────────────────────
  if (done) {
    const doneCenter = getCenterById(done.centerId);
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
          ✓
        </div>
        <h2 className="mt-4 text-xl font-bold text-emerald-900">예약이 접수됐습니다</h2>
        <p className="mt-2 text-sm text-emerald-700">
          담당자 확인 후 상태가 &apos;확정&apos;으로 변경됩니다.
        </p>
        <div className="mt-6 rounded-xl bg-white p-5 text-left text-sm shadow-sm ring-1 ring-emerald-200">
          <dl className="space-y-2 text-slate-700">
            <div className="flex justify-between">
              <dt className="font-medium text-slate-500">예약 번호</dt>
              <dd className="font-mono font-semibold text-sky-700">{done.id}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 font-medium text-slate-500">문화관</dt>
              <dd className="min-w-0 text-right">
                <div className="font-semibold text-slate-900">{done.centerName}</div>
                {doneCenter && (
                  <div className="mt-0.5 text-xs text-slate-500">
                    {formatCenterRegionLine(doneCenter)}
                  </div>
                )}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-slate-500">일시</dt>
              <dd>
                {formatDateKo(done.date)} {done.time}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-slate-500">인원</dt>
              <dd>{done.partySize}명</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-slate-500">예약자</dt>
              <dd>{done.name}</dd>
            </div>
          </dl>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => {
              setDone(null);
              setStep(0);
              setDate("");
              setTime("");
              setName("");
              setPhone("");
              setPartySize(2);
              setRequests("");
            }}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-sky-400 hover:text-sky-800"
          >
            추가 예약하기
          </button>
          <Link
            href={STAFF_CONSOLE_HREF}
            className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
          >
            운영 콘솔에서 보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* 단계 표시 */}
      <div className="flex justify-center">
        <StepIndicator current={step} />
      </div>

      {/* ── STEP 0 : 시설·일시 선택 ── */}
      {step === 0 && (
        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">문화관 및 일시 선택</h2>

          {/* 문화관 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              문화관 <span className="text-rose-500">*</span>
            </label>
            <select
              value={centerId}
              onChange={(e) => {
                setCenterId(e.target.value);
                setTime("");
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
            >
              {waterCenters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({formatCenterRegionLine(c)})
                </option>
              ))}
            </select>
          </div>

          {/* 날짜 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              방문 날짜 <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              min={TODAY}
              max={MAX_DATE}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </div>

          {/* 시간 선택 */}
          {date && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                투어 시간 <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500">
                슬롯당 최대 {MAX_PER_SLOT}명 · 소요 약 60분
              </p>
              {availError && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  <p>{availError}</p>
                  <button
                    type="button"
                    onClick={() => setAvailRetry((n) => n + 1)}
                    className="mt-2 font-semibold text-amber-800 underline decoration-amber-600/60 hover:text-amber-950"
                  >
                    다시 시도
                  </button>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {TOUR_SLOTS.map((t) => {
                  const avail = reservationsLive
                    ? (serverAvailMap?.[t] ?? 0)
                    : (slotAvailability[t] ?? MAX_PER_SLOT);
                  const full = !loadingSlots && !availError && avail <= 0;
                  const disabled = loadingSlots || Boolean(availError) || full;
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={disabled}
                      onClick={() => setTime(t)}
                      className={[
                        "flex min-h-[44px] flex-col items-center justify-center rounded-xl border py-3 text-sm font-semibold transition focus:outline-none",
                        disabled
                          ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                          : time === t
                            ? "border-sky-500 bg-sky-600 text-white shadow"
                            : "border-slate-200 bg-white text-slate-800 hover:border-sky-300 hover:text-sky-800",
                      ].join(" ")}
                    >
                      {t}
                      <span
                        className={[
                          "mt-0.5 text-[10px]",
                          disabled
                            ? "text-slate-300"
                            : time === t
                              ? "text-sky-100"
                              : "text-slate-400",
                        ].join(" ")}
                      >
                        {loadingSlots
                          ? "확인 중"
                          : availError
                            ? "—"
                            : full
                              ? "마감"
                              : `잔여 ${avail}명`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              disabled={!step0Valid}
              onClick={() => setStep(1)}
              className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음 단계 →
            </button>
          </div>
        </section>
      )}

      {/* ── STEP 1 : 방문자 정보 ── */}
      {step === 1 && (
        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">방문자 정보 입력</h2>

          {/* 선택 요약 */}
          <div className="rounded-xl bg-sky-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-sky-200/60">
            <p className="font-semibold text-sky-800">{selectedCenter.name}</p>
            <p className="mt-0.5 text-xs text-slate-600">
              {formatCenterRegionLine(selectedCenter)}
            </p>
            <p className="mt-2 text-slate-700">
              <span>{formatDateKo(date)}</span>
              {"  "}
              <span className="font-semibold">{time}</span>
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* 예약자명 */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                예약자 성명 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            {/* 연락처 */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                연락처 <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="010-0000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            {/* 방문 인원 */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                방문 인원 <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPartySize((n) => Math.max(1, n - 1))}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-lg font-bold text-slate-600 hover:border-sky-400 hover:text-sky-700"
                >
                  −
                </button>
                <span className="w-16 text-center text-lg font-bold tabular-nums text-slate-900">
                  {partySize}명
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPartySize((n) =>
                      Math.min(maxForSelectedTime || MAX_PER_SLOT, n + 1),
                    )
                  }
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-lg font-bold text-slate-600 hover:border-sky-400 hover:text-sky-700"
                >
                  +
                </button>
                <span className="text-xs text-slate-400">
                  (최대 {maxForSelectedTime || MAX_PER_SLOT}명)
                </span>
              </div>
            </div>

            {/* 방문 목적 */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                방문 목적 <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {VISIT_PURPOSES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPurpose(p)}
                    className={[
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                      purpose === p
                        ? "border-sky-500 bg-sky-600 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-sky-300",
                    ].join(" ")}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 요청사항 */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              요청사항{" "}
              <span className="font-normal text-slate-400">(선택)</span>
            </label>
            <textarea
              rows={3}
              placeholder="휠체어 이용, 외국어 가이드 등 특이사항을 입력하세요."
              value={requests}
              onChange={(e) => setRequests(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(0)}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-sky-400 hover:text-sky-800"
            >
              ← 이전
            </button>
            <button
              disabled={!step1Valid}
              onClick={() => setStep(2)}
              className="rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음 단계 →
            </button>
          </div>
        </section>
      )}

      {/* ── STEP 2 : 예약 확인 ── */}
      {step === 2 && (
        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">예약 내용 확인</h2>

          <dl className="divide-y divide-slate-100 rounded-xl bg-slate-50 px-5 py-1 text-sm">
            {[
              ["문화관", selectedCenter.name],
              ["위치", formatCenterRegionLine(selectedCenter)],
              ["방문일", formatDateKo(date)],
              ["투어 시간", `${time} (약 60분)`],
              ["방문 인원", `${partySize}명`],
              ["예약자 성명", name],
              ["연락처", phone],
              ["방문 목적", purpose],
              ...(requests ? [["요청사항", requests]] : []),
            ].map(([k, v]) => (
              <div key={k} className="flex items-start gap-4 py-3.5">
                <dt className="w-28 shrink-0 font-medium text-slate-500">{k}</dt>
                <dd className="text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900 ring-1 ring-amber-200/80">
            예약 접수 후 담당자 검토를 거쳐 확정됩니다. 취소·변경이 필요하면
            예약 현황 페이지에서 직접 취소하거나 해당 문화관으로 연락하세요.
          </p>

          {submitError && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {submitError}
            </p>
          )}

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(1)}
              disabled={submitting}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-sky-400 hover:text-sky-800 disabled:opacity-50"
            >
              ← 이전
            </button>
            <button
              onClick={() => void handleSubmit()}
              disabled={submitting}
              className="rounded-xl bg-sky-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50"
            >
              {submitting ? "접수 중…" : "예약 신청 완료"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
