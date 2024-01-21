<script setup>
    import { ref } from 'vue';
    import { Edit, Delete } from '@element-plus/icons-vue';
    import { ElMessage } from 'element-plus';
    import { Plus } from '@element-plus/icons-vue';
    import { QuillEditor, Quill } from '@vueup/vue-quill';
    import '@vueup/vue-quill/dist/vue-quill.snow.css';
    import { useTokenStore } from '@/store/token';
    import {
        articleCategoryListService,
        articleListService,
        addArticleService,
        deleteArticleService,
        updateArticleService,
    } from '@/api/article.js';

    // token
    const tokenStore = useTokenStore();

    // quill文字編輯器ref
    const quillEditorRef = ref(null);

    // 控制抽屜是否顯示
    const drawerVisible = ref(false);
    const drawerTitle = ref('');
    function showDrawer(title, data) {
        if (data) {
            articleModel.value = data;
        } else {
            // 清空quill文字編輯器的文字
            if (quillEditorRef.value) {
                quillEditorRef.value.setContents('');
            }
            articleModel.value = initArticleModel();
        }
        drawerTitle.value = title;
        drawerVisible.value = true;
    }

    // 新增文章表單資料模型
    function initArticleModel() {
        return {
            title: '',
            categoryId: '',
            coverImg: '',
            content: '',
            state: '',
        };
    }
    const articleModel = ref(initArticleModel());

    // 分頁資料
    const pageNumber = ref(1); // 當前頁
    const total = ref(0); // 總筆數
    const pageSize = ref(3); // 每頁筆數

    // 查詢參數資料
    const queryParams = ref({
        categoryId: '',
        state: '',
    });

    // 查詢分類資料
    const categoryList = ref([]);
    async function getCategoryList() {
        let result = await articleCategoryListService();
        categoryList.value = result.data;
    }

    // 查詢文章列表
    const articleList = ref([]);
    async function getArticleList() {
        let params = {
            pageNumber: pageNumber.value,
            pageSize: pageSize.value,
            categoryId: queryParams.value.categoryId,
            state: queryParams.value.state,
        };
        let result = await articleListService(params);
        total.value = result.data.total;
        articleList.value = result.data.items;

        // 取得文章的分類名稱
        for (const category of categoryList.value) {
            for (const article of articleList.value) {
                if (category.categoryId == article.categoryId) {
                    article.categoryName = category.categoryName;
                }
            }
        }
    }

    // 控制要呼叫新增還是修改方法
    function addOrUpdate(state) {
        if (drawerTitle.value === '新增文章') {
            addArticle(state);
        } else if (drawerTitle.value === '編輯文章') {
            updateArticle(state);
        }
    }

    // 新增文章
    async function addArticle(state) {
        articleModel.value.state = state;
        let result = await addArticleService(articleModel.value);
        ElMessage.success(result.code === 1 ? result.message : '新增文章成功');
        // 關閉抽屜
        drawerVisible.value = false;
        // 刷新
        getArticleList();
    }

    // 更新文章
    async function updateArticle(state) {
        articleModel.value.state = state;
        let result = await updateArticleService(articleModel.value);
        ElMessage.success(result.code === 1 ? result.message : '更新文章成功');
        // 關閉抽屜
        drawerVisible.value = false;
        // 刷新
        getArticleList();
    }

    // 刪除文章
    async function deleteArticle(data) {
        let result = await deleteArticleService(data.articleId);
        ElMessage.success(result.code === 1 ? result.message : '刪除文章成功');
        // 刷新
        getArticleList();
    }

    // 當文章封面上傳成功
    function handleUploadSuccess(result) {
        articleModel.value.coverImg = result.data;
    }

    // 當項數發生變化
    const handleSizeChange = (size) => {
        pageSize.value = size;
        getArticleList();
    };
    // 當頁數發生變化
    const handleCurrentChange = (num) => {
        pageNumber.value = num;
        getArticleList();
    };

    // 取得資料
    getCategoryList();
    getArticleList();
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="extra">
                    <el-button type="primary" @click="showDrawer('新增文章')">新增文章</el-button>
                </div>
            </div>
        </template>

        <!-- 查詢 -->
        <el-form inline>
            <el-form-item label="文章分類：">
                <el-select
                    placeholder="請選擇"
                    style="width: 120px"
                    v-model="queryParams.categoryId"
                >
                    <el-option
                        v-for="category in categoryList"
                        :key="category.categoryId"
                        :label="category.categoryName"
                        :value="category.categoryId"
                    >
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="發布狀態：">
                <el-select placeholder="請選擇" style="width: 120px" v-model="queryParams.state">
                    <el-option label="已發布" value="已發布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="getArticleList()">查詢</el-button>
                <el-button
                    @click="
                        queryParams.categoryId = '';
                        queryParams.state = '';
                    "
                    >重置</el-button
                >
            </el-form-item>
        </el-form>

        <!-- 文章列表 -->
        <el-table :data="articleList" style="width: 100%">
            <el-table-column label="文章標題" width="400" prop="title"></el-table-column>
            <el-table-column label="分類" prop="categoryName"></el-table-column>
            <el-table-column label="發布時間" prop="createTime"> </el-table-column>
            <el-table-column label="狀態" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button
                        :icon="Edit"
                        circle
                        plain
                        type="primary"
                        @click="showDrawer('編輯文章', row)"
                    ></el-button>
                    <el-button
                        :icon="Delete"
                        circle
                        plain
                        type="danger"
                        @click="deleteArticle(row)"
                    ></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="沒有資料" />
            </template>
        </el-table>

        <!-- 分頁 -->
        <el-pagination
            v-model:current-page="pageNumber"
            v-model:page-size="pageSize"
            :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next"
            background
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            style="margin-top: 20px; justify-content: flex-end"
        />

        <!-- 新增文章的抽屜 -->
        <el-drawer v-model="drawerVisible" :title="drawerTitle" direction="rtl" size="50%">
            <el-form :model="articleModel" label-width="100px">
                <el-form-item label="文章標題">
                    <el-input v-model="articleModel.title" placeholder="請輸入標題"></el-input>
                </el-form-item>
                <el-form-item label="文章分類">
                    <el-select placeholder="請選擇" v-model="articleModel.categoryId">
                        <el-option
                            v-for="category in categoryList"
                            :key="category.categoryId"
                            :label="category.categoryName"
                            :value="category.categoryId"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章封面">
                    <el-upload
                        class="coverImg-uploader"
                        :auto-upload="true"
                        :show-file-list="false"
                        action="/api/upload"
                        name="file"
                        :headers="{ Authorization: tokenStore.token }"
                        :on-success="handleUploadSuccess"
                    >
                        <img
                            v-if="articleModel.coverImg"
                            :src="articleModel.coverImg"
                            class="coverImg"
                        />
                        <el-icon v-else class="coverImg-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="文章內容">
                    <div class="editor">
                        <quill-editor
                            ref="quillEditorRef"
                            theme="snow"
                            v-model:content="articleModel.content"
                            contentType="html"
                        >
                        </quill-editor>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addOrUpdate('已發布')">發布</el-button>
                    <el-button type="info" @click="addOrUpdate('草稿')">草稿</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </el-card>
</template>

<style lang="scss" scoped>
    .page-container {
        min-height: 100%;
        box-sizing: border-box;

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }

    /* 上傳文章封面 */
    .coverImg-uploader {
        :deep() {
            .coverImg {
                width: 178px;
                height: 178px;
                display: block;
            }

            .el-upload {
                border: 1px dashed var(--el-border-color);
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                transition: var(--el-transition-duration-fast);
            }

            .el-upload:hover {
                border-color: var(--el-color-primary);
            }

            .el-icon.coverImg-uploader-icon {
                font-size: 28px;
                color: #8c939d;
                width: 178px;
                height: 178px;
                text-align: center;
            }
        }
    }

    /* 文字編輯器 */
    .editor {
        width: 100%;
        :deep(.ql-editor) {
            min-height: 200px;
        }
    }
</style>
