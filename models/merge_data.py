import pandas as pd
import glob
import os

# Đường dẫn thư mục
source_folder = os.path.expanduser('~/shopee_pipeline/data/raw/')
output_folder = os.path.expanduser('~/shopee_pipeline/data/processed/')

# Tạo thư mục đích nếu chưa tồn tại
os.makedirs(output_folder, exist_ok=True)

# Lấy danh sách file
all_files = glob.glob(os.path.join(source_folder, "*.xlsx"))

df_list = []
for file in all_files:
    # Đọc file và thêm cột nguồn để dễ quản lý dữ liệu sau này
    df = pd.read_excel(file)
    df['source_file'] = os.path.basename(file)
    df_list.append(df)

if df_list:
    combined_df = pd.concat(df_list, axis=0, ignore_index=True)
    
    # Lưu file vào thư mục processed
    output_path = os.path.join(output_folder, "merged_data.xlsx")
    combined_df.to_excel(output_path, index=False)
    print(f"Đã gộp thành công {len(df_list)} file vào: {output_path}")
else:
    print("Không tìm thấy file .xlsx nào để xử lý.")