<template>
  <div class="defense-container">
    <h1>辩护博弈</h1>
    <p>与AI毒舌评审团展开辩论，证明你的创业计划可行</p>
    
    <div v-if="loading" class="loading">
      <el-loading :fullscreen="true" text="加载中..."></el-loading>
    </div>
    
    <div v-else-if="!question" class="start-section">
      <el-card class="start-card">
        <template #header>
          <div class="start-header">
            <span>开始辩护</span>
          </div>
        </template>
        <div class="start-content">
          <p>请描述你的创业项目，AI毒舌评审团将对你的项目进行质疑</p>
          <el-form :model="projectForm" :rules="rules" ref="projectFormRef" label-width="100px">
            <el-form-item label="项目名称" prop="name">
              <el-input v-model="projectForm.name" placeholder="请输入项目名称"></el-input>
            </el-form-item>
            <el-form-item label="所属行业" prop="industry">
              <el-select v-model="projectForm.industry" placeholder="请选择行业">
                <el-option label="科技" value="tech"></el-option>
                <el-option label="电商" value="ecommerce"></el-option>
                <el-option label="教育" value="education"></el-option>
                <el-option label="医疗" value="medical"></el-option>
                <el-option label="其他" value="other"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目描述" prop="description">
              <el-input
                v-model="projectForm.description"
                type="textarea"
                rows="4"
                placeholder="请详细描述你的创业项目"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="startDefense">开始辩护</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
    
    <div v-else class="defense-section">
      <el-card class="defense-card">
        <template #header>
          <div class="defense-header">
            <span>AI质疑</span>
          </div>
        </template>
        <div class="defense-content">
          <p class="question-text">{{ question.question }}</p>
          <p class="question-source">{{ getJudgeName(question.judge) }}的质疑</p>
          
          <el-form :model="defenseForm" :rules="defenseRules" ref="defenseFormRef" label-width="80px">
            <el-form-item label="辩护" prop="response">
              <el-input
                v-model="defenseForm.response"
                type="textarea"
                rows="4"
                placeholder="请输入你的辩护"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitDefense" :disabled="!defenseForm.response">
                提交辩护
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      
      <div v-if="response" class="response-card">
        <el-card class="response-card-inner">
          <template #header>
            <div class="response-header">
              <span>AI回应</span>
            </div>
          </template>
          <div class="response-content">
            <p class="response-text">{{ response.response }}</p>
            <p class="response-judge">{{ getJudgeName(question.judge) }}的回应</p>
            
            <div class="defense-actions">
              <el-button @click="getNextQuestion">下一个质疑</el-button>
              <el-button type="primary" @click="reset">重新开始</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDefenseStore } from '../../store'
import { defenseAPI } from '../../services/api'

const router = useRouter()
const defenseStore = useDefenseStore()
const loading = ref(false)

const projectForm = reactive({
  name: '',
  industry: '',
  description: ''
})

const defenseForm = reactive({
  response: ''
})

const rules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  industry: [{ required: true, message: '请选择行业', trigger: 'change' }],
  description: [{ required: true, message: '请输入项目描述', trigger: 'blur' }]
}

const defenseRules = {
  response: [{ required: true, message: '请输入你的辩护', trigger: 'blur' }]
}

const question = ref(null)
const response = ref(null)

const getJudgeName = (judge) => {
  const judgeMap = {
    'vc': '冷血VC',
    'cto': '暴躁CTO',
    'operation': '刻薄运营'
  }
  return judgeMap[judge] || judge
}

const startDefense = async () => {
  loading.value = true
  try {
    const data = await defenseAPI.getDefenseQuestion(projectForm)
    question.value = data
    defenseStore.setQuestion(data)
  } catch (error) {
    console.error('获取质疑失败:', error)
    alert('获取质疑失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const submitDefense = async () => {
  loading.value = true
  try {
    const data = await defenseAPI.submitDefense({
      question_id: question.value.id,
      response: defenseForm.response
    })
    response.value = data
    defenseStore.setResponse(data)
  } catch (error) {
    console.error('提交辩护失败:', error)
    alert('提交辩护失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const getNextQuestion = async () => {
  loading.value = true
  try {
    const data = await defenseAPI.getDefenseQuestion(projectForm)
    question.value = data
    defenseForm.response = ''
    response.value = null
    defenseStore.setQuestion(data)
  } catch (error) {
    console.error('获取下一个质疑失败:', error)
    alert('获取下一个质疑失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const reset = () => {
  projectForm.name = ''
  projectForm.industry = ''
  projectForm.description = ''
  defenseForm.response = ''
  question.value = null
  response.value = null
  defenseStore.reset()
}

onMounted(() => {
  // 初始化时检查是否有缓存的问题
  if (defenseStore.question) {
    question.value = defenseStore.question
  }
  if (defenseStore.response) {
    response.value = defenseStore.response
  }
})
</script>

<style scoped>
.defense-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

.defense-container h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.defense-container p {
  text-align: center;
  margin-bottom: 40px;
  color: #666;
}

.start-section,
.defense-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.start-card,
.defense-card,
.response-card-inner {
  margin-bottom: 20px;
}

.start-header,
.defense-header,
.response-header {
  font-weight: bold;
  color: #333;
}

.start-content,
.defense-content,
.response-content {
  margin-top: 15px;
}

.question-text {
  font-size: 16px;
  margin-bottom: 15px;
  color: #333;
  line-height: 1.6;
}

.question-source {
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
}

.response-text {
  font-size: 16px;
  margin-bottom: 15px;
  color: #333;
  line-height: 1.6;
}

.response-judge {
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
}

.defense-actions {
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
