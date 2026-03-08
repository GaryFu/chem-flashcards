#!/bin/zsh

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PORT=8888

echo "${BLUE}🚀 正在检测系统状态及端口 $PORT 占用情况...${NC}"

# 使用 lsof 查找端口占用
PID=$(lsof -t -i:$PORT)

if [ -n "$PID" ]; then
    echo "${YELLOW}⚠️  检测到系统已在运行 (PID: $PID)... 正在执行重启逻辑...${NC}"
    kill -9 $PID
    echo "${GREEN}✅ 旧进程已停止。${NC}"
else
    echo "${GREEN}✅ 端口 $PORT 处于闲置状态，准备启动。${NC}"
fi

# 1. 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "${BLUE}📦 正在安装依赖项目...${NC}"
    npm install
else
    echo "${GREEN}✅ 依赖已检测且已安装。${NC}"
fi

# 2. 构建
echo "${BLUE}🛠️ 正在执行构建校验...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo "${GREEN}✅ 构建成功！${NC}"
else
    echo "${RED}❌ 构建失败，请检查代码。${NC}"
    exit 1
fi

# 3. 启动
echo "${BLUE}✨ 正在为您开启化学闪卡 (端口: $PORT, 允许外部访问)...${NC}"
# 使用 --port 强制指定 8888, --host 允许外部访问
npm run dev -- --port $PORT --host 0.0.0.0 --open
