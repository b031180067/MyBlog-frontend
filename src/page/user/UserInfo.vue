<script setup>
    import { ref } from 'vue';
    import { ElMessage } from 'element-plus';
    import { useUserInfoStore } from '@/store/userInfo.js';
    import { updateUserInfoService } from '@/api/user.js';
    const userInfoStore = useUserInfoStore();

    const userInfo = ref({...userInfoStore.userInfo});

    // 修改個人資訊
    async function updateUserInfo() {
        let result = await updateUserInfoService(userInfo.value);
        ElMessage.success(result.code === 1 ? result.message : '修改成功');
        // 將修改過的個人資料儲存
        userInfoStore.setUserInfo(userInfo.value);
    }

    const userInfoRules = {
        nickname: [
            { required: true, message: '請輸入暱稱', trigger: 'blur' },
            {
                pattern: /^\S{2,10}$/,
                message: '暱稱必須是2~10個英文或數字',
                trigger: 'blur',
            },
        ],
        email: [
            { required: true, message: '請輸入信箱', trigger: 'blur' },
            { type: 'email', message: '信箱格式不正確', trigger: 'blur' },
        ],
    };
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>基本資料</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="userInfo" :rules="userInfoRules" label-width="100px" size="large">
                    <el-form-item label="帳號">
                        <el-input v-model="userInfo.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="暱稱" prop="nickname">
                        <el-input v-model="userInfo.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="信箱" prop="email">
                        <el-input v-model="userInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserInfo()">修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>
