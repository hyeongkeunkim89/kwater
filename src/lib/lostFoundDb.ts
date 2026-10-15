import type { LostFoundItem, LostFoundType, LostFoundStatus } from "@/types/lostFound";

// 기본 초기 샘플 데이터 (리버가이드 분실물찾기 실제 사례를 물문화관에 맞추어 탑재)
export const initialLostFoundItems: LostFoundItem[] = [
  {
    id: "lf-1",
    type: "분실",
    centerId: "the-arc",
    centerName: "디아크 문화관",
    title: "디아크 2층 카페테리아 부근 무선 이어폰 케이스 분실",
    itemName: "화이트 무선 이어폰 케이스",
    date: "2026-10-12",
    place: "2층 카페테리아 창가 좌석",
    content: "10월 12일 오후 3시경 2층 카페테리아 창가 쪽에 머무르다 분실한 것 같습니다. 혹시 습득하신 분이나 보관 중이시면 연락 부탁드립니다.",
    writerName: "정*길",
    contact: "010-****-1234",
    status: "접수",
    createdAt: "2026-10-12T15:30:00.000Z",
  },
  {
    id: "lf-2",
    type: "습득",
    centerId: "han-river",
    centerName: "한강물문화관",
    title: "한강물문화관 야외 광장 벤치 검정색 백팩 보관 안내",
    itemName: "검정색 나일론 백팩",
    date: "2026-10-10",
    place: "야외 수변 광장 시계탑 앞 벤치",
    content: "10월 10일 오후 야외 광장 벤치에서 습득되어 현재 1층 안내데스크에서 보관 중입니다. 소유자분께서는 신분증을 지참하시어 안내데스크로 방문해 주시기 바랍니다.",
    writerName: "안내데스크",
    contact: "031-880-6200",
    status: "보관중",
    createdAt: "2026-10-10T17:10:00.000Z",
  },
  {
    id: "lf-3",
    type: "분실",
    centerId: "geum-river",
    centerName: "금강문화관",
    title: "금강문화관 자전거 종주인증센터 수첩 분실 (찾습니다)",
    itemName: "국토종주 자전거 인증수첩",
    date: "2026-09-28",
    place: "자전거 인증센터 부스 앞 거치대",
    content: "인증 도장을 찍고 거치대에 잠시 올려두었다가 두고 온 것 같습니다. 이름이 적혀 있습니다. 소중한 기록이라 꼭 찾고 싶습니다.",
    writerName: "김*석",
    contact: "010-****-5678",
    status: "접수",
    createdAt: "2026-09-28T11:20:00.000Z",
  },
  {
    id: "lf-4",
    type: "습득",
    centerId: "nakdong-river",
    centerName: "낙동강문화관",
    title: "낙동강문화관 1층 어린이 체험실 캐릭터 파우치 습득",
    itemName: "노란색 캐릭터 파우치 (필기도구 포함)",
    date: "2026-09-15",
    place: "어린이 물체험존 쉼터",
    content: "어린이 단체 관람 후 쉼터 의자에 남아 있어 안내데스크에서 보관하고 있습니다. 분실하신 보호자께서는 안내데스크로 문의 바랍니다.",
    writerName: "안내데스크",
    contact: "051-201-0884",
    status: "보관중",
    createdAt: "2026-09-15T14:45:00.000Z",
  },
  {
    id: "lf-5",
    type: "습득",
    centerId: "yeongsan-river",
    centerName: "영산강문화관",
    title: "영산강문화관 야외 쉼터 차량 스마트키 습득 (주인 수령완료)",
    itemName: "현대자동차 스마트키",
    date: "2026-08-30",
    place: "야외 그늘 쉼터",
    content: "야외 쉼터에서 습득되었던 차량 스마트키는 본인 확인 후 소유자분께 안전하게 인계 완료되었습니다.",
    writerName: "안내데스크",
    contact: "061-335-0866",
    status: "수령완료",
    createdAt: "2026-08-30T10:00:00.000Z",
  },
  {
    id: "lf-6",
    type: "분실",
    centerId: "the-arc",
    centerName: "디아크 문화관",
    title: "디아크 수변데크 주변 검정색 선글라스 분실",
    itemName: "검정 뿔테 선글라스 (갈색 케이스)",
    date: "2026-08-18",
    place: "강변 수변 산책로 데크",
    content: "일몰 관람 후 산책로를 걷다가 케이스 채로 떨어뜨린 것으로 추정됩니다. 습득하신 분은 안내데스크에 맡겨주시면 감사하겠습니다.",
    writerName: "이*연",
    status: "접수",
    createdAt: "2026-08-18T19:20:00.000Z",
  },
];

let inMemoryItems: LostFoundItem[] = [...initialLostFoundItems];

export async function listLostFoundItems(centerId?: string, type?: string, search?: string): Promise<LostFoundItem[]> {
  let list = [...inMemoryItems];

  if (centerId && centerId !== "all") {
    list = list.filter((item) => item.centerId === centerId);
  }

  if (type && type !== "all") {
    list = list.filter((item) => item.type === type || (type === "수령완료" && item.status === "수령완료"));
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.itemName.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.writerName.toLowerCase().includes(q) ||
        item.place.toLowerCase().includes(q)
    );
  }

  // 최신순 정렬
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function maskName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed || trimmed === "안내데스크") return trimmed;
  if (trimmed.length <= 1) return trimmed;
  if (trimmed.length === 2) return `${trimmed[0]}*`;
  return `${trimmed[0]}${"*".repeat(trimmed.length - 2)}${trimmed[trimmed.length - 1]}`;
}

function maskContact(contact?: string): string | undefined {
  if (!contact) return undefined;
  const digits = contact.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-****-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-***-${digits.slice(6)}`;
  }
  if (contact.includes("-")) {
    const parts = contact.split("-");
    if (parts.length === 3) {
      return `${parts[0]}-****-${parts[2]}`;
    }
  }
  return contact;
}

export async function insertLostFoundItem(item: Omit<LostFoundItem, "id" | "createdAt" | "status">): Promise<LostFoundItem> {
  const newItem: LostFoundItem = {
    ...item,
    writerName: maskName(item.writerName),
    contact: maskContact(item.contact),
    id: `lf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status: item.type === "습득" ? "보관중" : "접수",
    createdAt: new Date().toISOString(),
  };

  inMemoryItems = [newItem, ...inMemoryItems];
  return newItem;
}

export async function deleteLostFoundItem(id: string, password?: string): Promise<boolean> {
  const target = inMemoryItems.find((i) => i.id === id);
  if (!target) return false;

  // 비밀번호가 설정된 게시물인 경우 확인
  if (target.password && target.password !== password) {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }

  inMemoryItems = inMemoryItems.filter((i) => i.id !== id);
  return true;
}
