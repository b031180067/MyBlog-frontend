<script setup>
    import { ref } from 'vue';
    import { ElMessage } from 'element-plus';
    import { useUserInfoStore } from '@/store/userInfo.js';
    import { useTokenStore } from '@/store/token.js';
    import { updatePasswordService } from '@/api/user.js';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const userInfoStore = useUserInfoStore();
    const tokenStore = useTokenStore();

    const passwordModel = ref({
        oldPassword: '',
        newPassword: '',
        rePassword: '',
    });

    // 檢查二次輸入密碼
    const checkRePassword = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('請再次輸入密碼'));
        } else if (value !== passwordModel.value.newPassword) {
            callback(new Error('兩次輸入密碼不同'));
        } else {
            callback();
        }
    };

    const passwordRules = {
        oldPassword: [
            { required: true, message: '請輸入舊密碼', trigger: 'blur' },
            { min: 5, max: 16, message: '請輸入5~16位英文、數字', trigger: 'blur' },
        ],
        newPassword: [
            { required: true, message: '請輸入新密碼', trigger: 'blur' },
            { min: 5, max: 16, message: '請輸入5~16位英文、數字', trigger: 'blur' },
        ],
        rePassword: [{ validator: checkRePassword, trigger: 'blur' }],
    };

    async function updatePassword() {
        let result = await updatePasswordService(passwordModel.value, tokenStore.token);
        if (result.code !== 1) {
            // 刪除pinia儲存的個人資料跟token
            userInfoStore.removeUserInfo();
            tokenStore.removeToken();
            // 跳轉到登入頁面
            router.push('/login');
        }
        ElMessage.success(result.code === 1 ? result.message : '修改密碼成功，請用新密碼重新登入');
    }
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>重設密碼</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form
                    :model="passwordModel"
                    :rules="passwordRules"
                    label-width="100px"
                    size="large"
                >
                    <el-form-item label="舊密碼" prop="oldPassword">
                        <el-input type="password" v-model="passwordModel.oldPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="新密碼" prop="newPassword">
                        <el-input type="password" v-model="passwordModel.newPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="確認新密碼" prop="rePassword">
                        <el-input type="password" v-model="passwordModel.rePassword"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updatePassword()">修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>
