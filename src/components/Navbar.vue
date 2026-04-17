<template>
  <nav class="nav-bar">
    <div class="nav-left">
      <h1 class="logo">创业判官</h1>
    </div>
    <div class="nav-right">
      <router-link to="/" class="nav-link">首页</router-link>
      <router-link to="/questions" class="nav-link">题库</router-link>
      <router-link to="/scenarios" class="nav-link">情景推演</router-link>
      <router-link to="/defense" class="nav-link">辩护博弈</router-link>
      <router-link to="/products" class="nav-link">付费服务</router-link>
      <router-link to="/my" class="nav-link">我的</router-link>
    </div>
  </nav>
</template>

<script setup>
// 导航栏组件
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
