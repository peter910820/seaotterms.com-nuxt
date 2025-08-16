# Data Storage

- Api回來的msg會儲存在*sessionStorage*
  - statusCode: 目前除了當作API statusCode以外，同時還當作**狀態的表示碼**(區分不同狀況用)
  - 前端錯誤代碼:
    | 錯誤代碼 | 訊息描述 |
    | ----- | ------- |
    | EX_00 | 全局通用錯誤 |
    | EC_00 | 客戶端通用錯誤 |

> [!NOTICE]
> 這邊規則目前有考慮重新調整
