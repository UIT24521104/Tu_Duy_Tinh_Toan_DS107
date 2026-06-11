# Tu_Duy_Tinh_Toan_DS107

* Di chuyển vào thư mục dự án

cd Tu_Duy_Tinh_Toan_DS107

* Tạo và kích hoạt môi trường ảo (Dành cho Windows)

python -m venv .venv
.\.venv\Scripts\activate

* (Lưu ý: Nếu dùng Linux/macOS, sử dụng lệnh: source .venv/bin/activate)

* Di chuyển vào thư mục chứa requirements.txt và cài đặt thư viện

cd backend/app
pip install -r requirements.txt

* Lùi lại thư mục gốc dự án và khởi chạy server

cd ../..
uvicorn app.main:app --reload --app-dir backend --host 0.0.0.0 --port 8000

* Di chuyển vào thư mục frontend từ thư mục gốc dự án

cd Tu_Duy_Tinh_Toan_DS107/frontend

* Cài đặt các gói thư viện Node.js (chỉ cần chạy ở lần đầu tiên clone repo)

npm install

# Khởi chạy server frontend

npm run dev
