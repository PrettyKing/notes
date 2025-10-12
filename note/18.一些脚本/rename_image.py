import os
import pandas as pd
import shutil
from pathlib import Path

def is_image_file(filename):
    """检查文件是否为图片格式"""
    image_extensions = {
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif',
        '.webp', '.ico', '.svg', '.psd', '.raw', '.heic', '.heif'
    }
    
    # 获取文件扩展名并转为小写
    _, ext = os.path.splitext(filename.lower())
    return ext in image_extensions

def batch_rename_images_from_excel(excel_file="图片目录.xlsx", sheet_name=None):
    """
    根据Excel文件中的"图片重命名"列批量重命名图片
    
    参数:
    excel_file: Excel文件路径，默认为"图片目录.xlsx"
    sheet_name: 工作表名称，默认为None（使用第一个工作表）
    """
    
    # 检查Excel文件是否存在
    if not os.path.exists(excel_file):
        print(f"错误：找不到Excel文件 '{excel_file}'")
        return
    
    try:
        # 读取Excel文件
        print(f"正在读取Excel文件: {excel_file}")
        if sheet_name:
            df = pd.read_excel(excel_file, sheet_name=sheet_name)
        else:
            df = pd.read_excel(excel_file)
        
        print(f"Excel文件读取成功，共 {len(df)} 行数据")
        
        # 检查必要的列是否存在
        required_columns = ['图片名称', '图片重命名']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            print(f"错误：Excel文件中缺少以下必要列: {missing_columns}")
            print(f"当前Excel文件包含的列: {list(df.columns)}")
            return
        
        # 过滤掉空行和无效数据
        df = df.dropna(subset=['图片名称', '图片重命名'])
        df = df[df['图片重命名'].str.strip() != '']
        
        if len(df) == 0:
            print("错误：没有找到有效的重命名数据")
            return
        
        print(f"有效的重命名记录: {len(df)} 条")
        
        # 获取当前目录下的所有图片文件
        current_dir = Path('.')
        all_files = [f for f in current_dir.iterdir() if f.is_file()]
        image_files = {f.stem: f for f in all_files if is_image_file(f.name)}
        
        print(f"当前目录下的图片文件: {len(image_files)} 个")
        
        # 记录重命名操作
        success_count = 0
        error_count = 0
        skipped_count = 0
        renamed_files = []
        
        # 创建备份目录（可选）
        backup_dir = Path('renamed_backup')
        create_backup = input("是否创建备份？(y/n，默认n): ").lower().strip() == 'y'
        if create_backup:
            backup_dir.mkdir(exist_ok=True)
            print(f"备份目录已创建: {backup_dir}")
        
        print("\n开始批量重命名...")
        print("-" * 50)
        
        for index, row in df.iterrows():
            try:
                original_name = str(row['图片名称']).strip()
                new_name = str(row['图片重命名']).strip()
                
                # 检查原文件是否存在
                if original_name not in image_files:
                    print(f"⚠️  跳过：找不到图片文件 '{original_name}'")
                    skipped_count += 1
                    continue
                
                original_file = image_files[original_name]
                file_extension = original_file.suffix
                
                # 如果新名称没有扩展名，添加原文件的扩展名
                if not new_name.endswith(file_extension):
                    new_name_with_ext = new_name + file_extension
                else:
                    new_name_with_ext = new_name
                
                new_file_path = current_dir / new_name_with_ext
                
                # 检查目标文件是否已存在
                if new_file_path.exists() and new_file_path != original_file:
                    print(f"⚠️  跳过：目标文件已存在 '{new_name_with_ext}'")
                    skipped_count += 1
                    continue
                
                # 如果文件名相同，跳过
                if original_file.name == new_name_with_ext:
                    print(f"⚠️  跳过：文件名未改变 '{original_name}'")
                    skipped_count += 1
                    continue
                
                # 创建备份
                if create_backup:
                    backup_file = backup_dir / original_file.name
                    shutil.copy2(original_file, backup_file)
                
                # 执行重命名
                original_file.rename(new_file_path)
                
                print(f"✅ 重命名成功: '{original_file.name}' -> '{new_name_with_ext}'")
                renamed_files.append((original_file.name, new_name_with_ext))
                success_count += 1
                
            except Exception as e:
                print(f"❌ 重命名失败: '{original_name}' -> '{new_name}', 错误: {str(e)}")
                error_count += 1
        
        # 输出统计结果
        print("-" * 50)
        print(f"批量重命名完成！")
        print(f"✅ 成功: {success_count} 个")
        print(f"⚠️  跳过: {skipped_count} 个")
        print(f"❌ 失败: {error_count} 个")
        
        if renamed_files:
            print(f"\n重命名清单:")
            for old_name, new_name in renamed_files:
                print(f"  {old_name} -> {new_name}")
        
        if create_backup and success_count > 0:
            print(f"\n原文件已备份到: {backup_dir}")
        
    except Exception as e:
        print(f"读取Excel文件时出错: {str(e)}")

def show_excel_structure(excel_file="图片目录.xlsx"):
    """显示Excel文件的结构，帮助用户了解文件格式"""
    if not os.path.exists(excel_file):
        print(f"找不到Excel文件 '{excel_file}'")
        return
    
    try:
        # 读取Excel文件的第一个工作表
        df = pd.read_excel(excel_file)
        
        print(f"Excel文件 '{excel_file}' 结构:")
        print(f"行数: {len(df)}")
        print(f"列数: {len(df.columns)}")
        print(f"列名: {list(df.columns)}")
        
        if len(df) > 0:
            print("\n前5行数据预览:")
            print(df.head().to_string(index=False))
        
        # 检查是否有"图片重命名"列
        if '图片重命名' in df.columns:
            non_empty_count = df['图片重命名'].dropna().count()
            print(f"\n'图片重命名'列中有效数据: {non_empty_count} 条")
        else:
            print("\n⚠️  警告：未找到'图片重命名'列")
            print("请确保Excel文件中包含以下列:")
            print("- 图片名称")
            print("- 图片重命名")
        
    except Exception as e:
        print(f"读取Excel文件时出错: {str(e)}")

if __name__ == "__main__":
    print("=== 批量重命名图片工具 ===")
    print()
    
    # 让用户选择操作
    print("请选择操作:")
    print("1. 查看Excel文件结构")
    print("2. 执行批量重命名")
    
    choice = input("请输入选择 (1 或 2): ").strip()
    
    if choice == "1":
        excel_file = input("请输入Excel文件名 (默认: 图片目录.xlsx): ").strip()
        if not excel_file:
            excel_file = "图片目录.xlsx"
        show_excel_structure(excel_file)
    
    elif choice == "2":
        excel_file = input("请输入Excel文件名 (默认: 图片目录.xlsx): ").strip()
        if not excel_file:
            excel_file = "图片目录.xlsx"
        
        # 先显示Excel结构
        print("\n=== Excel文件结构 ===")
        show_excel_structure(excel_file)
        
        # 确认是否继续
        print("\n=== 确认重命名操作 ===")
        confirm = input("确认要执行批量重命名吗？(y/n): ").lower().strip()
        
        if confirm == 'y':
            batch_rename_images_from_excel(excel_file)
        else:
            print("操作已取消")
    
    else:
        print("无效选择")