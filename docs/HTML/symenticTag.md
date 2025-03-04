## 🏗️ HTML 시멘틱 태그 설명

### 🔹 1. 레이아웃 관련 태그

이 태그들은 문서의 주요 구조를 정의하는 데 사용돼.

#### ✅ `<header>`

- 문서 또는 특정 섹션의 **머리글**을 정의하는 태그.
- 일반적으로 **로고, 사이트 제목, 내비게이션 메뉴** 등이 포함됨.
- 한 개의 페이지에 여러 개의 `<header>` 태그를 사용할 수 있음.

📌 **예제**

```html
<header>
  <h1>My Website</h1>
  <nav>
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
    </ul>
  </nav>
</header>
```

#### ✅ `<nav>`

- **내비게이션(메뉴)를 포함**하는 태그.
- 보통 **링크 목록(`<ul>`)**을 포함함.  
  📌 **예제**

```html
<nav>
  <ul>
    <li><a href="#">Home</a></li>
    <li><a href="#">Services</a></li>
  </ul>
</nav>
```

#### ✅ `<main>`

- 문서의 **주요 콘텐츠**를 포함하는 태그.
- `<header>`, `<footer>`, `<aside>` 같은 태그와 구분됨.
- **페이지당 한 번만 사용 가능**.  
  📌 **예제**

```html
<main>
  <h2>Main Content</h2>
  <p>This is the main section of the page.</p>
</main>
```

#### ✅ `<article>`

- 독립적인 콘텐츠 블록을 나타냄.
- 뉴스 기사, 블로그 포스트, 사용자 리뷰 등 **단독으로 존재할 수 있는 콘텐츠**에 적합함.  
  📌 **예제**

```html
<article>
  <h2>Blog Post Title</h2>
  <p>This is a blog post content.</p>
</article>
```

#### ✅ `<section>`

- 문서의 논리적인 **섹션을 그룹화**하는 태그.
- `<article>`보다는 덜 독립적인 내용을 포함함.  
  📌 **예제**

```html
<section>
  <h2>About Us</h2>
  <p>We are a tech company.</p>
</section>
```

#### ✅ `<aside>`

- 본문과 **별개로 추가적인 정보(사이드바, 광고 등)**를 제공하는 태그.  
  📌 **예제**

```html
<aside>
  <h3>Related Articles</h3>
  <ul>
    <li><a href="#">Article 1</a></li>
    <li><a href="#">Article 2</a></li>
  </ul>
</aside>
```

#### ✅ `<footer>`

- 문서 또는 특정 섹션의 **바닥글**을 정의하는 태그.
- 저작권 정보, 연락처, 사이트맵 등이 포함됨.  
  📌 **예제**

```html
<footer>
  <p>&copy; 2025 My Website</p>
</footer>
```

---

## 🖼️ 미디어 관련 태그

#### ✅ `<figure>`

- **이미지, 도표, 코드 블록** 같은 **독립적인 콘텐츠**를 담는 태그.
- `<figcaption>`과 함께 사용하여 설명을 포함할 수 있음.  
  📌 **예제**

```html
<figure>
  <img src="image.jpg" alt="A beautiful view" />
  <figcaption>A beautiful view of nature.</figcaption>
</figure>
```

#### ✅ `<figcaption>`

- `<figure>` 내의 콘텐츠에 대한 **설명을 제공**하는 태그.
  📌 **예제**

```html
<figure>
  <img src="chart.png" alt="Sales chart" />
  <figcaption>Quarterly Sales Report</figcaption>
</figure>
```

---

## 🔠 텍스트 관련 태그

#### ✅ `<mark>`

- 강조를 위해 **형광펜 효과**를 주는 태그.
  📌 **예제**

```html
<p>The most important keyword is <mark>SEO</mark>.</p>
```

➡ **출력:** The most important keyword is **SEO**. (배경색이 강조됨)

#### ✅ `<time>`

- **날짜 및 시간 정보를 명확하게 제공**하는 태그.
- 검색 엔진과 브라우저가 날짜 정보를 정확하게 해석할 수 있음.  
  📌 **예제**

```html
<p>Published on <time datetime="2025-03-04">March 4, 2025</time></p>
```

---

## 🎯 정리

| 태그           | 설명            | 주요 사용 예시               |
| -------------- | --------------- | ---------------------------- |
| `<header>`     | 머리글          | 로고, 사이트 제목, 메뉴 포함 |
| `<nav>`        | 내비게이션      | 메뉴, 링크 목록              |
| `<main>`       | 주요 콘텐츠     | 페이지의 핵심 내용           |
| `<article>`    | 독립적인 콘텐츠 | 블로그 글, 뉴스 기사         |
| `<section>`    | 논리적 구역     | 서비스 설명, 카테고리 그룹   |
| `<aside>`      | 보조 정보       | 사이드바, 광고               |
| `<footer>`     | 바닥글          | 저작권, 연락처               |
| `<figure>`     | 미디어 콘텐츠   | 이미지, 그래프, 코드 블록    |
| `<figcaption>` | 미디어 설명     | 이미지 캡션                  |
| `<mark>`       | 강조 표시       | 키워드 강조                  |
| `<time>`       | 날짜, 시간      | 게시일, 이벤트 일정          |

s
