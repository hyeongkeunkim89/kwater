// Vercel 서버리스 환경에서도 도면 및 사진이 100% 노출되도록 하는 정적 맵 매니페스트

export const LOCAL_FLOOR_MAPS: Record<string, Record<string, string>> = {
  chungju: {
    "1층": "/chungju-1f.PNG",
    "2층": "/chungju-2f.PNG",
  },
  daecheong: {
    "상설전시": "/daecheong-left-wing.jpg",
    "문화공간": "/daecheong-right-wing.jpg",
  },
  "peace-dam": {
    "전시실": "/peace-dam-exhibit.jpg",
    "기타공간": "/peace-dam-others.jpg",
  },
};

export const LOCAL_FLOOR_PHOTOS_MANIFEST: Record<string, Record<string, string[]>> = {
  chungju: {
    "1층": [
      "/images/floors/chungju/1층/다목적전시실.PNG",
      "/images/floors/chungju/1층/휴게공간.PNG",
    ],
    "2층": [
      "/images/floors/chungju/2층/물전시관.PNG",
      "/images/floors/chungju/2층/로비 기획전시.PNG",
      "/images/floors/chungju/2층/로비 동요동시 체험.PNG",
      "/images/floors/chungju/2층/안내데스크.PNG",
      "/images/floors/chungju/2층/매점.PNG",
    ],
  },
  daecheong: {
    "상설전시": [
      "/images/floors/daecheong/상설전시/상설전시실1.PNG",
      "/images/floors/daecheong/상설전시/상설전시실2.PNG",
      "/images/floors/daecheong/상설전시/상설전시실3.PNG",
      "/images/floors/daecheong/상설전시/전시홀1.PNG",
      "/images/floors/daecheong/상설전시/실감영상실.PNG",
    ],
    "문화공간": [
      "/images/floors/daecheong/문화공간/전시홀2.PNG",
      "/images/floors/daecheong/문화공간/기획전시실.PNG",
      "/images/floors/daecheong/문화공간/휴게전망공간.PNG",
    ],
  },
  "peace-dam": {
    "전시실": [
      "/images/floors/peace-dam/전시실/역사전시구역.PNG",
      "/images/floors/peace-dam/전시실/평화의댐 배경.PNG",
      "/images/floors/peace-dam/전시실/안보체험구역.PNG",
      "/images/floors/peace-dam/전시실/평화의 메세지관.PNG",
    ],
    "기타공간": [
      "/images/floors/peace-dam/기타공간/안내데스크.PNG",
      "/images/floors/peace-dam/기타공간/영상실.PNG",
      "/images/floors/peace-dam/기타공간/매점.PNG",
      "/images/floors/peace-dam/기타공간/식당.PNG",
      "/images/floors/peace-dam/기타공간/휴게공간.PNG",
    ],
  },
};

export const LOCAL_SURROUNDINGS_MANIFEST: Record<string, string[]> = {
  chungju: [
    "/images/surroundings/chungju/맑음전망대.PNG",
    "/images/surroundings/chungju/숲놀이터.PNG",
    "/images/surroundings/chungju/어린이쉼터.PNG",
    "/images/surroundings/chungju/주차장.PNG",
  ],
  daecheong: [],
  "peace-dam": [
    "/images/surroundings/peace-dam/댐벽화.PNG",
    "/images/surroundings/peace-dam/세계평화의 종.PNG",
    "/images/surroundings/peace-dam/스카이워크.PNG",
    "/images/surroundings/peace-dam/주차장.PNG",
  ],
};
