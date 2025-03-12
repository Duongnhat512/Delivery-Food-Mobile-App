# Delivery Food Mobile App

## Giới thiệu
Dự án **Delivery Food Mobile App** là một ứng dụng đặt và giao đồ ăn trực tuyến, giúp người dùng dễ dàng tìm kiếm, đặt hàng và theo dõi đơn hàng từ các nhà hàng địa phương.

## Cấu trúc thư mục
```
├── backend/             # Backend server sử dụng Node.js và Firebase
│   ├── app.js          # Tệp chính của server
│   ├── index.js        # Khởi chạy server
│   ├── src/
│   │   ├── config/      # Cấu hình Firebase, view engine
│   │   ├── controllers/ # Xử lý logic ứng dụng
│   │   ├── middlewares/ # Middleware xác thực
│   │   ├── models/      # Mô hình dữ liệu
│   │   └── routes/      # Định tuyến API
│   ├── package.json     # Cấu hình backend
│   ├── .gitignore       # Tệp ignore Git
│   └── serviceAccountKey.json # Khóa Firebase
│
└── delivery-food/       # Ứng dụng mobile sử dụng React Native
    ├── App.js          # Tệp chính của ứng dụng
    ├── package.json    # Cấu hình frontend
    ├── app/            # Chứa các màn hình và navigation
    ├── components/     # Các thành phần giao diện
    ├── assets/         # Hình ảnh, font chữ
    └── .gitignore      # Tệp ignore Git
```

## Công nghệ sử dụng
- **Frontend**: React Native, Expo
- **Backend**: Node.js, Express.js, Firebase
- **Database**: Firestore

## Cài đặt
### Yêu cầu hệ thống
- Node.js >= 14
- Firebase CLI
- Expo CLI

### Hướng dẫn cài đặt
1. Clone repository:
   ```bash
   git clone https://github.com/yourusername/delivery-food-app.git
   cd delivery-food-app
   ```
2. Cài đặt backend:
   ```bash
   cd backend
   npm install
   npm start
   ```
3. Cài đặt frontend:
   ```bash
   cd ../delivery-food
   npm install
   expo start
   ```

## Tính năng chính
- **Đăng ký, đăng nhập**
- **Tìm kiếm và đặt hàng món ăn**
- **Thanh toán trực tuyến**
- **Theo dõi đơn hàng**
- **Đánh giá nhà hàng**

## Đóng góp
Vui lòng tạo pull request hoặc mở issue để báo cáo lỗi hoặc đề xuất tính năng.

## Giấy phép
Dự án này được phát hành theo giấy phép MIT.

