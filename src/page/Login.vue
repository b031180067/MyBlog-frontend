<script setup>
    import { User, Lock } from '@element-plus/icons-vue';
    import { ElMessage } from 'element-plus';
    import { ref } from 'vue';
    
    // 控制註冊與登入表單的顯示，默認顯示登入
    const isRegister = ref(false);

    // 註冊資料
    const registerData = ref({
        username: '',
        password: '',
        rePassword: '',
    });

    // 檢查二次輸入密碼
    const checkRePassword = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('請再次輸入密碼'));
        } else if (value !== registerData.value.password) {
            callback(new Error('兩次輸入密碼不同'));
        } else {
            callback();
        }
    };

    // 註冊驗證規則
    const registerRules = {
        username: [
            { required: true, message: '請輸入帳號', trigger: 'blur' },
            { min: 5, max: 16, message: '請輸入5~16位英文、數字', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '請輸入密碼', trigger: 'blur' },
            { min: 5, max: 16, message: '請輸入5~16位英文、數字', trigger: 'blur' },
        ],
        rePassword: [{ validator: checkRePassword, trigger: 'blur' }],
    };

    // 註冊
    import { userRegisterService, userLoginService } from '@/api/user.js';
    async function register() {
        let result = await userRegisterService(registerData.value);
        ElMessage.success(result.code === 1 ? result.message : '註冊成功');
        if (result.code === 0) {
            isRegister.value = false;
        }
    }

    // 登入資料
    let loginData = ref({
        username: '',
        password: '',
    });

    // 登入驗證規則
    const loginRules = {
        username: [
            { required: true, message: '請輸入帳號', trigger: 'blur' },
            { min: 5, max: 16, message: '請輸入5~16位英文、數字', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '請輸入密碼', trigger: 'blur' },
            { min: 5, max: 16, message: '請輸入5~16位英文、數字', trigger: 'blur' },
        ],
    };

    // 登入
    import { useRouter } from 'vue-router';
    import { useTokenStore } from '@/store/token.js';
    const router = useRouter();
    async function login() {
        let result = await userLoginService(loginData.value);
        ElMessage.success(result.code === 1 ? result.message : '登入成功');

        // 將token儲存
        const tokenStore = useTokenStore();
        tokenStore.setToken(result.data);

        // 登入成功後跳轉到主畫面
        router.push('/');
    }
</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 註冊頁面 -->
            <el-form
                ref="form"
                size="large"
                autocomplete="off"
                v-if="isRegister"
                :model="registerData"
                :rules="registerRules"
            >
                <el-form-item>
                    <h1>註冊</h1>
                </el-form-item>

                <el-form-item prop="username">
                    <el-input
                        :prefix-icon="User"
                        placeholder="請輸入帳號"
                        v-model="registerData.username"
                    ></el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input
                        :prefix-icon="Lock"
                        type="password"
                        placeholder="請輸入密碼"
                        v-model="registerData.password"
                    ></el-input>
                </el-form-item>

                <el-form-item prop="rePassword">
                    <el-input
                        :prefix-icon="Lock"
                        type="password"
                        placeholder="請再次輸入密碼"
                        v-model="registerData.rePassword"
                    ></el-input>
                </el-form-item>

                <!-- 註冊按鈕 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register()">
                        註冊
                    </el-button>
                </el-form-item>

                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false">
                        ← 登入
                    </el-link>
                </el-form-item>
            </el-form>

            <!-- 登入頁面 -->
            <el-form
                ref="form"
                size="large"
                autocomplete="off"
                v-else
                :model="loginData"
                :rules="loginRules"
            >
                <el-form-item>
                    <h1>登入</h1>
                </el-form-item>

                <el-form-item prop="username">
                    <el-input
                        :prefix-icon="User"
                        placeholder="請輸入帳號"
                        v-model="loginData.username"
                    ></el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input
                        name="password"
                        :prefix-icon="Lock"
                        type="password"
                        placeholder="請輸入密碼"
                        v-model="loginData.password"
                    ></el-input>
                </el-form-item>

                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>記住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘記密碼?</el-link>
                    </div>
                </el-form-item>

                <!-- 登入按鈕 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login()">
                        登入
                    </el-button>
                </el-form-item>

                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true">
                        註冊 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
    .login-page {
        height: 100vh;
        background-color: #fff;

        .bg {
            background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
                url('@/assets/login_bg.jpg') no-repeat center / cover;
            border-radius: 0 20px 20px 0;
        }

        .form {
            display: flex;
            flex-direction: column;
            justify-content: center;
            user-select: none;

            .title {
                margin: 0 auto;
            }

            .button {
                width: 100%;
            }

            .flex {
                width: 100%;
                display: flex;
                justify-content: space-between;
            }
        }
    }
</style>
