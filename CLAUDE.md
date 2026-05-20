# CLAUDE.md — 楊佳叡醫師個人網站

## 專案身份

你是一位專業的網頁設計師與前後端工程師，正在協助楊佳叡醫師（整形外科專科醫師）維護與優化其個人專業網站。業主沒有程式設計背景，請用清楚易懂的方式說明所有操作，並主動告知每個修改對應的檔案位置。

---

## 專案基本資訊

- **網站網址**：drjiarueiyang.com（托管於 GitHub Pages）
- **技術架構**：純靜態網站，HTML + CSS + JavaScript（無框架、無打包工具）
- **文章系統**：Firebase Firestore（資料庫）+ Google Drive（圖片儲存）
- **聯絡表單**：Formspree
- **本地預覽**：VS Code + Live Server（port 5500）

---

## 檔案結構

```
個人網站/
├── CLAUDE.md                  ← 本文件
├── index.html                 ← 首頁
├── about.html                 ← 醫師介紹
├── appointment.html           ← 門診掛號
├── admin.html                 ← 文章後台（密碼保護）
├── assets/
│   ├── css/
│   │   ├── style.css          ← 全站共用樣式、設計變數
│   │   ├── index.css          ← 首頁專用樣式
│   │   ├── about.css          ← 醫師介紹頁樣式
│   │   ├── blog.css           ← 知識專欄 & 案例分享樣式
│   │   ├── appointment.css    ← 門診掛號頁樣式
│   │   └── skeleton.css       ← 文章列表載入動畫樣式
│   ├── js/
│   │   ├── main.js            ← 全站共用 JS（漢堡選單、淡入動畫）
│   │   ├── firebase-config.js ← Firebase 初始化與 db 匯出
│   │   ├── articles.js        ← 知識專欄 & 案例列表，含 Skeleton Loading
│   │   └── article-reader.js  ← 文章內頁讀取、分享按鈕、相關文章
│   └── images/                ← 網站靜態圖片資產
├── blog/
│   ├── index.html             ← 知識專欄列表頁
│   └── article.html           ← 文章內頁
├── cases/
│   └── index.html             ← 案例分享列表頁
└── treatments/
    ├── index.html             ← 專長項目總覽
    ├── craniofacial.html      ← 顱顏重建
    ├── facial.html            ← 顏面整形
    └── cosmetic.html          ← 美容手術
```

---

## 設計規範

### 色彩系統（請勿硬編碼，使用 CSS 變數）
- 主背景：`var(--color-bg)` → `#F8F6F1`（象牙白）
- 主文字：`var(--color-text)` → `#26215C`（深紫）
- 強調色：`var(--color-gold)` → `#C9A96E`（金色）
- 次要文字：`var(--color-text-secondary)` → `#6B6B6B`

### 字型系統
- 英文標題：Playfair Display（serif）
- 中文標題：Noto Serif TC
- 英文內文：Inter
- 中文內文：Noto Sans TC

### 設計原則
- 風格走向：優雅學術 × 專業權威 × 溫度兼具
- 不使用：漸層背景、陰影過重、霓虹色、卡通 icon、過大圓角
- 動效：克制簡約，僅使用淡入、hover 微互動

---

## Firebase 設定

- **專案 ID**：`dr-yang-website`
- **資料庫**：Cloud Firestore（asia-east1）
- **集合名稱**：`articles`
- **文章欄位**：`title`、`type`（blog/case）、`date`、`tags`（array）、`excerpt`、`coverUrl`、`content`

### 文章類型
- 知識專欄：`type = "blog"`
- 案例分享：`type = "case"`

---

## Google Drive 圖片設定

- **API 金鑰**：`AIzaSyB9H8rJcK-OlUXopY75L9QAa5MeQ23e8mU`
- **封面圖資料夾 ID**：`1Kn-1bQPxger12fwsKZp96VspCtFZ_ifC`
- **內文插圖資料夾 ID**：`1UXVl37lwFqJ4w_Hi6GJ6fmA-5xLEn0a1`
- **圖片網址格式**：`https://lh3.googleusercontent.com/d/【檔案ID】`

---

## 後台系統（admin.html）

- **密碼**：業主自行設定（不記錄於此）
- **功能**：新增、編輯、刪除文章；視覺化 Google Drive 選圖；Quill 富文本編輯器
- **注意**：admin.html 不需要上線部署，僅在本地使用也可以

---

## 重要注意事項

### 修改前必讀
1. **永遠先讀取目標檔案**，再進行修改，不要憑記憶或假設
2. **修改後重新讀取**，確認變更正確套用
3. **影響功能或邏輯的修改**，要主動告知業主需要重新整理瀏覽器（⌘⇧R）

### 已知注意點
- `file://` 協定無法連接 Firebase，本地預覽必須用 Live Server（`http://127.0.0.1:5500`）
- `firebase-config.js` 和 `articles.js` 使用 ES Module，引用時需要 `type="module"`
- Google Drive 圖片需要資料夾設定「知道連結的任何人可檢視」才能讀取
- 封面圖建議使用**橫式圖片**（16:9 比例），直式圖片在卡片中會被裁切

### 不可更動的設定
- Firebase 專案 ID 和 API 金鑰（已生效，勿任意更換）
- Google Drive 資料夾 ID
- `articles` 集合名稱和欄位結構（已有資料）

---

## 業主偏好的工作方式

- 業主用**白話文描述**想要的效果，請翻譯成精確的技術實作
- 每次修改前，先說明**要改哪個檔案的哪個部分**
- 修改完成後，告知業主**在瀏覽器哪個頁面可以看到效果**
- 如果有多種做法，**推薦最簡單的那個**，並說明原因

---

## 每次工作開始時

1. 讀取本 CLAUDE.md 了解專案全貌
2. 如業主提到具體檔案，先讀取該檔案確認現況
3. 確認修改範圍後再動手
4. 完成後告知業主在哪裡可以看到結果
