<template>
  <div class="questions-container">
    <Navbar />
    <h1>通用创业题库</h1>
    <p>请回答以下问题，我们将评估你的创业潜力</p>
    
    <div v-if="loading" class="loading">
      <el-loading :fullscreen="true" text="加载中..."></el-loading>
    </div>
    
    <div v-else-if="questions.length > 0" class="questions-list">
      <el-card v-for="(question, index) in questions" :key="question.id" class="question-card">
        <template #header>
          <div class="question-header">
            <span class="question-number">{{ index + 1 }}. {{ question.category }}</span>
          </div>
        </template>
        <div class="question-content">
          <p class="question-text">{{ question.question }}</p>
          <el-radio-group v-model="answers[question.id]" class="options">
            <el-radio v-for="option in question.options" :key="option.id" :label="option.id">
              {{ option.text }}
            </el-radio>
          </el-radio-group>
        </div>
      </el-card>
      
      <div class="submit-button">
        <el-button type="primary" size="large" @click="submitAnswers" :disabled="!canSubmit">
          提交答案
        </el-button>
      </div>
    </div>
    
    <div v-else-if="result" class="result-container">
      <el-card class="result-card">
        <template #header>
          <div class="result-header">
            <span>评估结果</span>
          </div>
        </template>
        <div class="result-content">
          <div class="result-item">
            <span class="result-label">总得分：</span>
            <span class="result-value">{{ result.total_score }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">评估等级：</span>
            <span class="result-value">{{ result.level }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">评估意见：</span>
            <span class="result-value">{{ result.message }}</span>
          </div>
          <div class="feedback-list">
            <h3>详细反馈：</h3>
            <el-divider></el-divider>
            <div v-for="(item, index) in result.feedback" :key="index" class="feedback-item">
              <p class="feedback-question">{{ item.question }}</p>
              <p class="feedback-text">{{ item.feedback }}</p>
            </div>
          </div>
        </div>
        <div class="result-actions">
          <el-button @click="reset">重新测试</el-button>
          <el-button type="primary" @click="navigateTo('scenarios')">进入情景推演</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionStore } from '../../store'
import { questionsAPI } from '../../services/api'
import Navbar from '../../components/Navbar.vue'

const router = useRouter()
const questionStore = useQuestionStore()
const loading = ref(true)
const answers = reactive({})

const questions = computed(() => questionStore.questions)
const result = computed(() => questionStore.result)

const canSubmit = computed(() => {
  return questions.value.length > 0 && Object.keys(answers).length === questions.value.length
})

const loadQuestions = async () => {
  try {
    const data = await questionsAPI.getQuestions()
    questionStore.setQuestions(data)
    // 初始化答案对象
    data.forEach(question => {
      answers[question.id] = ''
    })
  } catch (error) {
    console.error('加载题库失败:', error)
    alert('加载题库失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const submitAnswers = async () => {
  if (!canSubmit.value) return
  
  loading.value = true
  try {
    // 格式化答案数据
    const formattedAnswers = Object.entries(answers).map(([question_id, option_id]) => ({
      question_id,
      option_id
    }))
    
    const data = await questionsAPI.submitAnswers({ answers: formattedAnswers })
    questionStore.setResult(data)
  } catch (error) {
    console.error('提交答案失败:', error)
    alert('提交答案失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const reset = () => {
  questionStore.reset()
  loadQuestions()
}

const navigateTo = (path) => {
  router.push(`/${path}`)
}

onMounted(() => {
  loadQuestions()
})
</script>

<style scoped>
.questions-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

.questions-container h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.questions-container p {
  text-align: center;
  margin-bottom: 40px;
  color: #666;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-card {
  margin-bottom: 20px;
}

.question-header {
  font-weight: bold;
  color: #333;
}

.question-number {
  font-size: 16px;
}

.question-content {
  margin-top: 15px;
}

.question-text {
  font-size: 16px;
  margin-bottom: 20px;
  color: #333;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.submit-button {
  margin-top: 40px;
  text-align: center;
}

.result-container {
  margin-top: 40px;
}

.result-card {
  margin-bottom: 40px;
}

.result-header {
  font-weight: bold;
  color: #333;
}

.result-content {
  margin-top: 20px;
}

.result-item {
  margin-bottom: 15px;
}

.result-label {
  font-weight: bold;
  color: #333;
  margin-right: 10px;
}

.result-value {
  color: #666;
}

.feedback-list {
  margin-top: 30px;
}

.feedback-list h3 {
  margin-bottom: 15px;
  color: #333;
}

.feedback-item {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.feedback-question {
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.feedback-text {
  color: #666;
  line-height: 1.6;
}

.result-actions {
  margin-top: 30px;
  display: flex;
  gap: 20px;
  justify-content: center;
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
