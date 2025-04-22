# AstraFlow
✨Conversational UI Framework for LLMs.

2025.4.17 更新了前端 deepseek API 初版架构的雏形，实现了简单的API调用和流式返回的功能.

TodoList:
- 实现文件上传功能.官方的DeepSeek API不支持文件上传，可能需要支持更多模型的API.
- 实现多轮持续对话功能.DeepSeek API是单轮无状态的，需要在上传的时候带上历史对话记录.
- 实现多模型切换功能.预计支持DeepSeek、Claude、ChatGPT.
- 支持深度思考
- 支持前端Markdown渲染
- 美化界面

2025.4.20 弄了一晚上，终于搞好了思维链的前端渲染支持
2025.4.21 react-markdown 在新版本不支持inline参数了，很头疼。
好在有大佬写过博客踩过坑：
[React的Markdown渲染](https://cytrogen.icu/posts/c0fc)
想搞latex渲染，试了几个库都感觉效果不是很好，暂时搁置了。
2025.4.22 修了一些小bug，感觉更ok了，顺便把主页变的更炫酷了一点