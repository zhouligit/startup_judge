<template>
  <nav class="nav-bar">
    <div class="nav-left">
      <h1 class="logo">创业判官</h1>
    </div>
    <div class="nav-right">
      <router-link to="/" class="nav-link">
        <el-icon><HomeFilled /></el-icon>
        <span>首页</span>
      </router-link>
      <router-link to="/questions" class="nav-link">
        <el-icon><DocumentChecked /></el-icon>
        <span>题库</span>
      </router-link>
      <router-link to="/scenarios" class="nav-link">
        <el-icon><DataAnalysis /></el-icon>
        <span>情景推演</span>
      </router-link>
      <router-link to="/defense" class="nav-link">
        <el-icon><ChatLineRound /></el-icon>
        <span>辩护博弈</span>
      </router-link>
      <router-link v-if="showPaidNav" to="/products" class="nav-link">
        <el-icon><ShoppingCart /></el-icon>
        <span>付费服务</span>
      </router-link>
      <router-link to="/my" class="nav-link">
        <el-icon><User /></el-icon>
        <span>我的</span>
      </router-link>
      <template v-if="!isLoggedIn">
        <router-link to="/auth/login" class="nav-link login-link">
          <el-icon><Key /></el-icon>
          <span>登录/注册</span>
        </router-link>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '../store'
import { HomeFilled, DocumentChecked, DataAnalysis, ChatLineRound, ShoppingCart, User, Key } from '@element-plus/icons-vue'

const userStore = useUserStore()
const isLoggedIn = userStore.isLoggedIn

/** 顶部「付费服务」入口，需要展示时改为 true */
const showPaidNav = false
</script>

<style scoped>
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.nav-left .logo {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.nav-right {
  display: flex;
  gap: 20px;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-link:hover {
  color: #667eea;
  background: #f0f0f0;
}

.nav-link.router-link-active {
  color: #667eea;
  font-weight: bold;
}
</style>
