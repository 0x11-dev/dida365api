// Cloudflare Worker script for TickTick API

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "default";

  // 登录函数
  async function login_dida365(username, password) {
    const loginResponse = await fetch(
      "https://api.dida365.com/api/v2/user/signon?wc=true&remember=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Device":
            '{"platform":"web","os":"Windows 10","device":"Chrome 102.0.0.0","name":"","version":4226,"id":"628774331068e7035ea5950b","channel":"website","campaign":"","websocket":""}',
        },
        body: JSON.stringify({ username, password }),
      }
    );

    if (loginResponse.ok) {
      const data = await loginResponse.json();
      return data.token || false;
    } else {
      return false;
    }
  }

  // API 操作函数
  async function action_dida365(token, action) {
    const actionResponse = await fetch(
      `https://api.dida365.com/api/v2/${action}`,
      {
        headers: {
          Cookie: `t=${token}`,
        },
      }
    );

    if (actionResponse.ok) {
      return actionResponse.text();
    } else {
      return JSON.stringify({ error: true, message: "API request failed" });
    }
  }

  // 使用环境变量
  const token = await login_dida365(TICKTICK_USERNAME, TICKTICK_PASSWORD);

  if (token) {
    let response;
    switch (action) {
      case "trash":
        response = await action_dida365(token, "project/all/trash/pagination");
        break;
      case "completed":
        response = await action_dida365(token, "project/all/completed");
        break;
      case "list":
        response = await action_dida365(token, "batch/check/0");
        break;
      case "comments":
        const projectId = url.searchParams.get("project");
        const taskId = url.searchParams.get("task");
        if (!projectId || !taskId) {
          response = JSON.stringify({
            error: true,
            message: "projectId与taskId不能为空",
          });
        } else {
          response = await action_dida365(
            token,
            `project/${projectId}/task/${taskId}/comments`
          );
        }
        break;
      default:
        response = JSON.stringify({
          error: true,
          message: {
            list: {
              info: "获取任务组与任务列表",
              method: "GET",
              params: "action=list",
            },
            comments: {
              info: "获取任务清单的评论内容",
              method: "GET",
              params: "action=comments&project={projectId}&task={taskId}",
            },
            completed: {
              info: "获取已完成的任务清单",
              method: "GET",
              params: "action=completed",
            },
            trash: {
              info: "获取垃圾箱内的任务清单",
              method: "GET",
              params: "action=trash",
            },
          },
        });
    }

    return new Response(response, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } else {
    return new Response(
      JSON.stringify({ error: true, message: "Login failed" }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
