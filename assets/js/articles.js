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
  const category = data.category || '';

  const tagsHTML = tags.map(tag => `<span class="card-tag">#${tag}</span>`).join('');
  const coverHTML = coverUrl
    ? `<img src="${coverUrl}" alt="${title}" class="card-image" loading="lazy" style="width:100%; height:200px; object-fit:cover;">`
    : `<div class="img-placeholder card-image"><span>文章封面圖</span></div>`;
  const dataTags = tags.join(',');

  return `
    <a href="article.html?id=${id}" class="card" data-tags="${dataTags}" data-category="${category}">
      ${coverHTML}
      <div class="card-date">${date}</div>
      <div class="card-tags">${tagsHTML}</div>
      <h3 class="card-title">${title}</h3>
      <p class="card-excerpt">${excerpt}</p>
      <span class="card-link">閱讀更多 →</span>
    </a>
  `;
}

/* ---------- 全域狀態 ---------- */
let allDocs = [];         // 所有文章 doc
let currentCategory = 'all';  // 目前選中的大分類

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
    allDocs = snapshot.docs.filter(doc => doc.data().type === pageType);

    if (allDocs.length === 0) {
      const emptyMsg = pageType === 'case'
        ? '案例陸續更新中，歡迎直接與我聯繫諮詢。'
        : '目前尚無文章。';
      grid.innerHTML = `<p style="text-align:center; color:#999; padding: 40px 0; grid-column:1/-1;">${emptyMsg}</p>`;
      return;
    }

    // 渲染卡片
    grid.style.opacity = '0';
    grid.innerHTML = allDocs.map(createCardHTML).join('');
    requestAnimationFrame(() => {
      grid.style.transition = 'opacity 0.3s ease';
      grid.style.opacity = '1';
    });

    // 建立 hashtag 篩選按鈕（依全部文章）
    buildFilterButtons(allDocs);

    // 綁定大分類按鈕
    bindCategoryButtons();

    // 綁定 hashtag 篩選
    rebindFilter();

  } catch (error) {
    console.error('讀取文章失敗：', error);
    grid.innerHTML = '<p style="text-align:center; color:#999; padding: 40px 0; grid-column:1/-1;">讀取失敗，請稍後再試。</p>';
  }
}

/* ---------- 大分類篩選 ---------- */

function bindCategoryButtons() {
  const categoryBtns = document.querySelectorAll('.category-btn');
  if (categoryBtns.length === 0) return;

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      applyFilters();
      // 更新 hashtag 按鈕列：只顯示該分類相關的標籤
      updateHashtagButtons();
    });
  });
}

/* ---------- 動態產生 hashtag 篩選按鈕 ---------- */

function buildFilterButtons(docs) {
  const filterBar = document.getElementById('filter-bar');
  if (!filterBar) return;

  // 收集所有標籤並去除重複
  const tagSet = new Set();
  docs.forEach(doc => {
    const tags = doc.data().tags || [];
    tags.forEach(tag => tagSet.add(tag));
  });

  // 如果沒有任何標籤，隱藏篩選列
  if (tagSet.size === 0) return;

  // 在「全部」按鈕後面動態加入標籤按鈕
  tagSet.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.setAttribute('data-filter', tag);
    btn.textContent = '#' + tag;
    filterBar.appendChild(btn);
  });
}

/** 根據目前選中的大分類，更新 hashtag 按鈕的顯示/隱藏 */
function updateHashtagButtons() {
  const filterBar = document.getElementById('filter-bar');
  if (!filterBar) return;

  // 先重設 hashtag 篩選為「全部」
  filterBar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-filter') === 'all') {
      btn.classList.add('active');
    }
  });

  if (currentCategory === 'all') {
    // 全部分類 → 顯示所有 hashtag
    filterBar.querySelectorAll('.filter-btn').forEach(btn => btn.style.display = '');
  } else {
    // 收集該分類下文章的所有標籤
    const catTags = new Set();
    allDocs.forEach(doc => {
      const data = doc.data();
      if (data.category === currentCategory) {
        (data.tags || []).forEach(t => catTags.add(t));
      }
    });

    filterBar.querySelectorAll('.filter-btn').forEach(btn => {
      const tag = btn.getAttribute('data-filter');
      if (tag === 'all') {
        btn.style.display = '';
      } else {
        btn.style.display = catTags.has(tag) ? '' : 'none';
      }
    });
  }

  // 重新綁定篩選
  rebindFilter();
}

/* ---------- 綁定 hashtag 篩選功能 ---------- */

function rebindFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(function (btn) {
    // 移除舊事件（用 clone 方式）
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
  });

  // 重新綁定
  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });
}

/* ---------- 統一套用篩選（大分類 + hashtag） ---------- */

function applyFilters() {
  const activeHashtagBtn = document.querySelector('.filter-btn.active');
  const selectedTag = activeHashtagBtn ? activeHashtagBtn.getAttribute('data-filter') : 'all';

  const cards = document.querySelectorAll('.article-grid [data-tags]');
  cards.forEach(card => {
    const cardCategory = card.getAttribute('data-category') || '';
    const cardTags = card.getAttribute('data-tags').split(',');

    let showByCategory = (currentCategory === 'all') || (cardCategory === currentCategory);
    let showByTag = (selectedTag === 'all') || cardTags.includes(selectedTag);

    card.style.display = (showByCategory && showByTag) ? '' : 'none';
  });
}

loadArticles();
