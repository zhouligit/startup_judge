<template>
  <div class="my-container">
    <Navbar />
    <div class="header">
      <h2>我的</h2>
    </div>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="user-info-card">
        <div class="user-avatar">
          <span>{{ user?.username?.charAt(0).toUpperCase() || 'U' }}</span>
        </div>
        <div class="user-details">
          <h3>{{ user?.username }}</h3>
          <p>{{ user?.email }}</p>
          <p>{{ user?.phone }}</p>
        </div>
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </div>

      <div class="section">
        <h3>我的提交记录</h3>
        <div v-if="submissions.length === 0" class="empty">暂无提交记录</div>
        <div v-else class="submission-list">
          <div v-for="submission in submissions" :key="submission.id" class="submission-item">
            <div class="submission-header">
              <span class="module-type">{{ getModuleTypeName(submission.module_type) }}</span>
              <span class="submission-time">{{ formatTime(submission.created_at) }}</span>
            </div>
            <div class="submission-score">
              <span class="score-label">得分：</span>
              <span class="score-value">{{ submission.score || '未评分' }}</span>
            </div>
            <div v-if="submission.result" class="submission-result">
              <span class="result-label">结果：</span>
              <span class="result-value">{{ submission.result.level || submission.result.message || '' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>我的订单</h3>
        <div v-if="orders.length === 0" class="empty">暂无订单</div>
        <div v-else class="order-list">
          <div v-for="order in orders" :key="order.id" class="order-item">
            <div class="order-info">
              <span class="order-product">{{ order.product_name || '产品' + order.product_id }}</span>
              <span class="order-amount">¥{{ order.amount }}</span>
            </div>
            <div class="order-status" :class="order.status">
              {{ getOrderStatusName(order.status) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, submissionsAPI, productsAPI } from '../services/api'
import Navbar from '../components/Navbar.vue'

export default {
  name: 'My',
  components: {
    Navbar
  },
  setup() {
    const router = useRouter()
    const loading = ref(true)
    const error = ref(null)
    const user = ref(null)
    const submissions = ref([])
    const orders = ref([])

    const loadUserInfo = async () => {
      try {
        user.value = await authAPI.getCurrentUser()
      } catch (err) {
        console.error('获取用户信息失败:', err)
        error.value = '获取用户信息失败'
      }
    }

    const loadSubmissions = async () => {
      try {
        submissions.value = await submissionsAPI.getSubmissions()
      } catch (err) {
        console.error('获取提交记录失败:', err)
      }
    }

    const loadOrders = async () => {
      try {
        orders.value = await productsAPI.getProducts()
      } catch (err) {
        console.error('获取订单失败:', err)
      }
    }

    const handleLogout = () => {
      localStorage.removeItem('token')
      router.push('/auth/login')
    }

    const getModuleTypeName = (type) => {
      const typeMap = {
        'questions': '题库',
        'scenarios': '情景推演',
        'defense': '辩护博弈'
      }
      return typeMap[type] || type
    }

    const formatTime = (time) => {
      if (!time) return ''
      const date = new Date(time)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }

    const getOrderStatusName = (status) => {
      const statusMap = {
        'pending': '待支付',
        'paid': '已支付',
        'completed': '已完成',
        'cancelled': '已取消'
      }
      return statusMap[status] || status
    }

    onMounted(async () => {
      try {
        await Promise.all([loadUserInfo(), loadSubmissions(), loadOrders()])
      } finally {
        loading.value = false
      }
    })

    return {
      loading,
      error,
      user,
      submissions,
      orders,
      handleLogout,
      getModuleTypeName,
      formatTime,
      getOrderStatusName
    }
  }
}
</script>

<style scoped>
.my-container {
  padding: 16px;
}

.header {
  margin-bottom: 20px;
}

.header h2 {
  font-size: 24px;
  font-weight: bold;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #f56c6c;
}

.user-info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  color: white;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin-right: 16px;
}

.user-details {
  flex: 1;
}

.user-details h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
}

.user-details p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.section {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #333;
}

.empty {
  text-align: center;
  color: #999;
  padding: 20px;
}

.submission-list, .order-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.submission-item, .order-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.submission-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.module-type {
  background: #667eea;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.submission-time {
  color: #999;
  font-size: 12px;
}

.submission-score, .submission-result {
  font-size: 14px;
  margin-top: 4px;
}

.score-label, .result-label {
  color: #666;
}

.score-value {
  color: #f56c6c;
  font-weight: bold;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info {
  display: flex;
  gap: 16px;
}

.order-amount {
  color: #f56c6c;
  font-weight: bold;
}

.order-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.order-status.pending {
  background: #fdf6ec;
  color: #e6a23c;
}

.order-status.paid, .order-status.completed {
  background: #f0f9eb;
  color: #67c23a;
}

.order-status.cancelled {
  background: #f4f4f5;
  color: #909399;
}
</style>
