<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## 모바일 웹 (필수 고려)

이 사이트는 **데스크톱과 모바일을 동시에** 대상으로 한다. 새 UI·레이아웃·스타일을 넣을 때마다 아래를 기본으로 따른다.

- **레이아웃:** 작은 화면(약 320~430px)부터 생각하고, Tailwind는 `sm:` / `md:` / `lg:` 로 확장한다. 한 줄에 많은 요소를 억지로 넣지 말고, 좁을 때는 **세로 스택·줄바꿈·스크롤 영역**을 우선 검토한다.
- **넘침:** 가로 스크롤이 생기지 않게 `min-w-0`, `max-w-full`, `overflow-x-hidden`(필요한 구간만) 등을 습관적으로 맞춘다. `flex` 자식이 잘리지 않게 할 것.
- **터치:** 버튼·탭·링크는 **충분한 탭 영역**(대략 44×44px 수준)과 `touch-action`이 과하게 방해되지 않게 한다.
- **타이포·여백:** 모바일에서 제목·패딩이 과하지 않게 `text-*`, `px-*`, `py-*` 를 브레이크포인트별로 조정한다.
- **검증:** 변경 후 **좁은 뷰포트**(개발자 도구 기기 모드 또는 실제 폰)에서 주요 플로우를 한 번씩 본다.

루트 `layout`의 `viewport` 설정과 전역 `body` 클래스는 **모바일 기준 레이아웃**에 쓰이므로 제거·약화하지 않는다.
