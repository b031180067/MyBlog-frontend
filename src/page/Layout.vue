<script setup>
    import {
        Management,
        Promotion,
        UserFilled,
        User,
        Crop,
        EditPen,
        SwitchButton,
        CaretBottom,
    } from '@element-plus/icons-vue';
    import avatar from '@/assets/default.png';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { useRouter } from 'vue-router';

    import { useUserInfoStore } from '@/store/userInfo.js';
    import { useTokenStore } from '@/store/token.js';
    import { userInfoService, userLogoutService } from '@/api/user.js';

    // 取得個人資訊並儲存
    const userInfoStore = useUserInfoStore();
    async function getUserInfo() {
        let result = await userInfoService();
        userInfoStore.setUserInfo(result.data);
    }
    getUserInfo();

    const router = useRouter();
    const tokenStore = useTokenStore();
    // 如果點擊右上角的菜單會執行的方法
    function handleCommand(command) {
        // 登出
        if (command === 'logout') {
            ElMessageBox.confirm('確定要登出嗎?', '提示', {
                confirmButtonText: '確認',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(async () => {
                    let result = await userLogoutService();
                    // 刪除pinia儲存的個人資料跟token
                    userInfoStore.removeUserInfo();
                    tokenStore.removeToken();
                    // 跳轉到登入頁面
                    router.push('/login');
                    ElMessage.success(result.code === 1 ? result.message : '登出成功');
                })
                .catch(() => {});
        } else {
            router.push('/user/' + command);
        }
    }
</script>

<template>
    <el-container class="layout-container">
        <!-- 左側菜單 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <el-menu
                active-text-color="#ffd04b"
                background-color="#232323"
                text-color="#fff"
                router
            >
                <el-menu-item index="/article/category">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>文章分類</span>
                </el-menu-item>

                <el-menu-item index="/article/manage">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>文章管理</span>
                </el-menu-item>

                <el-sub-menu index="">
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>個人中心</span>
                    </template>

                    <el-menu-item index="/user/userInfo">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本資料</span>
                    </el-menu-item>

                    <el-menu-item index="/user/avatar">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>更換頭像</span>
                    </el-menu-item>

                    <el-menu-item index="/user/resetPassword">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>重設密碼</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右側主區域 -->
        <el-container>
            <!-- 上方區域 -->
            <el-header>
                <div>
                    <strong>{{ userInfoStore.userInfo.nickname }}</strong
                    >，您好!
                </div>
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar
                            :src="
                                userInfoStore.userInfo.userPicture
                                    ? userInfoStore.userInfo.userPicture
                                    : avatar
                            "
                        />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="userInfo" :icon="User"
                                >基本資料</el-dropdown-item
                            >
                            <el-dropdown-item command="avatar" :icon="Crop"
                                >更換頭像</el-dropdown-item
                            >
                            <el-dropdown-item command="resetPassword" :icon="EditPen"
                                >重設密碼</el-dropdown-item
                            >
                            <el-dropdown-item command="logout" :icon="SwitchButton"
                                >登出</el-dropdown-item
                            >
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中間區域 -->
            <el-main>
                <router-view />
            </el-main>
            <!-- 底部區域 -->
            <el-footer>blog ©2023 Created by 陳宣佑</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
    .layout-container {
        height: 100vh;

        .el-aside {
            background-color: #232323;

            &__logo {
                height: 120px;
                background: url('@/assets/logo.png') no-repeat center / 120px auto;
            }

            .el-menu {
                border-right: none;
            }
        }

        .el-header {
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .el-dropdown__box {
                display: flex;
                align-items: center;

                .el-icon {
                    color: #999;
                    margin-left: 10px;
                }

                &:active,
                &:focus {
                    outline: none;
                }
            }
        }

        .el-footer {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #666;
        }
    }
</style>
