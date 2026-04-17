#!/bin/bash

# 前端部署脚本

echo "===== 开始部署前端服务 ====="

# 检查Node.js是否安装
if ! command -v npm &> /dev/null; then
    echo "错误: 未安装Node.js，请先安装Node.js"
    exit 1
fi

# 安装依赖
echo "安装依赖..."
npm install

# 构建项目
echo "构建项目..."
npm run build

# 检查构建是否成功
if [ $? -ne 0 ]; then
    echo "错误: 构建失败"
    exit 1
fi

echo "===== 前端服务部署完成 ====="
echo "构建产物位于 dist 目录"
echo "请将 dist 目录部署到您的Web服务器（如Nginx）"
echo ""
echo "示例Nginx配置："
echo "server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/startup_judge/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}"