<template>
  <div class="products-container">
    <h1>付费产品</h1>
    <p>获取专业的创业评估和建议</p>
    
    <div v-if="loading" class="loading">
      <el-loading :fullscreen="true" text="加载中..."></el-loading>
    </div>
    
    <div v-else-if="products.length > 0" class="products-list">
      <el-card v-for="product in products" :key="product.id" class="product-card">
        <template #header>
          <div class="product-header">
            <span class="product-title">{{ product.name }}</span>
            <span class="product-price">¥{{ product.price }}</span>
          </div>
        </template>
        <div class="product-content">
          <p class="product-description">{{ product.description }}</p>
          <div class="product-features">
            <h3>包含内容：</h3>
            <ul>
              <li v-for="(feature, index) in product.features" :key="index">
                {{ feature }}
              </li>
            </ul>
          </div>
          <el-button type="primary" @click="purchaseProduct(product.id)">
            立即购买
          </el-button>
        </div>
      </el-card>
    </div>
    
    <div v-else-if="orderResponse" class="order-success">
      <el-card class="success-card">
        <template #header>
          <div class="success-header">
            <span>购买成功</span>
          </div>
        </template>
        <div class="success-content">
          <el-alert
            title="购买成功！"
            type="success"
            show-icon
          ></el-alert>
          <p class="order-info">订单号：{{ orderResponse.order_id }}</p>
          <p class="order-info">产品：{{ orderResponse.product_name }}</p>
          <p class="order-info">价格：¥{{ orderResponse.price }}</p>
          <el-button type="primary" @click="viewProductContent(orderResponse.product_id)">
            查看内容
          </el-button>
        </div>
      </el-card>
    </div>
    
    <div v-else-if="productContent" class="product-content-view">
      <el-card class="content-card">
        <template #header>
          <div class="content-header">
            <span>{{ productContent.name }}</span>
            <el-button @click="backToProducts">返回产品列表</el-button>
          </div>
        </template>
        <div class="content-body">
          <div v-for="(section, index) in productContent.content" :key="index" class="content-section">
            <h3>{{ section.title }}</h3>
            <p>{{ section.text }}</p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../../store'
import { productsAPI } from '../../services/api'

const router = useRouter()
const productStore = useProductStore()
const loading = ref(true)

const products = computed(() => productStore.products)
const orderResponse = computed(() => productStore.orderResponse)
const productContent = computed(() => productStore.productContent)

const loadProducts = async () => {
  try {
    const data = await productsAPI.getProducts()
    productStore.setProducts(data)
  } catch (error) {
    console.error('加载产品失败:', error)
    alert('加载产品失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const purchaseProduct = async (productId) => {
  loading.value = true
  try {
    const data = await productsAPI.purchaseProduct({ product_id: productId })
    productStore.setOrderResponse(data)
  } catch (error) {
    console.error('购买产品失败:', error)
    alert('购买产品失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const viewProductContent = async (productId) => {
  loading.value = true
  try {
    const data = await productsAPI.getProductContent(productId)
    productStore.setProductContent(data)
  } catch (error) {
    console.error('获取产品内容失败:', error)
    alert('获取产品内容失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const backToProducts = () => {
  productStore.reset()
  loadProducts()
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.products-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

.products-container h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.products-container p {
  text-align: center;
  margin-bottom: 40px;
  color: #666;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-card {
  margin-bottom: 20px;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-title {
  font-weight: bold;
  color: #333;
}

.product-price {
  font-weight: bold;
  color: #ff4d4f;
}

.product-content {
  margin-top: 15px;
}

.product-description {
  font-size: 14px;
  margin-bottom: 20px;
  color: #666;
  line-height: 1.6;
}

.product-features {
  margin-bottom: 20px;
}

.product-features h3 {
  margin-bottom: 10px;
  color: #333;
  font-size: 14px;
}

.product-features ul {
  list-style-type: disc;
  margin-left: 20px;
  color: #666;
  font-size: 14px;
}

.product-features li {
  margin-bottom: 5px;
}

.order-success,
.product-content-view {
  margin-top: 40px;
}

.success-card,
.content-card {
  margin-bottom: 40px;
}

.success-header,
.content-header {
  font-weight: bold;
  color: #333;
}

.success-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.success-content {
  margin-top: 20px;
}

.order-info {
  margin-top: 15px;
  color: #666;
}

.content-body {
  margin-top: 20px;
}

.content-section {
  margin-bottom: 30px;
}

.content-section h3 {
  margin-bottom: 10px;
  color: #333;
}

.content-section p {
  color: #666;
  line-height: 1.6;
  text-align: left;
  margin-bottom: 10px;
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
