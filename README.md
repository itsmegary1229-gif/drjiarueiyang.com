# 楊佳叡醫師個人專業網站

整形外科專科醫師楊佳叡的個人形象網站，包含醫師介紹、知識專欄、案例分享、門診掛號等頁面。

## 檔案結構

```
個人網站/
├── index.html              ← 首頁
├── about.html              ← 醫師介紹
├── appointment.html        ← 門診掛號
├── blog/
│   ├── index.html          ← 知識專欄列表
│   └── sample-article.html ← 文章模板（複製此檔新增文章）
├── cases/
│   ├── index.html          ← 案例分享列表
│   └── sample-case.html    ← 案例模板（複製此檔新增案例）
└── assets/
    ├── css/
    │   ├── style.css        ← 全站共用樣式
    │   ├── index.css        ← 首頁專屬樣式
    │   ├── about.css        ← 醫師介紹專屬樣式
    │   ├── blog.css         ← 知識專欄 & 文章頁樣式
    │   ├── cases.css        ← 案例分享樣式
    │   └── appointment.css  ← 門診掛號樣式
    ├── js/
    │   └── main.js          ← 漢堡選單、篩選功能、Lightbox
    └── images/              ← 圖片資源放這裡
```

## 在本地預覽

直接用瀏覽器開啟 `index.html` 即可預覽。也可以使用簡易的本地伺服器：

```bash
# 方法 1：Python（Mac 內建）
cd 個人網站
python3 -m http.server 8000
# 然後開啟瀏覽器前往 http://localhost:8000

# 方法 2：如果有安裝 Node.js
npx serve .
```

## 如何新增文章

1. 複製 `blog/sample-article.html`，重新命名（例如 `blog/eyelid-surgery.html`）
2. 打開新檔案，修改以下內容：
   - `<title>` 標籤裡的文章標題
   - 文章標題（`<h1>` 標籤）
   - 日期、作者、Hashtag 標籤
   - 封面圖片（替換 `img-placeholder` 為 `<img>` 標籤）
   - 文章本文（在 `article-body` 區塊內編寫）
   - 底部相關文章連結
3. 到 `blog/index.html` 新增一張文章卡片，複製現有卡片結構修改即可
4. 到 `index.html` 更新「最新知識專欄」區塊（如需要）

## 如何新增案例

1. 複製 `cases/sample-case.html`，重新命名（例如 `cases/rhinoplasty-001.html`）
2. 修改案例標題、患者背景、術前術後照片、手術說明
3. 到 `cases/index.html` 新增一張案例卡片

## 如何替換照片

目前所有照片位置都用灰色 placeholder 代替。替換方式：

1. 將照片放入 `assets/images/` 資料夾
2. 在 HTML 中找到對應的 `img-placeholder`，將整個 `<div class="img-placeholder">` 替換為：
   ```html
   <img src="assets/images/你的照片檔名.jpg" alt="照片說明文字" loading="lazy">
   ```

### 照片對應表

| 位置 | 建議檔名 | 說明 |
|------|---------|------|
| 首頁 Hero | `doctor-coat-arms-crossed.png` | 白袍去背照（雙手交叉） |
| 首頁「關於醫師」 | `doctor-suit-tie.jpg` | 西裝照 |
| 醫師介紹頁首 | `doctor-suit-pocket.jpg` | 西裝照（雙手插口袋） |
| 證書 1 | `cert-plastic-surgery.jpg` | 整形外科專科證書 |
| 證書 2 | `cert-surgery.jpg` | 外科專科證書 |
| 證書 3 | `cert-hand-surgery.jpg` | 手外科專科證書 |
| 證書 4 | `cert-critical-care.jpg` | 重症專科證書 |
| 門診頁 | `line-qrcode.png` | LINE QR Code |

## 部署到 GitHub Pages

1. 建立 GitHub 帳號（如果還沒有）
2. 建立新的 Repository，命名為 `drjiarueiyang.com`（或任意名稱）
3. 將所有檔案上傳到 Repository
4. 到 Repository 的 Settings → Pages → Source 選擇 `main` branch
5. 設定自訂網域 `drjiarueiyang.com`（在 Pages 設定中填入）
6. 在網域註冊商設定 DNS：新增 CNAME 記錄指向 `你的帳號.github.io`

## 技術說明

- 純靜態網站，不需要任何建構工具或伺服器
- 字型透過 Google Fonts CDN 載入
- 支援桌機（≥1024px）、平板（768–1023px）、手機（≤767px）三種版面
- Hashtag 篩選功能使用原生 JavaScript，不需額外套件
