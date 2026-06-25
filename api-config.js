// API配置文件
const API_BASE_URL = 'http://localhost:3001/api';

// API请求辅助函数
async function apiRequest(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  // 添加认证令牌
  const token = localStorage.getItem('authToken');
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  // 添加请求体
  if (data && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '请求失败');
    }

    return result;
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

// ==================== 用户认证API ====================

// 邮箱注册
async function apiRegister(email, password, code) {
  const result = await apiRequest('/register', 'POST', { email, password, code });
  
  // 保存令牌和用户信息
  if (result.success) {
    localStorage.setItem('authToken', result.token);
    localStorage.setItem('userEmail', result.user.email);
    localStorage.setItem('userId', result.user.id);
    localStorage.setItem('userNickname', result.user.nickname);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('registerTime', new Date().toISOString());
  }
  
  return result;
}

// 邮箱登录
async function apiLogin(email, password) {
  const result = await apiRequest('/login', 'POST', { email, password });
  
  // 保存令牌和用户信息
  if (result.success) {
    localStorage.setItem('authToken', result.token);
    localStorage.setItem('userEmail', result.user.email);
    localStorage.setItem('userId', result.user.id);
    localStorage.setItem('userNickname', result.user.nickname);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loginTime', new Date().toISOString());
  }
  
  return result;
}

// 发送验证码
async function apiSendCode(email, type = 'register') {
  const result = await apiRequest('/send-code', 'POST', { email, type });
  return result;
}

// 获取用户信息
async function apiGetUserInfo() {
  const result = await apiRequest('/user/info', 'GET');
  return result;
}

// 更新用户信息
async function apiUpdateProfile(nickname, avatar) {
  const result = await apiRequest('/user/profile', 'PUT', { nickname, avatar });
  return result;
}

// ==================== 测评历史API ====================

// 保存测评结果
async function apiSaveAssessment(constitutionType, scores) {
  const result = await apiRequest('/assessment', 'POST', { constitutionType, scores });
  return result;
}

// 获取测评历史
async function apiGetAssessmentHistory(limit = 10) {
  const result = await apiRequest(`/assessment/history?limit=${limit}`, 'GET');
  return result;
}

// ==================== 打卡记录API ====================

// 保存打卡记录
async function apiSaveCheckin(checkinType) {
  const result = await apiRequest('/checkin', 'POST', { checkinType });
  return result;
}

// 获取打卡记录
async function apiGetCheckinRecords(limit = 30) {
  const result = await apiRequest(`/checkin/records?limit=${limit}`, 'GET');
  return result;
}

// ==================== 收藏API ====================

// 添加收藏
async function apiAddFavorite(itemType, itemId) {
  const result = await apiRequest('/favorite', 'POST', { itemType, itemId });
  return result;
}

// 取消收藏
async function apiRemoveFavorite(itemType, itemId) {
  const result = await apiRequest('/favorite', 'DELETE', { itemType, itemId });
  return result;
}

// 获取收藏列表
async function apiGetFavorites() {
  const result = await apiRequest('/favorites', 'GET');
  return result;
}

// ==================== 健康检查 ====================

async function apiHealthCheck() {
  const result = await apiRequest('/health', 'GET');
  return result;
}

// 导出API函数
window.apiRequest = apiRequest;
window.apiRegister = apiRegister;
window.apiLogin = apiLogin;
window.apiSendCode = apiSendCode;
window.apiGetUserInfo = apiGetUserInfo;
window.apiUpdateProfile = apiUpdateProfile;
window.apiSaveAssessment = apiSaveAssessment;
window.apiGetAssessmentHistory = apiGetAssessmentHistory;
window.apiSaveCheckin = apiSaveCheckin;
window.apiGetCheckinRecords = apiGetCheckinRecords;
window.apiAddFavorite = apiAddFavorite;
window.apiRemoveFavorite = apiRemoveFavorite;
window.apiGetFavorites = apiGetFavorites;
window.apiHealthCheck = apiHealthCheck;