/* ============================================
   知識專欄 & 案例分享 — 從 Firebase 讀取文章
   檔案位置：assets/js/articles.js
   ============================================ */

import { db } from "./firebase-config.js";
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ---------- Skeleton Loading ---------- */

// 產生一張骨架卡片（灰色佔位符）
function createSkeletonCard() {
  return `
    <div class="card skeleton-card">
      <div class="skeleton skeleton-image"></div>
      <div class="skeleton skeleton-date"></div>
      <div class="skeleton skeleton-tag"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-title" style="width:70%"></div>
      <div class="skeleton skeleton-excerpt"></div>
      <div class="skeleton skeleton-excerpt" style="width:80%"></div>
    </div>
  `;
}

// 顯示 6 張骨架卡片
function showSkeleton(grid) {
  grid.innerHTML = Array(6).fill(createSkeletonCard()).join('');
}

/* ---------- 工具函式 ---------- */

function getPageType() {
  const path = window.location.pathname;
  if (path.includes('/blog/')) return 'blog';
  if (path.includes('/cases/')) return 'case';
  return null;
}

function createCardHTML(doc) {
  const data = doc.data();
  const id = doc.id;
  const title = data.title || '（未命名文章）';
  const excerpt = data.excerpt || '';
  const date = data.date || '';
  const tags = data.tags || [];
  const coverUrl = data.coverUrl || '';

  const tagsHTML = tags.map(tag => `<span class="card-tag">#${tag}</span>`).join('');
  const coverHTML = coverUrl
    ? `<img src="${coverUrl}" alt="${title}" class="card-image" loading="lazy" style="width:100%; height:200px; object-fit:cover;">`
    : `<div class="img-placeholder card-image"><span>文章封面圖</span></div>`;
  const dataTags = tags.join(',');

  return `
    <a href="article.html?id=${id}" class="card" data-tags="${dataTags}">
      ${coverHTML}
      <div class="card-date">${date}</div>
      <div class="card-tags">${tagsHTML}</div>
      <h3 class="card-title">${title}</h3>
      <p class="card-excerpt">${excerpt}</p>
      <span class="card-link">閱讀更多 →</span>
    </a>
  `;
}

/* ---------- 主程式 ---------- */

async function loadArticles() {
  const pageType = getPageType();
  if (!pageType) return;

  const grid = document.querySelector('.article-grid');
  if (!grid) return;

  // 顯示骨架卡片
  showSkeleton(grid);

  try {
    const q = query(collection(db, 'articles'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.filter(doc => doc.data().type === pageType);

    if (docs.length === 0) {
      grid.innerHTML = '<p style="text-align:center; color:#999; padding: 40px 0; grid-column:1/-1;">目前尚無文章。</p>';
      return;
    }

    // 淡出骨架，淡入真實卡片
    grid.style.opacity = '0';
    grid.innerHTML = docs.map(createCardHTML).join('');
    requestAnimationFrame(() => {
      grid.style.transition = 'opacity 0.3s ease';
      grid.style.opacity = '1';
    });

    rebindFilter();

  } catch (error) {
    console.error('讀取文章失敗：', error);
    grid.innerHTML = '<p style="text-align:center; color:#999; padding: 40px 0; grid-column:1/-1;">讀取失敗，請稍後再試。</p>';
  }
}

/* ---------- 重新綁定篩選功能 ---------- */

function rebindFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('[data-tags]');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.getAttribute('data-filter');
      filterItems.forEach(function (item) {
        if (tag === 'all') {
          item.style.display = '';
        } else {
          const tags = item.getAttribute('data-tags').split(',');
          item.style.display = tags.includes(tag) ? '' : 'none';
        }
      });
    });
  });
}

loadArticles();


/* ---------- 工具函式 ---------- */

// 判斷目前在哪個頁面（blog 或 cases）
function getPageType() {
  const path = window.location.pathname;
  if (path.includes('/blog/')) return 'blog';
  if (path.includes('/cases/')) return 'case';
  return null;
}

// 產生一張文章卡片的 HTML
function createCardHTML(doc) {
  const data = doc.data();
  const id = doc.id;
  const title = data.title || '（未命名文章）';
  const excerpt = data.excerpt || '';
  const date = data.date || '';
  const tags = data.tags || [];
  const coverUrl = data.coverUrl || '';

  // 標籤 HTML
  const tagsHTML = tags.map(tag => `<span class="card-tag">#${tag}</span>`).join('');

  // 封面圖：有圖片就顯示，沒有就顯示佔位符
  const coverHTML = coverUrl
    ? `<img src="${coverUrl}" alt="${title}" class="card-image" loading="lazy" style="width:100%; height:200px; object-fit:cover;">`
    : `<div class="img-placeholder card-image"><span>文章封面圖</span></div>`;

  // data-tags 供篩選功能使用
  const dataTags = tags.join(',');

  return `
    <a href="article.html?id=${id}" class="card" data-tags="${dataTags}">
      ${coverHTML}
      <div class="card-date">${date}</div>
      <div class="card-tags">${tagsHTML}</div>
      <h3 class="card-title">${title}</h3>
      <p class="card-excerpt">${excerpt}</p>
      <span class="card-link">閱讀更多 →</span>
    </a>
  `;
}

/* ---------- 主程式：讀取並顯示文章 ---------- */

async function loadArticles() {
  const pageType = getPageType();
  if (!pageType) return;

  const grid = document.querySelector('.article-grid');
  if (!grid) return;

  // 顯示讀取中
  grid.innerHTML = '<p style="text-align:center; color:#999; padding: 40px 0;">載入中⋯⋯</p>';

  try {
    // 從 Firebase 讀取文章，按日期排序（最新在前）
    const q = query(collection(db, 'articles'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);

    // 過濾出符合目前頁面的文章（blog 或 case）
    const docs = snapshot.docs.filter(doc => doc.data().type === pageType);

    if (docs.length === 0) {
      grid.innerHTML = '<p style="text-align:center; color:#999; padding: 40px 0;">目前尚無文章。</p>';
      return;
    }

    // 產生所有卡片
    grid.innerHTML = docs.map(createCardHTML).join('');

    // 重新套用篩選功能（因為是動態產生的內容）
    rebindFilter();

  } catch (error) {
    console.error('讀取文章失敗：', error);
    grid.innerHTML = '<p style="text-align:center; color:#999; padding: 40px 0;">讀取失敗，請稍後再試。</p>';
  }
}

/* ---------- 重新綁定篩選功能 ---------- */

function rebindFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('[data-tags]');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.getAttribute('data-filter');
      filterItems.forEach(function (item) {
        if (tag === 'all') {
          item.style.display = '';
        } else {
          const tags = item.getAttribute('data-tags').split(',');
          item.style.display = tags.includes(tag) ? '' : 'none';
        }
      });
    });
  });
}

// 頁面載入後執行
loadArticles();
