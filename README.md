# seaotterms.com-nuxt

## 注意事項:

- 目前只要有API交互，就必須處理回傳的userInfo

- SSR階段不讓他進行任何userinfo的獲取，將這部分完全交給CSR
- 如果有頁面是非公開頁面(是需要登入的)，那就讓該頁面資料的useeFetch增加lazy: true，讓資料獲取在CSR階段才執行
- 這樣可以避免SSR階段拿不到資料，CSR也不會重新發送請求的狀況
