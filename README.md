# Dida365Api

基于滴答清单的 JSON API 小东西

---

# 1. 使用方法

举个例子，获取任务组与任务列表：

[https://ticktick.editors.workers.dev/?action=list](https://ticktick.editors.workers.dev/?action=list)

```json
{
  "list": {
    "info": "获取任务组与任务列表",
    "method": "GET",
    "params": "action=list"
  },
  "comments": {
    "info": "获取任务清单的评论内容",
    "method": "GET",
    "params": "action=comments&project={projectId}&task={taskId}"
  },
  "completed": {
    "info": "获取已完成的任务清单",
    "method": "GET",
    "params": "action=completed"
  },
  "trash": {
    "info": "获取垃圾箱内的任务清单",
    "method": "GET",
    "params": "action=trash"
  }
}
```

---

# 2. 部署到 Cloudflare Worker

您可以轻松地将此 API 部署到 Cloudflare Worker。只需点击下面的按钮即可开始部署过程：

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/0x11-dev/dida365api)

# 3. 使用方式

在发送请求时,需要在 header 中包含以下信息:

- `X-TickTick-Username`: 您的滴答清单邮箱
- `X-TickTick-Password`: 您的滴答清单密码

例如,使用 curl 发送请求:

```bash
curl -H "X-TickTick-Username: your_email@example.com" -H "X-TickTick-Password: your_password" https://your-worker.your-subdomain.workers.dev?action=list
```
