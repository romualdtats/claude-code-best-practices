# Claude Code Hook: 防止"你是对的"敷衍回复

**来源**: [GitHub Gist](https://gist.github.com/ljw1004/34b58090c16ee6d5e6f13fce07463a31)  
**作者**: ljw1004  
**日期**: 2025-08-05  
**类型**: Claude Code Hook / 脚本工具

## 概述

这是一个 Claude Code 的钩子脚本，用于防止 AI 助手使用过于简单或讨好的语言回应用户。脚本会检测助手是否使用了类似"你是对的"、"You're right"等敷衍性表达，如果发现，会自动插入系统提示，要求助手提供更深入的技术分析。

## Claude Code Hooks 背景

Claude Code 的 Hooks 是一种事件驱动机制，允许在特定事件发生时执行自定义脚本。目前支持的主要类型包括：

### Hooks 类型
- **UserPromptSubmit**: 在用户提交提示时触发，可以检查和修改输入内容
- **其他类型**: 用于 CI/CD 集成、自动化流程和代码审查

### Hooks 工作原理
1. **事件触发**: 当特定事件发生时（如用户提交提示）
2. **脚本执行**: Claude Code 自动执行配置的脚本
3. **输入处理**: 脚本接收 JSON 格式的输入数据
4. **输出处理**: 脚本的输出会被附加到 Claude 的上下文中
5. **继续执行**: Claude Code 使用修改后的上下文继续处理

## 脚本功能

### 1. 检测机制
- 读取 Claude Code 的对话记录文件
- 检查最近 5 条助手的回复
- 识别多种敷衍性表达：
  - 英文：`You're right`, `you are absolutely correct`
  - 韩文：`사용자가 맞다`, `맞습니다`

### 2. 触发条件
当助手回复中包含以下短语时，脚本会触发：
- `You're right` / `you are right`
- `absolutely correct`
- `사용자가 맞다` (韩文)
- `맞습니다` (韩文)

### 3. 系统提示内容
脚本会插入 `<system-reminder>`，要求助手：

**禁止行为**：
- 使用"你是对的"或类似表达
- 避免盲目同意用户

**必须行为**：
- 提供实质性的技术分析
- 寻找用户输入中的缺陷、漏洞、反例
- 检查无效假设
- 如果用户确实正确，必须冷静地说明具体原因

## 安装方法

### 1. 下载脚本
```bash
# 下载脚本到本地
curl -s https://gist.githubusercontent.com/ljw1004/34b58090c16ee6d5e6f13fce07463a31/raw/you_are_not_right.sh -o you_are_not_right.sh

# 设置执行权限（必需）
chmod +x you_are_not_right.sh
```

### 2. 脚本保存位置
脚本可以保存在以下位置：
- **推荐**: `~/.claude-code/hooks/` 目录（如果存在）
- **备选**: 项目根目录或任意可访问的目录
- **注意**: 确保脚本有执行权限，且路径在 Claude Code 中可访问

### 3. 在 Claude Code 中配置
1. **启动 Claude Code**：
   ```bash
   claude
   ```

2. **配置 Hook**：
   - 在 Claude Code 中输入 `/hooks`
   - 选择 `UserPromptSubmit` 事件类型
   - 选择 `Add a new hook` 选项
   - 选择下载的脚本文件路径

3. **验证配置**：
   - 输入 `/hooks` 查看已配置的 hooks
   - 确认脚本已正确加载

## 工作原理

### 脚本执行流程
1. **读取输入**: 从 stdin 读取 JSON 数据，获取对话记录路径
2. **分析历史**: 检查最近 5 条助手回复
3. **模式匹配**: 使用正则表达式检测敷衍性表达
4. **插入提示**: 如果检测到问题，输出系统提示
5. **退出**: 脚本退出码为 0 时，Claude Code 会将输出附加到上下文

### 输入数据格式
脚本接收的 JSON 输入包含：
```json
{
  "transcript_path": "/path/to/conversation/transcript.json",
  "user_prompt": "用户的输入内容",
  "session_id": "会话ID"
}
```

### 示例效果

**触发前**（敷衍回复）：
```
用户: 空输入导致失败，我们应该添加空值检查。
助手: 你是对的，这确实是个问题。
```

**触发后**（深入分析）：
```
用户: 空输入导致失败，我们应该添加空值检查。
助手: 这种方法可以避免当前问题，但不够优雅。
它没有考虑空字符串的边缘情况。更通用的方法是检查假值。
```

## 为什么重要？

### 问题背景
Claude Code 有时会用过于简单或讨好的语言回应用户，这可能导致：
- 用户错过代码改进机会
- 降低工具的专业性
- 缺乏深度技术分析

### 解决方案
通过强制助手进行更深入的思考和反馈，这个脚本：
- 提升了 Claude Code 在编程场景中的实用性
- 促使更高质量的对话
- 避免空洞的赞同，提供建设性建议

## 技术细节

### 脚本特点
- **多语言支持**: 检测英文和韩文敷衍表达
- **精确匹配**: 只检查回复前 80 个字符，避免误判
- **安全退出**: 未检测到问题时直接退出，不影响正常使用
- **错误处理**: 包含完整的错误处理和调试信息

### 正则表达式模式
```bash
# 英文模式
.*[Yy]ou.*(right|correct)
.*[Aa]bsolutely

# 韩文模式  
.*사용자가.*맞다
.*맞습니다
```

### 依赖要求
- **jq**: 用于解析 JSON 数据
- **bash**: 脚本执行环境
- **grep**: 用于文本搜索

## 使用建议

1. **配合其他钩子**: 可以与其他 Claude Code 钩子配合使用
2. **定期更新**: 关注脚本更新，获取新功能
3. **自定义扩展**: 可以根据需要添加其他语言的检测模式
4. **效果评估**: 观察使用前后对话质量的变化
5. **调试技巧**: 使用 `set -x` 启用调试模式查看执行过程

## 故障排除

### 常见问题
1. **脚本无权限**: 确保执行了 `chmod +x you_are_not_right.sh`
2. **jq 未安装**: 安装 JSON 处理器 `brew install jq` (macOS) 或 `apt install jq` (Linux)
3. **路径错误**: 确保脚本路径在 Claude Code 中可访问
4. **无效果**: 检查 `/hooks` 命令确认脚本已正确加载

### 调试方法
```bash
# 测试脚本是否可执行
./you_are_not_right.sh

# 启用调试模式
bash -x you_are_not_right.sh
```

## 相关资源

- [原始 GitHub Gist](https://gist.github.com/ljw1004/34b58090c16ee6d5e6f13fce07463a31)
- [Claude Code 官方文档](https://docs.anthropic.com/claude/docs/claude-code)
- [Claude Code Hooks 文档](https://docs.anthropic.com/claude/docs/claude-code-hooks)
- [Claude Code 最佳实践](https://docs.anthropic.com/claude/docs/claude-code-best-practices)

---

*这个脚本是 Claude Code 社区的重要贡献，展示了如何通过钩子机制来改善 AI 助手的回复质量。* 