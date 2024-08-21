HD SHOP

### update 2/1/2024

-  POST theo id không lôi, nhưng PUT theo id = 0 sẽ sai

### upate 17/1/2024

-  fix không xuống hàng phần cấu hình sản phẩm
-  fix dư thừa product attribute
-  Sửa giao diện

### update thu 2 22/1/2024

-  Trang register bị lỗi dấn đến không load web site trên iphone 7 Plus
-  Lỗi cụ thể lò do regex không hổ trợ

### update thu 4 22/1/2024

-  Thêm bảng Price_Range để filter theo giá

### update 16/4/2024

-  refactoring code

### update 21/8/2024
- Add rating

```
         // const payload = action.payload;
         const payload = structuredClone(action.payload);
```

-  this cause reducer call twice
