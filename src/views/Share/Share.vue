<template>
  <div class="share-container">
    <Navbar />
    <h1>裂变分享</h1>
    <p>分享给朋友，获得额外的创业评估机会</p>
    
    <div v-if="loading" class="loading">
      <el-loading :fullscreen="true" text="加载中..."></el-loading>
    </div>
    
    <div v-else class="share-section">
      <el-card class="share-card">
        <template #header>
          <div class="share-header">
            <span>生成分享链接</span>
          </div>
        </template>
        <div class="share-content">
          <p>分享此链接给你的朋友，当他们注册并完成创业评估后，你将获得额外的评估机会</p>
          
          <div class="share-link-container">
            <el-input v-model="shareLink" readonly placeholder="分享链接"></el-input>
            <el-button type="primary" @click="copyLink">复制链接</el-button>
          </div>
          
          <div class="share-rewards">
            <h3>分享奖励：</h3>
            <ul>
              <li>每成功邀请1位朋友注册并完成评估，获得1次额外的创业评估机会</li>
              <li>邀请5位朋友，获得一次免费的情景推演机会</li>
              <li>邀请10位朋友，获得一份创业死刑判决书</li>
            </ul>
          </div>
        </div>
      </el-card>
      
      <div v-if="shareStats" class="stats-card">
        <el-card class="stats-card-inner">
          <template #header>
            <div class="stats-header">
              <span>分享统计</span>
            </div>
          </template>
          <div class="stats-content">
            <div class="stat-item">
              <span class="stat-label">分享次数：</span>
              <span class="stat-value">{{ shareStats.share_count }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">成功邀请：</span>
              <span class="stat-value">{{ shareStats.invite_count }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">获得奖励：</span>
              <span class="stat-value">{{ shareStats.reward_count }}次</span>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShareStore } from '../../store'
import { shareAPI } from '../../services/api'
import Navbar from '../../components/Navbar.vue'

const router = useRouter()
const shareStore = useShareStore()
const loading = ref(true)
const shareLink = ref('')
const shareStats = ref(null)

const generateShareLink = async () => {
  try {
    const data = await shareAPI.generateShare({})
    shareLink.value = data.share_link
  } catch (error) {
    console.error('生成分享链接失败:', error)
    alert('生成分享链接失败，请稍后重试')
  }
}

const copyLink = () => {
  navigator.clipboard.writeText(shareLink.value)
    .then(() => {
      alert('链接已复制到剪贴板')
    })
    .catch(err => {
      console.error('复制失败:', err)
      alert('复制失败，请手动复制')
    })
}

const loadShareStats = async () => {
  try {
    // 这里模拟获取分享统计数据
    shareStats.value = {
      share_count: 5,
      invite_count: 2,
      reward_count: 1
    }
  } catch (error) {
    console.error('获取分享统计失败:', error)
  }
}

onMounted(() => {
  generateShareLink()
  loadShareStats()
  loading.value = false
})
</script>

<style scoped>
.share-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

.share-container h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.share-container p {
  text-align: center;
  margin-bottom: 40px;
  color: #666;
}

.share-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.share-card,
.stats-card-inner {
  margin-bottom: 20px;
}

.share-header,
.stats-header {
  font-weight: bold;
  color: #333;
}

.share-content,
.stats-content {
  margin-top: 15px;
}

.share-link-container {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.share-link-container .el-input {
  flex: 1;
}

.share-rewards {
  margin-top: 30px;
}

.share-rewards h3 {
  margin-bottom: 15px;
  color: #333;
}

.share-rewards ul {
  list-style-type: disc;
  margin-left: 20px;
  color: #666;
}

.share-rewards li {
  margin-bottom: 10px;
}

.stats-content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.stat-item {
  margin: 10px;
  text-align: center;
}

.stat-label {
  display: block;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  display: block;
  font-weight: bold;
  color: #333;
  font-size: 24px;
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}
</style>
