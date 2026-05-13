import axios from 'axios'

// 由 vite.config.js loadEnv + define 注入；开发模式一般为空，走 Vite proxy
const apiBase = __API_BASE_URL__

// 创建axios实例
const api = axios.create({
  baseURL: apiBase,
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
    // GET/HEAD 无 body 时不带 application/json，减少 CORS 预检与 307 链路上的兼容问题
    const m = (config.method || 'get').toLowerCase()
    if ((m === 'get' || m === 'head') && config.data === undefined) {
      delete config.headers['Content-Type']
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
  login: (userData) => api.post('/api/auth/login', userData),
  getCurrentUser: () => api.get('/api/auth/me')
}

// 题库相关API
export const questionsAPI = {
  // 尾部 / 避免 Starlette 307 到 /api/questions/，跨域时部分浏览器对重定向 CORS 更敏感
  getQuestions: () => api.get('/api/questions/'),
  submitAnswers: (answers) => api.post('/api/questions/submit', answers)
}

// 情景推演相关API
export const scenariosAPI = {
  getScenarios: () => api.get('/api/scenarios/'),
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
  getProductContent: (productId) => api.get(`/api/products/content/${productId}`),
  createPayment: (paymentData) => api.post('/api/products/payment', paymentData)
}

// 提交记录相关API
export const submissionsAPI = {
  getSubmissions: (moduleType) => api.get('/api/submissions/', { params: { module_type: moduleType } }),
  getSubmission: (id) => api.get(`/api/submissions/${id}`)
}

// 裂变分享相关API
export const shareAPI = {
  generateShare: (data) => api.post('/api/share/generate', data),
  processShare: (shareCode) => api.get(`/api/share/process/${shareCode}`)
}

export default api
