export const items = [{
  amount: 100, // 付款金額
  currency: 'TWD', // 幣別
  orderId: '123', // 訂單編號
  packages: [
    {
      id: '123', // 商品清冊 id
      amount: 10, // 商品總價
      products: [
        {
          id: '123', // 商品 id
          amount: 99, // 商品價格
          name: '商品名稱',
          quantity: 2, // 數量
          price: 198 // 商品金額
        }
      ],
      redirectUrls: {
        confirmUrl: '', // 成功執行
        cancelUrl: '' // 失敗執行
      }
    }
  ]
}]
