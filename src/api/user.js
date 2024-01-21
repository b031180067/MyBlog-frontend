import request from '@/util/request.js';

// 註冊
export function userRegisterService(data) {
    const params = new URLSearchParams();
    for (let key in data) {
        params.append(key, data[key]);
    }
    return request.post('user/register', params);
}

// 登入
export function userLoginService(data) {
    const params = new URLSearchParams();
    for (let key in data) {
        params.append(key, data[key]);
    }
    return request.post('user/login', params);
}

// 登出
export function userLogoutService() {
    return request.post('user/logout');
}

// 取得個人資訊
export function userInfoService() {
    return request.get('user/userInfo');
}

// 修改個人資訊
export function updateUserInfoService(userInfo) {
    return request.put('user/update', userInfo);
}

// 更新頭像
export function updateAvatarService(avatarUrl) {
    const params = new URLSearchParams();
    params.append('avatarUrl', avatarUrl);
    return request.patch('user/updateAvatar', params);
}

// 重設密碼
export function updatePasswordService(passwordModel) {
    return request.patch('user/updatePassword', passwordModel);
}