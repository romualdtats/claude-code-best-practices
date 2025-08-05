# Claude Code Router

## 项目概述

Claude Code Router 是一个强大的路由工具，允许您以 Claude Code 为基础构建编码基础设施，同时让您决定如何与模型交互，同时享受 Anthropic 的更新。

**GitHub**: https://github.com/musistudio/claude-code-router  
**Stars**: 10.3k+  
**License**: MIT

## 核心特性

### 🚀 多模型路由
- **智能路由**: 根据任务类型自动选择合适的模型
- **成本优化**: 使用更小的本地模型处理后台任务
- **长上下文处理**: 专门处理长上下文任务（>60K tokens）
- **推理增强**: 为推理密集型任务选择专用模型

### 🔧 支持的提供商
- **OpenAI**: 完整的 OpenAI API 支持
- **Anthropic**: 原生 Claude API 支持
- **DeepSeek**: 适配 DeepSeek API
- **Gemini**: 支持 Google Gemini API
- **OpenRouter**: 多提供商路由支持
- **Groq**: 高性能推理支持

### 🛠️ 转换器系统
- **maxtoken**: 设置特定的 max_tokens 值
- **tooluse**: 通过 tool_choice 优化工具使用
- **reasoning**: 处理 reasoning_content 字段
- **sampling**: 处理温度、top_p、top_k 等采样参数
- **enhancetool**: 为工具调用参数添加错误容忍层

## 安装和配置

### 快速开始

```bash
# 安装
bunx @musistudio/claude-code-router@latest

# 创建配置目录
mkdir -p $HOME/.claude-code-router

# 复制示例配置
cp config.example.json $HOME/.claude-code-router/config.json
```

### 基础配置

```json
{
  "log": true,
  "OPENAI_API_KEY": "your-api-key",
  "OPENAI_BASE_URL": "https://api.deepseek.com",
  "OPENAI_MODEL": "deepseek-chat",
  "router": {
    "default": "openrouter,anthropic/claude-3.5-sonnet",
    "background": "openrouter,anthropic/claude-3-haiku",
    "think": "openrouter,anthropic/claude-3.5-sonnet",
    "longContext": "openrouter,anthropic/claude-3.5-sonnet",
    "longContextThreshold": 60000
  }
}
```

## 路由配置

### 默认路由场景

```json
{
  "router": {
    "default": "openrouter,anthropic/claude-3.5-sonnet",
    "background": "openrouter,anthropic/claude-3-haiku",
    "think": "openrouter,anthropic/claude-3.5-sonnet",
    "longContext": "openrouter,anthropic/claude-3.5-sonnet",
    "webSearch": "openrouter,anthropic/claude-3.5-sonnet:online"
  }
}
```

### 动态模型切换

在 Claude Code 中使用 `/model` 命令动态切换模型：

```
/model openrouter,anthropic/claude-3.5-sonnet
```

## 高级功能

### 自定义路由器

创建自定义路由逻辑：

```javascript
// $HOME/.claude-code-router/custom-router.js
module.exports = async function router(req, config) {
  const userMessage = req.body.messages.find((m) => m.role === "user")?.content;

  if (userMessage && userMessage.includes("explain this code")) {
    return "openrouter,anthropic/claude-3.5-sonnet";
  }

  return null; // 回退到默认路由器
};
```

### 子代理路由

在子代理提示开头指定特定模型：

```
<CCR-SUBAGENT-MODEL>openrouter,anthropic/claude-3.5-sonnet</CCR-SUBAGENT-MODEL>
请帮我分析这段代码的潜在优化...
```

### GitHub Actions 集成

在 CI/CD 管道中集成 Claude Code Router：

```yaml
name: Claude Code

on:
  issue_comment:
    types: [created]

jobs:
  claude:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Prepare Environment
        run: |
          curl -fsSL https://bun.sh/install | bash
          mkdir -p $HOME/.claude-code-router
          cat << 'EOF' > $HOME/.claude-code-router/config.json
          {
            "log": true,
            "OPENAI_API_KEY": "${{ secrets.OPENAI_API_KEY }}",
            "OPENAI_BASE_URL": "https://api.deepseek.com",
            "OPENAI_MODEL": "deepseek-chat"
          }
          EOF

      - name: Start Claude Code Router
        run: |
          nohup ~/.bun/bin/bunx @musistudio/claude-code-router@1.0.8 start &

      - name: Run Claude Code
        uses: anthropics/claude-code-action@beta
        env:
          ANTHROPIC_BASE_URL: http://localhost:3456
        with:
          anthropic_api_key: "any-string-is-ok"
```

## 使用场景

### 1. 成本优化
- 使用较小的模型处理简单任务
- 在非高峰时段运行任务
- 智能路由减少 API 调用成本

### 2. 性能优化
- 长上下文任务使用专用模型
- 推理任务使用高性能模型
- 后台任务使用轻量级模型

### 3. 多提供商支持
- 避免单一提供商限制
- 利用不同提供商的优势
- 提高服务可用性

## 最佳实践

### 配置建议

1. **合理设置阈值**: 根据项目需求调整 longContextThreshold
2. **监控使用情况**: 启用日志记录监控模型使用
3. **定期更新**: 保持工具和配置的最新状态
4. **测试配置**: 在生产环境前充分测试配置

### 安全考虑

1. **API 密钥管理**: 使用环境变量存储敏感信息
2. **访问控制**: 限制路由器的访问权限
3. **日志安全**: 避免在日志中记录敏感信息

## 社区支持

### 赞助支持

项目支持多种赞助方式：
- Ko-fi
- PayPal
- 支付宝
- 微信支付

### 贡献指南

欢迎通过以下方式贡献：
1. 提交 Issue 报告问题
2. 创建 Pull Request 贡献代码
3. 分享使用经验和最佳实践
4. 赞助项目发展

## 总结

Claude Code Router 为 Claude Code 提供了强大的路由能力，让您能够：

- **灵活选择模型**: 根据任务需求选择合适的 AI 模型
- **优化成本**: 通过智能路由降低 API 调用成本
- **提升性能**: 为不同任务类型选择最优模型
- **增强可用性**: 支持多种 AI 提供商，避免单点故障

这个工具特别适合需要处理大量 AI 交互的团队和个人开发者，能够显著提升开发效率和成本效益。 