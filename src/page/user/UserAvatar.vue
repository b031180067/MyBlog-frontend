<script setup>
    import { Plus, Upload } from '@element-plus/icons-vue';
    import { ElMessage } from 'element-plus';
    import { ref } from 'vue';
    import avatar from '@/assets/default.png';
    import { useUserInfoStore } from '@/store/userInfo.js';
    import { useTokenStore } from '@/store/token.js';
    import {updateAvatarService} from '@/api/user.js'

    const uploadRef = ref();

    const tokenStore = useTokenStore();
    const userInfoStore = useUserInfoStore();

    // 頭像地址
    const avatarUrl = ref(userInfoStore.userInfo.userPicture);


    // 圖片上傳執行的方法
    const handleUploadSuccess = (result) => {
        avatarUrl.value = result.data;
    }

    // 更新頭像
    async function updateAvatar() {
        let result = updateAvatarService(avatarUrl.value);
        ElMessage.success(result.code === 1 ? result.message : '更換頭像成功');
        // 更新pinia裡儲存的頭像
        userInfoStore.userInfo.userPicture = avatarUrl.value;
    }

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>更換頭像</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-upload
                    ref="uploadRef"
                    class="avatar-uploader"
                    :show-file-list="false"
                    :auto-upload="true"
                    action="/api/upload"
                    name="file"
                    :headers="{ Authorization: tokenStore.token }"
                    :on-success="handleUploadSuccess"
                >
                    <img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
                    <img v-else :src="avatar" width="278" />
                </el-upload>
                <br />
                <el-button
                    type="primary"
                    :icon="Plus"
                    size="large"
                    @click="uploadRef.$el.querySelector('input').click()"
                >
                    選擇圖片
                </el-button>
                <el-button type="success" :icon="Upload" size="large" @click="updateAvatar()"> 更換頭像 </el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<style lang="scss" scoped>
    .avatar-uploader {
        :deep() {
            .avatar {
                width: 278px;
                height: 278px;
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

            .el-icon.avatar-uploader-icon {
                font-size: 28px;
                color: #8c939d;
                width: 278px;
                height: 278px;
                text-align: center;
            }
        }
    }
</style>
