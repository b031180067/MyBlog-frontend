<script setup>
    import { Edit, Delete } from '@element-plus/icons-vue';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { ref } from 'vue';
    import {
        articleCategoryListService,
        addArticleCategoryService,
        updateArticleCategoryService,
        deleteArticleCategoryService,
    } from '@/api/article.js';

    // 查詢分類資料
    const categoryList = ref([]);
    async function getCategoryList() {
        let result = await articleCategoryListService();
        categoryList.value = result.data;
    }
    getCategoryList();

    // 初始化分類資料
    const initCategoryModel = () => ({
        categoryId: '',
        categoryName: '',
        categoryAlias: '',
    });

    // 分類資料
    const categoryModel = ref(initCategoryModel());

    // 分類驗證
    const categoryRules = {
        categoryName: [{ required: true, message: '請輸入分類名稱', trigger: 'blur' }],
        categoryAlias: [{ required: true, message: '請輸入分類別名', trigger: 'blur' }],
    };

    // 控制新增、編輯分類對話框
    const dialogVisible = ref(false);
    let dialogTitle = ref('');
    function showDialog(title, data) {
        dialogVisible.value = true;
        // 改變對話框title
        dialogTitle.value = title;
        if (data) {
            categoryModel.value.categoryId = data.categoryId;
            categoryModel.value.categoryName = data.categoryName;
            categoryModel.value.categoryAlias = data.categoryAlias;
        } else {
            // 初始化資料
            categoryModel.value = initCategoryModel();
        }
    }

    // 新增分類
    async function addCategory() {
        const result = await addArticleCategoryService(categoryModel.value);
        ElMessage.success(result.code === 1  ? result.message : '新增成功');
        // 新增分類後，重新取得分類資料，刷新頁面
        getCategoryList();

        // 關閉對話框
        dialogVisible.value = false;
        // 清空資料
        categoryModel.value = initCategoryModel();
    }

    // 更新分類
    async function updateCategory() {
        const result = await updateArticleCategoryService(categoryModel.value);
        ElMessage.success(result.code === 1  ? result.message : '更新成功');
        // 更新分類後，重新取得分類資料，刷新頁面
        getCategoryList();
        // 關閉對話框
        dialogVisible.value = false;
        // 清空資料
        categoryModel.value = initCategoryModel();
    }

    // 刪除分類
    function deleteCategory(data) {
        ElMessageBox.confirm('確定要刪除此分類?', '提示', {
            confirmButtonText: '確認',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(async () => {
                let result = await deleteArticleCategoryService(data.categoryId);
                // 刪除分類後，重新取得分類資料，刷新頁面
                getCategoryList();
                ElMessage({
                    type: 'success',
                    message: '刪除成功',
                });
            })
            .catch(() => {});
    }
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章分類</span>
                <div class="extra">
                    <el-button type="primary" @click="showDialog('新增分類')">新增分類</el-button>
                </div>
            </div>
        </template>
        <el-table :data="categoryList" style="width: 100%">
            <el-table-column label="編號" width="100" type="index"> </el-table-column>
            <el-table-column label="分類名稱" prop="categoryName"></el-table-column>
            <el-table-column label="分類別名" prop="categoryAlias"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button
                        :icon="Edit"
                        circle
                        plain
                        type="primary"
                        @click="showDialog('編輯分類', row)"
                    ></el-button>
                    <el-button
                        :icon="Delete"
                        circle
                        plain
                        type="danger"
                        @click="deleteCategory(row)"
                    ></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="無資料" />
            </template>
        </el-table>

        <!-- 新增分類對話框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
            <el-form
                :model="categoryModel"
                :rules="categoryRules"
                label-width="100px"
                style="padding-right: 30px"
            >
                <el-form-item label="分類名稱" prop="categoryName">
                    <el-input
                        v-model="categoryModel.categoryName"
                        minlength="1"
                        maxlength="10"
                    ></el-input>
                </el-form-item>
                <el-form-item label="分類別名" prop="categoryAlias">
                    <el-input
                        v-model="categoryModel.categoryAlias"
                        minlength="1"
                        maxlength="15"
                    ></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button
                        type="primary"
                        @click="dialogTitle === '新增分類' ? addCategory() : updateCategory()"
                    >
                        確認
                    </el-button>
                </span>
            </template>
        </el-dialog>
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
</style>
