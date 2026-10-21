const fs = require('fs');

// 1. reservationsDb.ts
let rdb = fs.readFileSync('src/lib/reservationsDb.ts', 'utf8');
const oldTarget = `  const targetDigits = phone.replace(/\\D/g, "");
  if (!targetDigits) return [];
  const rows = await sql<TourReservationRow[]>\`
    SELECT id, center_id, center_name, visit_date, visit_time, name, phone, user_email, guest_pin, party_size, purpose, requests, status, created_at
    FROM tour_reservations
    WHERE regexp_replace(phone, '[^0-9]', '', 'g') = \${targetDigits}
      AND (guest_pin IS NULL OR guest_pin = '' OR guest_pin = \${pin.trim()})
    ORDER BY created_at DESC\`;`;

const newTarget = `  const targetDigits = phone.replace(/\\D/g, "");
  const trimmedPin = pin.trim();
  if (!targetDigits || !trimmedPin) return [];
  const rows = await sql<TourReservationRow[]>\`
    SELECT id, center_id, center_name, visit_date, visit_time, name, phone, user_email, guest_pin, party_size, purpose, requests, status, created_at
    FROM tour_reservations
    WHERE regexp_replace(phone, '[^0-9]', '', 'g') = \${targetDigits}
      AND guest_pin = \${trimmedPin}
    ORDER BY created_at DESC\`;`;

// Normalize CRLF to LF for reliable replace, then replace
rdb = rdb.replace(/\r\n/g, '\n');
if (rdb.includes(oldTarget)) {
  rdb = rdb.replace(oldTarget, newTarget);
  console.log('Fixed getGuestReservationsFromDb in reservationsDb.ts');
} else {
  console.warn('Could not find oldTarget in reservationsDb.ts');
}

const oldCancel = `(${'${targetDigits}'} <> '' AND regexp_replace(phone, '[^0-9]', '', 'g') = \${targetDigits} AND (guest_pin IS NULL OR guest_pin = '' OR guest_pin = \${pin.trim()}))`;
const newCancel = `(${'${targetDigits}'} <> '' AND \${pin.trim()} <> '' AND regexp_replace(phone, '[^0-9]', '', 'g') = \${targetDigits} AND guest_pin = \${pin.trim()})`;

if (rdb.includes(oldCancel)) {
  rdb = rdb.replace(oldCancel, newCancel);
  console.log('Fixed cancelGuestReservationInDb in reservationsDb.ts');
} else {
  console.warn('Could not find oldCancel in reservationsDb.ts');
}
fs.writeFileSync('src/lib/reservationsDb.ts', rdb, 'utf8');

// 2. guest-lookup route: ensure phone & pin are required
let glRoute = fs.readFileSync('src/app/api/reservations/guest-lookup/route.ts', 'utf8').replace(/\r\n/g, '\n');
const oldGlCheck = `  if (!phone) {
    return NextResponse.json({ reservations: [] });
  }`;
const newGlCheck = `  if (!phone || !pin) {
    return NextResponse.json({ reservations: [] });
  }`;
if (glRoute.includes(oldGlCheck)) {
  glRoute = glRoute.replace(oldGlCheck, newGlCheck);
  fs.writeFileSync('src/app/api/reservations/guest-lookup/route.ts', glRoute, 'utf8');
  console.log('Fixed guest-lookup route to require pin');
}

// 3. ReservationLookupCard.tsx: require pin when non-user and validate against r.guestPin
let rlc = fs.readFileSync('src/components/ReservationLookupCard.tsx', 'utf8').replace(/\r\n/g, '\n');
const oldRlcCheck = `    const digits = targetPhone.replace(/\\D/g, "");
    if (!digits) {
      alert("휴대폰 번호를 입력해 주세요.");
      return;
    }`;
const newRlcCheck = `    const digits = targetPhone.replace(/\\D/g, "");
    if (!digits) {
      alert("휴대폰 번호를 입력해 주세요.");
      return;
    }
    if (!user && (!targetPin.trim() || targetPin.trim().length !== 4)) {
      alert("비회원 예약 조회 시 예약 비밀번호 4자리를 정확히 입력해 주세요.");
      return;
    }`;

if (rlc.includes(oldRlcCheck)) {
  rlc = rlc.replace(oldRlcCheck, newRlcCheck);
  console.log('Fixed ReservationLookupCard pin validation');
}

const oldFilter = `        if (r.guestPin && targetPin.trim()) {
          if (r.guestPin !== targetPin.trim()) return false;
        }`;
const newFilter = `        if (r.guestPin) {
          if (r.guestPin !== targetPin.trim()) return false;
        }`;
if (rlc.includes(oldFilter)) {
  rlc = rlc.replace(oldFilter, newFilter);
  console.log('Fixed ReservationLookupCard guestPin filter');
}
fs.writeFileSync('src/components/ReservationLookupCard.tsx', rlc, 'utf8');

// 4. auth logout route: add user_session and kwm_staff_console_gate deletion
let logoutRoute = fs.readFileSync('src/app/api/auth/logout/route.ts', 'utf8').replace(/\r\n/g, '\n');
const oldLogout = `  cookieStore.delete("naver_user_session");
  cookieStore.delete("kakao_user_session");
  cookieStore.delete("staff_console_auth");`;
const newLogout = `  cookieStore.delete("naver_user_session");
  cookieStore.delete("kakao_user_session");
  cookieStore.delete("staff_console_auth");
  cookieStore.delete("user_session");
  cookieStore.delete("kwm_staff_console_gate");`;
if (logoutRoute.includes(oldLogout)) {
  logoutRoute = logoutRoute.replace(oldLogout, newLogout);
  fs.writeFileSync('src/app/api/auth/logout/route.ts', logoutRoute, 'utf8');
  console.log('Fixed auth logout route cookies');
}

// 5. ReservationForm.tsx: add guestPin, user to useCallback deps
let resForm = fs.readFileSync('src/components/ReservationForm.tsx', 'utf8').replace(/\r\n/g, '\n');
const oldDeps = `  }, [
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
  ]);`;
const newDeps = `  }, [
    reservationsLive,
    centerId,
    date,
    time,
    name,
    phone,
    guestPin,
    user,
    partySize,
    purpose,
    requests,
    selectedCenter,
  ]);`;
if (resForm.includes(oldDeps)) {
  resForm = resForm.replace(oldDeps, newDeps);
  fs.writeFileSync('src/components/ReservationForm.tsx', resForm, 'utf8');
  console.log('Fixed ReservationForm useCallback deps');
}
