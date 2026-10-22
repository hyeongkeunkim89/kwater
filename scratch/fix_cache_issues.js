const fs = require('fs');

// 1. src/app/feedback/page.tsx
let fb = fs.readFileSync('src/app/feedback/page.tsx', 'utf8').replace(/\r\n/g, '\n');
const fbTarget = `  useEffect(() => {
    void fetchFeedbacks(filterCenter);
  }, [filterCenter]);`;

const fbReplacement = `  useEffect(() => {
    void fetchFeedbacks(filterCenter);
  }, [filterCenter]);

  // 모달 닫힘 시 폼 입력 캐시 및 비밀번호 상태 전면 초기화
  useEffect(() => {
    if (!showWriteModal) {
      setTitle("");
      setWriterName("");
      setPassword("");
      setContent("");
      setIsPrivate(false);
      setTargetCenterId("all");
      setFormError("");
    }
  }, [showWriteModal]);

  useEffect(() => {
    if (!openPasswordModal) {
      setPrivatePostPassword("");
      setPasswordError("");
      setSelectedPostId(null);
    }
  }, [openPasswordModal]);

  useEffect(() => {
    if (!showDetailModal) {
      setDeletingPostId(null);
      setDeletePassword("");
      setDeleteError("");
    }
  }, [showDetailModal]);`;

if (fb.includes(fbTarget)) {
  fb = fb.replace(fbTarget, fbReplacement);
  fs.writeFileSync('src/app/feedback/page.tsx', fb, 'utf8');
  console.log('Fixed src/app/feedback/page.tsx');
} else {
  console.warn('Could not find fbTarget in feedback/page.tsx');
}

// 2. src/app/lost-found/page.tsx
let lf = fs.readFileSync('src/app/lost-found/page.tsx', 'utf8').replace(/\r\n/g, '\n');
const lfTarget = `  useEffect(() => {
    void fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCenter, selectedType]);`;

const lfReplacement = `  useEffect(() => {
    void fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCenter, selectedType]);

  // 모달 닫힘 시 작성 폼 및 삭제 비밀번호 캐시 전면 초기화
  useEffect(() => {
    if (!showWriteModal) {
      setTitle("");
      setItemName("");
      setPlace("");
      setContent("");
      setWriterName("");
      setContact("");
      setPassword("");
      setShowPassword(false);
      setFormError("");
    }
  }, [showWriteModal]);

  useEffect(() => {
    if (!detailItem) {
      setDeletePassword("");
      setShowDeletePassword(false);
      setDeleteError("");
    }
  }, [detailItem]);`;

if (lf.includes(lfTarget)) {
  lf = lf.replace(lfTarget, lfReplacement);
  fs.writeFileSync('src/app/lost-found/page.tsx', lf, 'utf8');
  console.log('Fixed src/app/lost-found/page.tsx');
} else {
  console.warn('Could not find lfTarget in lost-found/page.tsx');
}

// 3. src/components/ReservationForm.tsx: "추가 예약하기" 시 guestPin, privacyConsent 누락 해결
let rf = fs.readFileSync('src/components/ReservationForm.tsx', 'utf8').replace(/\r\n/g, '\n');
const rfTarget = `            onClick={() => {
              setDone(null);
              setStep(0);
              setDate("");
              setTime("");
              setName("");
              setPhone("");
              setPartySize(2);
              setRequests("");
            }}`;

const rfReplacement = `            onClick={() => {
              setDone(null);
              setStep(0);
              setDate("");
              setTime("");
              setName("");
              setPhone("");
              setGuestPin("");
              setShowGuestPin(false);
              setPartySize(2);
              setRequests("");
              setPrivacyConsent(false);
              setDateError(null);
              setSubmitError(null);
            }}`;

if (rf.includes(rfTarget)) {
  rf = rf.replace(rfTarget, rfReplacement);
  fs.writeFileSync('src/components/ReservationForm.tsx', rf, 'utf8');
  console.log('Fixed src/components/ReservationForm.tsx');
} else {
  console.warn('Could not find rfTarget in ReservationForm.tsx');
}

// 4. src/components/ReservationLookupCard.tsx: 로그아웃 시 캐시된 전화번호/예약 목록 초기화
let rlc = fs.readFileSync('src/components/ReservationLookupCard.tsx', 'utf8').replace(/\r\n/g, '\n');
const rlcTarget = `  // 회원 로그인 상태인 경우 유저 전화번호 자동 세팅 및 회원 예약 자동 조회
  useEffect(() => {
    if (!queryPhone && user?.phone && user.phone !== "010-0000-0000" && user.phone !== "010-1234-5678" && user.phone !== "010-9876-5432") {
      const formatted = formatPhone(user.phone);
      setPhone(formatted);
      void handleSearch(formatted, "");
    }
  }, [user, queryPhone]);`;

const rlcReplacement = `  // 회원 로그인 상태인 경우 유저 전화번호 자동 세팅 및 회원 예약 자동 조회 (로그아웃 시 캐시 초기화)
  useEffect(() => {
    if (!queryPhone && user?.phone && user.phone !== "010-0000-0000" && user.phone !== "010-1234-5678" && user.phone !== "010-9876-5432") {
      const formatted = formatPhone(user.phone);
      setPhone(formatted);
      void handleSearch(formatted, "");
    } else if (!user && !queryPhone) {
      setPhone("");
      setPin("");
      setResults([]);
      setHasSearched(false);
    }
  }, [user, queryPhone]);`;

if (rlc.includes(rlcTarget)) {
  rlc = rlc.replace(rlcTarget, rlcReplacement);
  fs.writeFileSync('src/components/ReservationLookupCard.tsx', rlc, 'utf8');
  console.log('Fixed src/components/ReservationLookupCard.tsx');
} else {
  console.warn('Could not find rlcTarget in ReservationLookupCard.tsx');
}

// 5. src/app/mypage/page.tsx: 로그아웃 시 myFeedbacks 초기화
let mp = fs.readFileSync('src/app/mypage/page.tsx', 'utf8').replace(/\r\n/g, '\n');
const mpTarget = `  useEffect(() => {
    if (!user) {
      setReservations([]);
      return;
    }`;

const mpReplacement = `  useEffect(() => {
    if (!user) {
      setReservations([]);
      setMyFeedbacks([]);
      return;
    }`;

if (mp.includes(mpTarget)) {
  mp = mp.replace(mpTarget, mpReplacement);
  fs.writeFileSync('src/app/mypage/page.tsx', mp, 'utf8');
  console.log('Fixed src/app/mypage/page.tsx');
} else {
  console.warn('Could not find mpTarget in mypage/page.tsx');
}

// 6. src/components/AdminEventsPanel.tsx
let aep = fs.readFileSync('src/components/AdminEventsPanel.tsx', 'utf8').replace(/\r\n/g, '\n');
const aepTarget = `  useEffect(() => {
    void fetchEvents();
  }, []);`;

const aepReplacement = `  useEffect(() => {
    void fetchEvents();
  }, []);

  // 폼 닫힘 시 편집 상태 및 입력 캐시 초기화
  useEffect(() => {
    if (!showForm) {
      setEditingId(null);
      setTitle("");
      setContent("");
      setImageUrl("");
    }
  }, [showForm]);`;

if (aep.includes(aepTarget)) {
  aep = aep.replace(aepTarget, aepReplacement);
  fs.writeFileSync('src/components/AdminEventsPanel.tsx', aep, 'utf8');
  console.log('Fixed src/components/AdminEventsPanel.tsx');
} else {
  console.warn('Could not find aepTarget in AdminEventsPanel.tsx');
}

// 7. src/components/AdminNewsPanel.tsx
let anp = fs.readFileSync('src/components/AdminNewsPanel.tsx', 'utf8').replace(/\r\n/g, '\n');
const anpTarget = `  useEffect(() => {
    void fetchNews();
  }, []);`;

const anpReplacement = `  useEffect(() => {
    void fetchNews();
  }, []);

  // 폼 닫힘 시 편집 상태 및 입력 캐시 초기화
  useEffect(() => {
    if (!showForm) {
      setEditingId(null);
      setTitle("");
      setContent("");
      setImageUrl("");
      setIsPinned(false);
    }
  }, [showForm]);`;

if (anp.includes(anpTarget)) {
  anp = anp.replace(anpTarget, anpReplacement);
  fs.writeFileSync('src/components/AdminNewsPanel.tsx', anp, 'utf8');
  console.log('Fixed src/components/AdminNewsPanel.tsx');
} else {
  console.warn('Could not find anpTarget in AdminNewsPanel.tsx');
}
