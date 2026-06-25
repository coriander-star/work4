const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 数据库文件路径
const dbPath = path.join(__dirname, 'yikao.db');

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('数据库连接失败:', err.message);
  } else {
    console.log('成功连接到SQLite数据库:', dbPath);
    initDatabase();
  }
});

// 初始化数据库表
function initDatabase() {
  // 用户表
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      phone TEXT UNIQUE,
      password TEXT NOT NULL,
      nickname TEXT DEFAULT '医靠用户',
      avatar TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME,
      login_count INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    )
  `, (err) => {
    if (err) {
      console.error('创建用户表失败:', err.message);
    } else {
      console.log('用户表创建成功或已存在');
    }
  });

  // 用户数据表（体质测评历史）
  db.run(`
    CREATE TABLE IF NOT EXISTS assessment_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      constitution_type TEXT NOT NULL,
      scores TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('创建测评历史表失败:', err.message);
    } else {
      console.log('测评历史表创建成功或已存在');
    }
  });

  // 用户打卡记录表
  db.run(`
    CREATE TABLE IF NOT EXISTS checkin_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      checkin_date DATE NOT NULL,
      checkin_type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('创建打卡记录表失败:', err.message);
    } else {
      console.log('打卡记录表创建成功或已存在');
    }
  });

  // 用户收藏表
  db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      item_type TEXT NOT NULL,
      item_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('创建收藏表失败:', err.message);
    } else {
      console.log('收藏表创建成功或已存在');
    }
  });

  // 验证码表
  db.run(`
    CREATE TABLE IF NOT EXISTS verification_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      used INTEGER DEFAULT 0
    )
  `, (err) => {
    if (err) {
      console.error('创建验证码表失败:', err.message);
    } else {
      console.log('验证码表创建成功或已存在');
    }
  });
}

// 导出数据库操作方法
module.exports = {
  // 用户相关操作
  createUser: (email, password, nickname = '医靠用户') => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)',
        [email, password, nickname],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, email, nickname });
          }
        }
      );
    });
  },

  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  },

  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  },

  updateUserLogin: (id) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP, login_count = login_count + 1 WHERE id = ?',
        [id],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  },

  updateUserProfile: (id, nickname, avatar) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET nickname = ?, avatar = ? WHERE id = ?',
        [nickname, avatar, id],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  },

  // 验证码相关操作
  createVerificationCode: (email, code, type, expiresInMinutes = 10) => {
    return new Promise((resolve, reject) => {
      const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
      db.run(
        'INSERT INTO verification_codes (email, code, type, expires_at) VALUES (?, ?, ?, ?)',
        [email, code, type, expiresAt.toISOString()],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, code, expiresAt });
          }
        }
      );
    });
  },

  verifyCode: (email, code, type) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM verification_codes 
         WHERE email = ? AND code = ? AND type = ? AND used = 0 AND expires_at > CURRENT_TIMESTAMP`,
        [email, code, type],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            // 标记验证码已使用
            db.run('UPDATE verification_codes SET used = 1 WHERE id = ?', [row.id]);
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });
  },

  // 测评历史相关操作
  saveAssessment: (userId, constitutionType, scores) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO assessment_history (user_id, constitution_type, scores) VALUES (?, ?, ?)',
        [userId, constitutionType, JSON.stringify(scores)],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        }
      );
    });
  },

  getAssessmentHistory: (userId, limit = 10) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM assessment_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
        [userId, limit],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.map(row => ({
              ...row,
              scores: JSON.parse(row.scores)
            })));
          }
        }
      );
    });
  },

  // 打卡记录相关操作
  saveCheckin: (userId, checkinDate, checkinType) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO checkin_records (user_id, checkin_date, checkin_type) VALUES (?, ?, ?)',
        [userId, checkinDate, checkinType],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        }
      );
    });
  },

  getCheckinRecords: (userId, limit = 30) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM checkin_records WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
        [userId, limit],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  },

  getTodayCheckin: (userId) => {
    return new Promise((resolve, reject) => {
      const today = new Date().toISOString().split('T')[0];
      db.get(
        'SELECT * FROM checkin_records WHERE user_id = ? AND checkin_date = ?',
        [userId, today],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  },

  // 收藏相关操作
  saveFavorite: (userId, itemType, itemId) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO favorites (user_id, item_type, item_id) VALUES (?, ?, ?)',
        [userId, itemType, itemId],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        }
      );
    });
  },

  removeFavorite: (userId, itemType, itemId) => {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM favorites WHERE user_id = ? AND item_type = ? AND item_id = ?',
        [userId, itemType, itemId],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  },

  getFavorites: (userId) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  },

  // 统计相关操作
  getUserStats: (userId) => {
    return new Promise((resolve, reject) => {
      const stats = {};
      
      // 获取收藏数量
      db.get(
        'SELECT COUNT(*) as count FROM favorites WHERE user_id = ?',
        [userId],
        (err, row) => {
          if (err) reject(err);
          stats.favorites = row ? row.count : 0;
        }
      );

      // 获取打卡数量
      db.get(
        'SELECT COUNT(*) as count FROM checkin_records WHERE user_id = ?',
        [userId],
        (err, row) => {
          if (err) reject(err);
          stats.checkins = row ? row.count : 0;
        }
      );

      // 获取测评数量
      db.get(
        'SELECT COUNT(*) as count FROM assessment_history WHERE user_id = ?',
        [userId],
        (err, row) => {
          if (err) reject(err);
          stats.assessments = row ? row.count : 0;
          
          // 获取最新体质
          db.get(
            'SELECT constitution_type FROM assessment_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
            [userId],
            (err, row) => {
              if (err) reject(err);
              stats.currentConstitution = row ? row.constitution_type : '未测评';
              resolve(stats);
            }
          );
        }
      );
    });
  },

  // 关闭数据库连接
  close: () => {
    db.close((err) => {
      if (err) {
        console.error('关闭数据库失败:', err.message);
      } else {
        console.log('数据库连接已关闭');
      }
    });
  }
};