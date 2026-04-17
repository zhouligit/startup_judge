import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null
  }),
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  actions: {
    setUser(user) {
      this.user = user
    },
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    }
  }
})

export const useQuestionStore = defineStore('question', {
  state: () => ({
    questions: [],
    answers: [],
    result: null
  }),
  actions: {
    setQuestions(questions) {
      this.questions = questions
    },
    setAnswers(answers) {
      this.answers = answers
    },
    setResult(result) {
      this.result = result
    },
    reset() {
      this.questions = []
      this.answers = []
      this.result = null
    }
  }
})

export const useScenarioStore = defineStore('scenario', {
  state: () => ({
    scenarios: [],
    currentScenario: null,
    selectedOption: null,
    aiComment: null
  }),
  actions: {
    setScenarios(scenarios) {
      this.scenarios = scenarios
    },
    setCurrentScenario(scenario) {
      this.currentScenario = scenario
    },
    setSelectedOption(option) {
      this.selectedOption = option
    },
    setAiComment(comment) {
      this.aiComment = comment
    },
    reset() {
      this.currentScenario = null
      this.selectedOption = null
      this.aiComment = null
    }
  }
})

export const useDefenseStore = defineStore('defense', {
  state: () => ({
    projectInfo: null,
    question: null,
    defense: '',
    response: null
  }),
  actions: {
    setProjectInfo(info) {
      this.projectInfo = info
    },
    setQuestion(question) {
      this.question = question
    },
    setDefense(defense) {
      this.defense = defense
    },
    setResponse(response) {
      this.response = response
    },
    reset() {
      this.projectInfo = null
      this.question = null
      this.defense = ''
      this.response = null
    }
  }
})

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    orders: [],
    currentProduct: null
  }),
  actions: {
    setProducts(products) {
      this.products = products
    },
    setOrders(orders) {
      this.orders = orders
    },
    setCurrentProduct(product) {
      this.currentProduct = product
    },
    addOrder(order) {
      this.orders.push(order)
    }
  }
})
