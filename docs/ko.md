# MCP Client Chatbot


[![Local First](https://img.shields.io/badge/Local-First-blueviolet)](#)
[![MCP Supported](https://img.shields.io/badge/MCP-Supported-00c853)](https://modelcontextprotocol.io/introduction)
[![Discord](https://img.shields.io/discord/gCRu69Upnp?label=Discord\&logo=discord\&color=5865F2)](https://discord.gg/gCRu69Upnp)

[![Vercel로 배포하기](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cgoinglove/mcp-client-chatbot&env=OPENAI_API_KEY&env=AUTH_SECRET&envDescription=Learn+more+about+how+to+get+the+API+Keys+for+the+application&envLink=https://github.com/cgoinglove/mcp-client-chatbot/blob/main/.env.example&demo-title=MCP+Client+Chatbot&demo-description=An+Open-Source+MCP+Chatbot+Template+Built+With+Next.js+and+the+AI+SDK+by+Vercel.&products=[{%22type%22:%22integration%22,%22protocol%22:%22storage%22,%22productSlug%22:%22neon%22,%22integrationSlug%22:%22neon%22}])

**MCP Client Chatbot**은 [OpenAI](https://openai.com/), [Anthropic](https://www.anthropic.com/), [Google](https://ai.google.dev/), [Ollama](https://ollama.com/) 등 다양한 AI 모델 제공자를 지원하는 다용도의 챗 인터페이스입니다.
**복잡한 설정 없이 100% 로컬 환경에서 즉시 실행이 가능**하여, 사용자는 개인 컴퓨터나 서버에서 컴퓨팅 자원을 완전히 제어할 수 있습니다.

> [Vercel AI SDK](https://sdk.vercel.ai)와 [Next.js](https://nextjs.org/) 기반으로 제작되었으며, [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction)을 활용해 외부 도구들을 자연스럽게 통합합니다.

**🌟 오픈소스 프로젝트**
MCP Client Chatbot은 100% 커뮤니티 주도형 오픈소스 프로젝트입니다.

---

## 목차

- [MCP Client Chatbot](#mcp-client-chatbot)
  - [목차](#목차)
  - [Demo](#demo)
    - [🧩 Playwright MCP로 브라우저 자동화](#-playwright-mcp로-브라우저-자동화)
    - [⚡️ 툴 멘션 (`@`)](#️-툴-멘션-)
    - [🔌 MCP 서버 추가](#-mcp-서버-추가)
    - [🛠️ 독립 툴 테스트](#️-독립-툴-테스트)
    - [📊 차트 도구 내장](#-차트-도구-내장)
  - [✨ 주요 기능](#-주요-기능)
    - [로컬 빠른 시작 🚀](#로컬-빠른-시작-)
    - [Docker Compose 버전 빠른 시작 🐳](#docker-compose-버전-빠른-시작-)
    - [환경 변수 설정](#환경-변수-설정)
    - [MCP 서버 설정](#mcp-서버-설정)
  - [💡 팁 \& 가이드](#-팁--가이드)
  - [🗺️ 향후 로드맵](#️-향후-로드맵)
    - [🚀 배포 및 호스팅 ✅](#-배포-및-호스팅-)
    - [🗣️ 음성 및 실시간 채팅](#️-음성-및-실시간-채팅)
    - [📎 파일 및 이미지](#-파일-및-이미지)
    - [🔄 MCP 워크플로우](#-mcp-워크플로우)
    - [🛠️ 기본 도구 및 UX](#️-기본-도구-및-ux)
    - [💻 코드 작성 (Daytona 연동)](#-코드-작성-daytona-연동)
  - [🙌 기여하기](#-기여하기)
  - [💬 Discord 참여하기](#-discord-참여하기)

---

## Demo

간단한 예제를 통해 MCP 클라이언트 챗봇의 활용을 확인해보세요:

### 🧩 Playwright MCP로 브라우저 자동화

![playwright-demo](./images/preview-1.gif)

**예시:** Microsoft의 [playwright-mcp](https://github.com/microsoft/playwright-mcp) 도구를 사용하여 브라우저 제어

```prompt
GitHub에 접속해서 cgoinglove 프로필로 이동해줘.
mcp-client-chatbot 프로젝트를 열고,
README.md 파일을 클릭한 뒤,
브라우저를 닫아줘.
마지막으로 패키지 설치 방법을 알려줘.
```

---

### ⚡️ 툴 멘션 (`@`)

![mention](https://github.com/user-attachments/assets/1a80dd48-1d95-4938-b0d8-431c02ec2a53)

채팅 중 `@툴이름`으로 MCP 툴을 빠르게 호출할 수 있습니다.
기억할 필요 없이 `@`만 입력하면 자동 추천 리스트가 뜹니다.

또한 **툴 호출 모드**도 선택할 수 있습니다:

* **Auto:** 모델이 자동으로 툴을 호출
* **Manual:** 호출 전 사용자에게 확인 요청
* **None:** 툴 호출 비활성화

`⌘P`로 언제든지 모드를 전환할 수 있습니다.

---

### 🔌 MCP 서버 추가

![mcp-server-install](https://github.com/user-attachments/assets/c71fd58d-b16e-4517-85b3-160685a88e38)

UI를 통해 새로운 MCP 서버를 간편하게 추가할 수 있으며, 앱을 재시작하지 않아도 바로 사용 가능합니다.

---

### 🛠️ 독립 툴 테스트

![tool-test](https://github.com/user-attachments/assets/980dd645-333f-4e5c-8ac9-3dc59db19e14)

채팅 흐름과 관계없이 MCP 툴을 독립적으로 테스트하여 개발 및 디버깅이 쉬워집니다.

---

### 📊 차트 도구 내장

![May-04-2025 01-55-04](https://github.com/user-attachments/assets/7bf9d895-9023-44b1-b7f2-426ae4d7d643)

자연어 프롬프트로 파이, 막대, 꺾은선형 차트를 생성해 대화 중 데이터를 시각화할 수 있습니다.

---

## ✨ 주요 기능

* **💻 100% 로컬 실행:** 복잡한 설정 없이 내 컴퓨터에서 즉시 실행
* **🤖 다양한 AI 모델 지원:** OpenAI, Anthropic, Google AI, Ollama 등 유연하게 전환 가능
* **🛠️ MCP 통합:** 외부 툴을 대화에 자연스럽게 통합 (예: 브라우저 자동화, DB 조작)
* **🚀 독립 툴 테스터:** 채팅과 별개로 MCP 툴을 독립 실행
* **💬 직관적 툴 호출 UX:** `@` 호출과 Auto/Manual/None 모드 전환
* **⚙️ 쉬운 MCP 설정:** UI 또는 `.mcp-config.json` 파일로 설정
* **📄 마크다운 UI:** 깔끔한 마크다운 기반 인터페이스
* **🧩 커스텀 MCP 서버:** 내장 MCP 서버 수정 또는 새로 생성 가능
* **📊 차트 도구 내장:** 대화형 차트 시각화
* **🛫 Vercel 배포 지원:** 쉽게 접근 가능한 서버리스 배포
* **🏃 Docker Compose 지원:** 빌드 후 바로 실행 가능

> 이 프로젝트는 [pnpm](https://pnpm.io/)을 기본 패키지 매니저로 사용합니다.

```bash
# pnpm이 없다면:
npm install -g pnpm
```

---

### 로컬 빠른 시작 🚀

```bash
# 1. 의존성 설치
pnpm i

# 2. 환경변수 파일 생성 및 값 입력
pnpm initial:env # postinstall에서 자동 실행되므로 대부분 생략 가능

# 3. PostgreSQL이 실행 중이라면 이 단계는 생략
pnpm docker:pg

# 4. 데이터베이스 마이그레이션
pnpm db:migrate

# 5. 개발 서버 실행
pnpm dev

# 6. (선택) 로컬 프로덕션 테스트 실행
pnpm build:local && pnpm start
```

---

### Docker Compose 버전 빠른 시작 🐳

```bash
# 1. 의존성 설치
pnpm i

# 2. 환경 변수 파일 생성 및 값 입력
pnpm initial:env

# 3. Docker Compose로 전체 서비스 (PostgreSQL 포함) 실행
pnpm docker-compose:up
```

`http://localhost:3000`에서 접속할 수 있습니다.

---

### 환경 변수 설정

`pnpm i` 명령은 `.env` 파일을 생성합니다. 아래와 같이 필요한 API 키를 입력하세요:

```dotenv
GOOGLE_GENERATIVE_AI_API_KEY=****
OPENAI_API_KEY=****
ANTHROPIC_API_KEY=****
AUTH_SECRET=
POSTGRES_URL=
```

`AUTH_SECRET`은 `pnpx auth secret` 명령으로 생성하세요.

---

### MCP 서버 설정

MCP 툴을 연결하는 방법은 다음과 같습니다:

1. **UI 설정:** [http://localhost:3000/mcp](http://localhost:3000/mcp) 에서 직접 설정
2. **커스텀 로직 작성:** `./custom-mcp-server/index.ts` 수정
   (Vercel 및 Docker 환경에서는 실행되지 않습니다)

---

## 💡 팁 & 가이드

* [프로젝트 기능 + MCP 서버 연동](./tips-guides/project_with_mcp.md)
* [Docker 호스팅 가이드](./tips-guides/docker.md)
* [Vercel 배포 가이드](./tips-guides/vercel.md)

---

## 🗺️ 향후 로드맵

### 🚀 배포 및 호스팅 ✅

* Docker Compose로 간편한 자체 호스팅 ✅
* Vercel 배포 지원 (MCP Server는 SSE only) ✅

### 🗣️ 음성 및 실시간 채팅

* MCP 서버 기반 실시간 음성 대화

### 📎 파일 및 이미지

* 파일 업로드 및 이미지 생성
* 멀티모달 대화 지원

### 🔄 MCP 워크플로우

* MCP 서버 기반 워크플로우 자동화

### 🛠️ 기본 도구 및 UX

* 공동 문서 편집 (OpenAI Canvas 스타일)
* RAG (검색 기반 생성)
* MCP 없이도 쓸 수 있는 유용한 내장 툴

### 💻 코드 작성 (Daytona 연동)

* 클라우드 환경에서 Daytona를 통한 AI 코드 작성/편집/실행

💡 새로운 기능 제안이나 요청은 [이슈 생성](https://github.com/cgoinglove/mcp-client-chatbot/issues)을 통해 알려주세요!

---

## 🙌 기여하기

버그 리포트, 기능 제안, 코드 개선 등 모든 기여를 환영합니다!
함께 최고의 로컬 AI 비서를 만들어봐요 🚀

---

## 💬 Discord 참여하기

[![Discord](https://img.shields.io/discord/gCRu69Upnp?label=Discord\&logo=discord\&color=5865F2)](https://discord.gg/gCRu69Upnp)

커뮤니티와 소통하고, 질문하고, 도움을 받을 수 있는 공식 Discord 서버에 참여하세요!
