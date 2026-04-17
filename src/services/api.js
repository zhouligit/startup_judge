import axios from 'axios'

// 创建axios实例
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 从localStorage中获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 认证相关API
export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (userData) => api.post('/api/auth/login', userData)
}

// 题库相关API
export const questionsAPI = {
  getQuestions: () => api.get('/api/questions/'),
  submitAnswers: (answers) => api.post('/api/questions/submit', answers)
}

// 情景推演相关API
export const scenariosAPI = {
  getScenarios: () => api.get('/api/scenarios'),
  getScenario: (id) => api.get(`/api/scenarios/${id}`),
  submitChoice: (data) => api.post('/api/scenarios/submit', data)
}

// 辩护博弈相关API
export const defenseAPI = {
  getQuestion: (projectInfo) => api.post('/api/defense/question', projectInfo),
  submitDefense: (defense) => api.post('/api/defense/submit', defense)
}

// 付费产品相关API
export const productsAPI = {
  getProducts: () => api.get('/api/products/'),
  purchaseProduct: (productId) => api.post('/api/products/purchase', { product_id: productId }),
  getProductContent: (productId) => api.get(`/api/products/content/${productId}`)
}

// 裂变分享相关API
export const shareAPI = {
  generateShare: (data) => api.post('/api/share/generate', data),
  processShare: (shareCode) => api.get(`/api/share/process/${shareCode}`)
}

export default api
