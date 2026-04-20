<template>
  <div class="home-container">
    <Navbar />

    <div class="hero-section">
      <h1>创业判官</h1>
      <p>99%的人根本不适合创业，你大概率就是那99%</p>
      <div class="cta-buttons">
        <el-button type="primary" size="large" @click="navigateTo('questions')">
          开始测试
        </el-button>
        <el-button v-if="!isLoggedIn" size="large" @click="navigateTo('login')">
          登录/注册
        </el-button>
      </div>
    </div>
    
    <div class="features-section">
      <h2>核心功能</h2>
      <div class="features-grid">
        <div class="feature-card">
          <h3>通用创业题库</h3>
          <p>评估你的创业潜力，看看你是否具备创业的基本素质</p>
        </div>
        <div class="feature-card">
          <h3>情景推演</h3>
          <p>模拟创业过程中的各种挑战，AI预判你如何失败</p>
        </div>
        <div class="feature-card">
          <h3>辩护博弈</h3>
          <p>与AI毒舌评审团展开辩论，证明你的创业计划可行</p>
        </div>
      </div>
    </div>
    
    <div class="products-section">
      <h2>付费服务</h2>
      <div class="products-grid">
        <div class="product-card">
          <h3>创业死刑判决书</h3>
          <p>详细分析你的创业项目，指出存在的问题和失败风险</p>
          <p class="price">¥9.9</p>
          <el-button @click="navigateTo('products')">查看详情</el-button>
        </div>
        <div class="product-card">
          <h3>改判申请书</h3>
          <p>针对死刑判决书中的问题，给出可执行的整改方案</p>
          <p class="price">¥19.9</p>
          <el-button @click="navigateTo('products')">查看详情</el-button>
        </div>
        <div class="product-card">
          <h3>同案犯匹配</h3>
          <p>匹配与你罪名相同、项目相似、能力互补的创业伙伴</p>
          <p class="price">¥29.9</p>
          <el-button @click="navigateTo('products')">查看详情</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useUserStore } from '../store'
import Navbar from '../components/Navbar.vue'

const router = useRouter()
const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)

const navigateTo = (path) => {
  router.push(`/${path}`)
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}



.hero-section {
  text-align: center;
  margin-bottom: 80px;
}

.hero-section h1 {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.hero-section p {
  font-size: 24px;
  margin-bottom: 40px;
  color: #666;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.features-section {
  margin-bottom: 80px;
}

.features-section h2 {
  text-align: center;
  font-size: 32px;
  margin-bottom: 40px;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.feature-card h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.products-section {
  margin-bottom: 40px;
}

.products-section h2 {
  text-align: center;
  font-size: 32px;
  margin-bottom: 40px;
  color: #333;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.product-card {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.product-card h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
}

.product-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.product-card .price {
  font-size: 24px;
  font-weight: bold;
  color: #ff4d4f;
  margin-bottom: 20px;
}
</style>
