<template>
  <div class="scenarios-container">
    <Navbar />
    <h1>情景推演</h1>
    <p>模拟创业过程中的各种挑战，AI预判你如何失败</p>
    
    <div v-if="loading" class="loading">
      <el-loading :fullscreen="true" text="加载中..."></el-loading>
    </div>
    
    <div v-else-if="scenarios.length > 0" class="scenarios-list">
      <el-card v-for="scenario in scenarios" :key="scenario.id" class="scenario-card">
        <template #header>
          <div class="scenario-header">
            <span class="scenario-title">{{ scenario.title }}</span>
            <span class="scenario-industry">{{ scenario.industry }}</span>
          </div>
        </template>
        <div class="scenario-content">
          <el-button type="primary" @click="selectScenario(scenario.id)">
            开始推演
          </el-button>
        </div>
      </el-card>
    </div>
    
    <div v-else-if="currentScenario" class="scenario-detail">
      <el-card class="detail-card">
        <template #header>
          <div class="detail-header">
            <span>{{ currentScenario.title }}</span>
            <el-button @click="backToScenarios">返回列表</el-button>
          </div>
        </template>
        <div class="detail-content">
          <p class="scenario-description">{{ currentScenario.description }}</p>
          
          <div class="challenges">
            <h3>挑战：</h3>
            <ul>
              <li v-for="(challenge, index) in currentScenario.challenges" :key="index">
                {{ challenge }}
              </li>
            </ul>
          </div>
          
          <div class="risks">
            <h3>风险：</h3>
            <ul>
              <li v-for="(risk, index) in currentScenario.risks" :key="index">
                {{ risk }}
              </li>
            </ul>
          </div>
          
          <div class="options">
            <h3>选择应对方案：</h3>
            <el-radio-group v-model="selectedOptionId">
              <el-radio v-for="option in currentScenario.options" :key="option.id" :label="option.id">
                {{ option.text }}
              </el-radio>
            </el-radio-group>
          </div>
          
          <div class="style-selector">
            <h3>选择AI风格：</h3>
            <el-radio-group v-model="selectedStyle">
              <el-radio label="vc">冷血VC</el-radio>
              <el-radio label="cto">暴躁CTO</el-radio>
              <el-radio label="operation">刻薄运营</el-radio>
            </el-radio-group>
          </div>
          
          <div class="submit-button">
            <el-button type="primary" @click="submitChoice" :disabled="!selectedOptionId">
              提交选择
            </el-button>
          </div>
        </div>
      </el-card>
      
      <div v-if="aiComment" class="ai-comment-card">
        <el-card class="comment-card">
          <template #header>
            <div class="comment-header">
              <span>AI点评</span>
            </div>
          </template>
          <div class="comment-content">
            <p class="ai-style">{{ getStyleName(selectedStyle) }}：</p>
            <p class="ai-text">{{ aiComment.comment }}</p>
            <p class="outcome">结果：{{ selectedOption.outcome }}</p>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useScenarioStore } from '../../store'
import { scenariosAPI } from '../../services/api'
import Navbar from '../../components/Navbar.vue'

const router = useRouter()
const scenarioStore = useScenarioStore()
const loading = ref(true)
const selectedOptionId = ref('')
const selectedStyle = ref('vc')

const scenarios = computed(() => scenarioStore.scenarios)
const currentScenario = computed(() => scenarioStore.currentScenario)
const aiComment = computed(() => scenarioStore.aiComment)

const selectedOption = computed(() => {
  if (!currentScenario.value || !selectedOptionId.value) return {}
  return currentScenario.value.options.find(option => option.id === selectedOptionId.value) || {}
})

const getStyleName = (style) => {
  const styleMap = {
    'vc': '冷血VC',
    'cto': '暴躁CTO',
    'operation': '刻薄运营'
  }
  return styleMap[style] || style
}

const loadScenarios = async () => {
  try {
    const data = await scenariosAPI.getScenarios()
    scenarioStore.setScenarios(data)
  } catch (error) {
    console.error('加载情景失败:', error)
    alert('加载情景失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const selectScenario = async (id) => {
  loading.value = true
  try {
    const data = await scenariosAPI.getScenario(id)
    scenarioStore.setCurrentScenario(data)
  } catch (error) {
    console.error('加载情景详情失败:', error)
    alert('加载情景详情失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const submitChoice = async () => {
  if (!selectedOptionId.value) return
  
  loading.value = true
  try {
    const data = await scenariosAPI.submitChoice({
      scenario_id: currentScenario.value.id,
      option_id: selectedOptionId.value,
      style: selectedStyle.value
    })
    scenarioStore.setAiComment(data.ai_comment)
  } catch (error) {
    console.error('提交选择失败:', error)
    alert('提交选择失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const backToScenarios = () => {
  scenarioStore.reset()
}

onMounted(() => {
  loadScenarios()
})
</script>

<style scoped>
.scenarios-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

.scenarios-container h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.scenarios-container p {
  text-align: center;
  margin-bottom: 40px;
  color: #666;
}

.scenarios-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.scenario-card {
  margin-bottom: 20px;
}

.scenario-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scenario-title {
  font-weight: bold;
  color: #333;
}

.scenario-industry {
  background-color: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.scenario-content {
  margin-top: 15px;
  text-align: center;
}

.scenario-detail {
  margin-top: 40px;
}

.detail-card {
  margin-bottom: 40px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-header span {
  font-weight: bold;
  color: #333;
}

.scenario-description {
  font-size: 16px;
  margin-bottom: 30px;
  color: #333;
  line-height: 1.6;
}

.challenges,
.risks,
.options,
.style-selector {
  margin-bottom: 30px;
}

.challenges h3,
.risks h3,
.options h3,
.style-selector h3 {
  margin-bottom: 15px;
  color: #333;
}

.challenges ul,
.risks ul {
  list-style-type: disc;
  margin-left: 20px;
  color: #666;
}

.challenges li,
.risks li {
  margin-bottom: 10px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.style-selector {
  display: flex;
  gap: 20px;
}

.submit-button {
  margin-top: 40px;
  text-align: center;
}

.ai-comment-card {
  margin-top: 40px;
}

.comment-card {
  border-left: 4px solid #409eff;
}

.comment-header {
  font-weight: bold;
  color: #333;
}

.ai-style {
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.ai-text {
  margin-bottom: 20px;
  color: #666;
  line-height: 1.6;
}

.outcome {
  font-weight: bold;
  color: #ff4d4f;
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
