import request from '@/util/request.js';

// 查詢文章分類列表
export function articleCategoryListService() {
    return request.get('/category');
};

// 新增文章分類
export function addArticleCategoryService(data) {
    return request.post('/category', data);
};

// 更新文章分類
export function updateArticleCategoryService(data) {
    return request.put('/category', data);
};

// 刪除文章分類
export function deleteArticleCategoryService(categoryId) {
    return request.delete('/category?categoryId=' + categoryId);
};

// 查詢文章
export function articleListService(params) {
    return request.get('/article', { params });
};

// 新增文章
export function addArticleService(data) {
    return request.post('/article', data);
};

// 更新文章
export function updateArticleService(data) {
    return request.put('/article', data);
};

// 刪除文章
export function deleteArticleService(articleId) {
    return request.delete('/article?articleId=' + articleId);
};