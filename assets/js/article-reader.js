/* ============================================
   文章內頁 — 從 Firebase 讀取單篇文章
   檔案位置：assets/js/article-reader.js
   ============================================ */

import { db } from "./firebase-config.js";
import { doc, getDoc, collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function loadArticle() {

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const loading = document.getElementById('article-loading');
  const content = document.getElementById('article-content');
  const notfound = document.getElementById('article-notfound');

  if (!id) {
    loading.style.display = 'none';
    notfound.style.display = 'block';
    return;
  }

  try {
    const docRef = doc(db, 'articles', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      loading.style.display = 'none';
      notfound.style.display = 'block';
      return;
    }

    const data = docSnap.data();

    // 填入標題
    document.getElementById('article-title').textContent = data.title || '';
    document.title = (data.title || '文章') + ' | 楊佳叡醫師';

    // 填入日期
    document.getElementById('article-date').textContent = data.date || '';

    // 填入標籤
    const tags = data.tags || [];
    document.getElementById('article-tags').innerHTML =
      tags.map(tag => `<span class="card-tag">#${tag}</span>`).join('');

    // 填入封面圖
    if (data.coverUrl) {
      document.getElementById('article-cover-wrapper').innerHTML = `
        <img src="${data.coverUrl}" alt="${data.title}" class="article-cover"
          style="width:100%; max-height:500px; object-fit:cover; margin-bottom:40px; border-radius:4px;">
      `;
    }

    // 填入文章內文（支援 bodyBlocks 新格式，向下相容舊 content）
    let articleContent = '';
    if (data.bodyBlocks && Array.isArray(data.bodyBlocks) && data.bodyBlocks.length > 0) {
      // 新格式：依序串接所有區塊
      articleContent = data.bodyBlocks.map(block => block.content || '').join('\n');
    } else {
      // 舊格式：直接使用 content 欄位
      articleContent = data.content || '<p>（文章內容尚未填寫）</p>';
    }
    document.getElementById('article-body').innerHTML = articleContent;

    // 根據文章類型決定返回按鈕的連結
    const backBtn = document.getElementById('back-btn');
    if (data.type === 'case') {
      backBtn.href = '../cases/index.html';
      backBtn.textContent = '← 返回案例分享';
    }

    // 設定分享按鈕
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(data.title || '楊佳叡醫師');
    document.getElementById('share-facebook').href =
      `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    document.getElementById('share-line').href =
      `https://social-plugins.line.me/lineit/share?url=${pageUrl}&text=${pageTitle}`;

    // 隱藏載入中，顯示內容
    loading.style.display = 'none';
    content.style.display = 'block';

    // 載入相關文章（不阻擋主內容顯示）
    loadRelatedArticles(id, data.type, data.tags || []);

  } catch (error) {
    console.error('讀取文章失敗：', error);
    loading.style.display = 'none';
    notfound.style.display = 'block';
  }
}

async function loadRelatedArticles(currentId, type, tags) {
  try {
    const q = query(collection(db, 'articles'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);

    // 過濾：同類型、不是當前文章
    const others = snapshot.docs
      .filter(d => d.id !== currentId && d.data().type === type)
      .map(d => ({ id: d.id, ...d.data() }));

    if (others.length === 0) return;

    // 優先顯示有相同標籤的文章，最多3篇
    const withTag = others.filter(a =>
      (a.tags || []).some(t => tags.includes(t))
    );
    const withoutTag = others.filter(a =>
      !(a.tags || []).some(t => tags.includes(t))
    );
    const related = [...withTag, ...withoutTag].slice(0, 3);

    const section = document.getElementById('related-articles');
    if (!section) return;

    section.innerHTML = `
      <div class="divider" style="margin: 48px 0 32px;"></div>
      <h2 style="text-align:center; margin-bottom:32px; font-size:22px;">相關文章</h2>
      <div class="grid-3">
        ${related.map(a => `
          <a href="article.html?id=${a.id}" class="card">
            ${a.coverUrl
              ? `<img src="${a.coverUrl}" alt="${a.title}" class="card-image" style="width:100%; height:200px; object-fit:cover;">`
              : `<div class="img-placeholder card-image"><span>封面圖</span></div>`
            }
            <div class="card-date">${a.date || ''}</div>
            <div class="card-tags">${(a.tags || []).map(t => `<span class="card-tag">#${t}</span>`).join('')}</div>
            <h3 class="card-title">${a.title || ''}</h3>
            <p class="card-excerpt">${a.excerpt || ''}</p>
            <span class="card-link">閱讀更多 →</span>
          </a>
        `).join('')}
      </div>
    `;
  } catch (err) {
    console.error('載入相關文章失敗：', err);
  }
}

loadArticle();
