# Claude Code Handoff — 全站 OG 標籤補齊 + Favicon + 文章頁 SEO 修復

**建立日期：2026-07-09**
**執行前提：** 楊醫師已將以下三個檔案放入 repo **根目錄**（與 index.html 同層）：
- `favicon.svg`
- `favicon.ico`
- `apple-touch-icon.png`

若檔案尚未就位，請先提醒楊醫師放入後再繼續。

**本次修改全部為結構性 HTML/JS 變更，完成後需要 `git push` 才會生效。**

---

## 任務總覽

| # | 任務 | 檔案 |
|---|---|---|
| 1 | 全站加入 favicon 標籤 | 全部 12 個 HTML 頁面 |
| 2 | 八個靜態頁補 og:image / og:url / og:type | about、appointment、blog/index、treatments 全部 5 頁 |
| 3 | article.html 靜態 head 補預設 meta + OG fallback | blog/article.html |
| 4 | article-reader.js 動態注入 meta / canonical / OG / JSON-LD | assets/js/article-reader.js |

**注意：`index.html` 的 OG 標籤已齊全（og:image / og:url / og:type 都有），任務 2 不要動首頁的 OG 區塊，只需加 favicon 標籤。**

---

## 任務 1：全站 favicon 標籤

**適用檔案（12 個）：**
`index.html`、`about.html`、`appointment.html`、`admin.html`、`blog/index.html`、`blog/article.html`、`treatments/index.html`、`treatments/craniofacial.html`、`treatments/wound.html`、`treatments/contouring.html`、`treatments/rejuvenation.html`、`cases/index.html`

在每頁 `<head>` 內、`<title>` 標籤的**下一行**插入（使用根絕對路徑，所有層級通用，請勿改成相對路徑）：

```html
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta name="theme-color" content="#26215C">
```

---

## 任務 2：八個靜態頁補齊 OG 標籤

以下每一頁的 head 結構相同：og:title → og:description → canonical。請在 **og:description 那一行之後、canonical 之前**插入三行。`og:url` 的值 = 該頁既有 canonical 的值（逐頁不同，已列於下表）。

插入模板（`【URL】`逐頁替換）：

```html
  <meta property="og:image" content="https://drjiarueiyang.com/assets/images/og-image.jpg">
  <meta property="og:url" content="【URL】">
  <meta property="og:type" content="website">
```

| 檔案 | 【URL】 |
|---|---|
| `about.html` | `https://drjiarueiyang.com/about.html` |
| `appointment.html` | `https://drjiarueiyang.com/appointment.html` |
| `blog/index.html` | `https://drjiarueiyang.com/blog/index.html` |
| `treatments/index.html` | `https://drjiarueiyang.com/treatments/index.html` |
| `treatments/craniofacial.html` | `https://drjiarueiyang.com/treatments/craniofacial.html` |
| `treatments/wound.html` | `https://drjiarueiyang.com/treatments/wound.html` |
| `treatments/contouring.html` | `https://drjiarueiyang.com/treatments/contouring.html` |
| `treatments/rejuvenation.html` | `https://drjiarueiyang.com/treatments/rejuvenation.html` |

⚠️ `blog/index.html` 目前沒有 og:url 但有 canonical（`https://drjiarueiyang.com/blog/index.html`），比照辦理。
⚠️ `index.html` 已齊全，跳過。

---

## 任務 3：blog/article.html 靜態 head 補強

目前 article.html 的 head 開頭為：

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="author" content="Jia-Ruei Yang, MD">
  <title>文章 | 楊佳叡醫師</title>
```

請在 `<meta name="author" ...>` 之後、`<title>` 之前插入（這些是給 FB/LINE 爬蟲的 fallback，因為社群爬蟲不執行 JS）：

```html
  <meta name="description" content="楊佳叡醫師的知識專欄文章 — 整形外科衛教知識分享">
  <meta property="og:title" content="知識專欄 | 楊佳叡醫師">
  <meta property="og:description" content="整形外科醫療專業知識分享">
  <meta property="og:image" content="https://drjiarueiyang.com/assets/images/og-image.jpg">
  <meta property="og:type" content="article">
```

（favicon 標籤依任務 1 另外加在 `<title>` 之後。）

---

## 任務 4：article-reader.js 動態 SEO 注入

**檔案：** `assets/js/article-reader.js`

現況：第 34 行取得 `const data = docSnap.data();`，第 37–38 行已設定 `#article-title` 與 `document.title`。

請在 `document.title = ...` 那一行**之後**插入以下程式碼（Googlebot 會執行 JS，這段服務搜尋引擎）：

```javascript
    // === 動態 SEO meta（Googlebot 會渲染 JS；FB/LINE 走 head 靜態 fallback）===
    const setMeta = (attr, key, value) => {
      if (!value) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    const pageUrl = `https://drjiarueiyang.com/blog/article.html?id=${id}`;

    setMeta('name', 'description', data.excerpt || '');
    setMeta('property', 'og:title', (data.title || '文章') + ' | 楊佳叡醫師');
    setMeta('property', 'og:description', data.excerpt || '');
    setMeta('property', 'og:url', pageUrl);
    if (data.coverUrl) setMeta('property', 'og:image', data.coverUrl);

    // canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageUrl);

    // Article 結構化資料
    const ldJson = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": data.title || '',
      "description": data.excerpt || '',
      "datePublished": data.date || '',
      "author": {
        "@type": "Person",
        "name": "楊佳叡醫師",
        "url": "https://drjiarueiyang.com/about.html"
      }
    };
    if (data.coverUrl) ldJson.image = data.coverUrl;
    const ldScript = document.createElement('script');
    ldScript.type = 'application/ld+json';
    ldScript.textContent = JSON.stringify(ldJson);
    document.head.appendChild(ldScript);
    // === 動態 SEO meta 結束 ===
```

⚠️ 注意變數名稱：文章 ID 變數請以檔案實際命名為準（從 `URLSearchParams` 取出的那個變數，本文件假設為 `id`；若實際是其他名稱請對應調整）。

---

## 建議 commit 訊息

```
feat: 全站 SEO 補強 — favicon、OG 標籤補齊、文章頁動態 meta 與結構化資料

- 全站 12 頁加入 favicon（svg/ico/apple-touch-icon）與 theme-color
- 8 個靜態頁補 og:image / og:url / og:type
- article.html 加入靜態 meta description 與 OG fallback
- article-reader.js 動態注入 meta description、canonical、OG 標籤與 Article JSON-LD
```

---

## 完成後驗證清單（請楊醫師確認）

1. **favicon**：開啟 https://drjiarueiyang.com ，瀏覽器分頁應出現紫色四芒星（可能需強制重新整理 Ctrl+Shift+R）
2. **手機**：iPhone Safari「加入主畫面」應顯示象牙底紫星圖示
3. **文章頁**：隨便開一篇文章 → 右鍵檢視原始碼看不到動態標籤是正常的，改用「開發者工具 → Elements → head」確認 og:title、canonical、ld+json 已出現
4. **OG 圖**：og-image.jpg 尚未上傳前，分享預覽仍會破圖 — 屬預期行為，待批次 B
5. Search Console 下次爬取後，可觀察文章頁是否開始出現在成效報表

---

## 批次 B（照片到位後，另行執行）

1. 楊醫師將定稿的 `og-image.jpg`（1200×630）放入 `assets/images/`
2. `git push`
3. 到 Facebook Sharing Debugger（https://developers.facebook.com/tools/debug/）輸入 `https://drjiarueiyang.com` 按「再次抓取」清除快取，確認縮圖正常
4. LINE 的快取無工具可清，會在數日內自然更新
