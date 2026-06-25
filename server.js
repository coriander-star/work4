const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'yikao-health-secret-key-2026';

// 中间件配置
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务（前端页面）
app.use(express.static(path.join(__dirname)));

// JWT验证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '未提供认证令牌' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '令牌无效或已过期' });
    }
    req.user = user;
    next();
  });
};

// ==================== 用户认证相关API ====================

// 邮箱注册
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, code } = req.body;

    // 验证邮箱格式
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: '邮箱格式不正确' });
    }

    // 验证密码
    if (!password || password.length < 8) {
      return res.status(400).json({ error: '密码长度不能少于8位' });
    }

    // 验证验证码
    const codeValid = await db.verifyCode(email, code, 'register');
    if (!codeValid) {
      return res.status(400).json({ error: '验证码错误或已过期' });
    }

    // 检查邮箱是否已注册
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: '该邮箱已被注册' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await db.createUser(email, hashedPassword);

    // 生成JWT令牌
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: '注册成功',
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 邮箱登录
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 验证邮箱格式
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: '邮箱格式不正确' });
    }

    // 验证密码
    if (!password) {
      return res.status(400).json({ error: '请输入密码' });
    }

    // 查找用户
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: '该邮箱未注册' });
    }

    // 验证密码
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(400).json({ error: '密码错误' });
    }

    // 更新登录信息
    await db.updateUserLogin(user.id);

    // 生成JWT令牌
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: '登录成功',
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        loginCount: user.login_count + 1
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 发送验证码
app.post('/api/send-code', async (req, res) => {
  try {
    const { email, type } = req.body;

    // 验证邮箱格式
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: '邮箱格式不正确' });
    }

    // 生成6位验证码
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    // 保存验证码到数据库
    await db.createVerificationCode(email, code, type, 10);

    // 实际项目中应该发送邮件，这里直接返回验证码用于演示
    res.json({
      success: true,
      message: `验证码已发送到 ${email}`,
      code: code // 演示模式：直接返回验证码
    });
  } catch (error) {
    console.error('发送验证码错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取用户信息
app.get('/api/user/info', authenticateToken, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    const stats = await db.getUserStats(req.user.userId);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        createdAt: user.created_at,
        lastLogin: user.last_login,
        loginCount: user.login_count,
        stats
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新用户信息
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { nickname, avatar } = req.body;
    
    await db.updateUserProfile(req.user.userId, nickname, avatar);

    res.json({
      success: true,
      message: '用户信息更新成功'
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// ==================== 测评历史相关API ====================

// 保存测评结果
app.post('/api/assessment', authenticateToken, async (req, res) => {
  try {
    const { constitutionType, scores } = req.body;

    await db.saveAssessment(req.user.userId, constitutionType, scores);

    res.json({
      success: true,
      message: '测评结果保存成功'
    });
  } catch (error) {
    console.error('保存测评结果错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取测评历史
app.get('/api/assessment/history', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const history = await db.getAssessmentHistory(req.user.userId, limit);

    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('获取测评历史错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// ==================== 打卡记录相关API ====================

// 保存打卡记录
app.post('/api/checkin', authenticateToken, async (req, res) => {
  try {
    const { checkinType } = req.body;
    const today = new Date().toISOString().split('T')[0];

    // 检查今日是否已打卡
    const existingCheckin = await db.getTodayCheckin(req.user.userId);
    if (existingCheckin) {
      return res.status(400).json({ error: '今日已打卡' });
    }

    await db.saveCheckin(req.user.userId, today, checkinType);

    res.json({
      success: true,
      message: '打卡成功'
    });
  } catch (error) {
    console.error('保存打卡记录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取打卡记录
app.get('/api/checkin/records', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const records = await db.getCheckinRecords(req.user.userId, limit);

    const today = new Date().toISOString().split('T')[0];
    const todayCheckin = await db.getTodayCheckin(req.user.userId);

    res.json({
      success: true,
      records,
      todayCheckedIn: !!todayCheckin
    });
  } catch (error) {
    console.error('获取打卡记录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// ==================== 收藏相关API ====================

// 添加收藏
app.post('/api/favorite', authenticateToken, async (req, res) => {
  try {
    const { itemType, itemId } = req.body;

    await db.saveFavorite(req.user.userId, itemType, itemId);

    res.json({
      success: true,
      message: '收藏成功'
    });
  } catch (error) {
    console.error('添加收藏错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 取消收藏
app.delete('/api/favorite', authenticateToken, async (req, res) => {
  try {
    const { itemType, itemId } = req.body;

    await db.removeFavorite(req.user.userId, itemType, itemId);

    res.json({
      success: true,
      message: '取消收藏成功'
    });
  } catch (error) {
    console.error('取消收藏错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取收藏列表
app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const favorites = await db.getFavorites(req.user.userId);

    res.json({
      success: true,
      favorites
    });
  } catch (error) {
    console.error('获取收藏列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// ==================== 健康检查 ====================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '医靠健康助手API服务正常运行',
    timestamp: new Date().toISOString()
  });
});

// ==================== 启动服务器 ====================

app.listen(PORT, () => {
  console.log(`医靠健康助手API服务器已启动`);
  console.log(`API地址: http://localhost:${PORT}`);
  console.log(`前端页面: http://localhost:${PORT}/index.html`);
});

// 处理进程退出
process.on('SIGINT', () => {
  db.close();
  process.exit();
});