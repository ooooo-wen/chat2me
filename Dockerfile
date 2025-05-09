# 使用官方 Node.js 映像
FROM node:alpine

# 設定工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 lock
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製所有檔案
COPY . .

# 開放 port
EXPOSE 3000

# 啟動指令
CMD ["npm", "start"]
