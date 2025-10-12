import os
import sys
import glob
from PIL import Image
import re

def natural_sort_key(s):
    """
    用于自然排序的辅助函数（例如：1, 2, 10 而不是 1, 10, 2）
    """
    return [int(text) if text.isdigit() else text.lower() for text in re.split(r'(\d+)', s)]

def create_pdf_from_images(img_dir='.', mode='single', quality=90):
    """
    将指定目录中的所有图片文件转换为PDF
    
    参数:
        img_dir: 图片文件所在目录，默认为当前目录
        mode: 转换模式，'separate'为每张图片生成一个PDF，'group'为按文件名前缀分组，'single'为所有图片合成一个PDF
        quality: JPEG压缩质量，默认90
    """
    # 确保正确处理中文路径
    if sys.platform.startswith('win'):
        # 在Windows系统上设置控制台编码为UTF-8
        os.system("chcp 65001")
    
    # PDF将保存在当前目录（img_dir）
    output_dir = img_dir
    
    # 支持的图片格式
    img_extensions = ['*.jpg', '*.jpeg', '*.png', '*.bmp', '*.gif', '*.tiff', '*.webp']
    img_files = []
    
    # 获取所有支持格式的图片
    for ext in img_extensions:
        img_files.extend(glob.glob(os.path.join(img_dir, ext)))
        # 只有当文件系统区分大小写时才需要搜索大写版本
        if ext != ext.upper():
            img_files.extend(glob.glob(os.path.join(img_dir, ext.upper())))
    # 去除可能的重复
    img_files = list(set(img_files))
    
    if not img_files:
        print("当前目录下没有找到支持的图片文件")
        return
    
    # 按文件名自然排序
    img_files.sort(key=natural_sort_key)
    
    print(f"找到 {len(img_files)} 个图片文件")
    for i, img_file in enumerate(img_files, 1):
        print(f"  {i}. {os.path.basename(img_file)}")
    
    if mode == 'single':
        # 所有图片合成一个PDF
        try:
            output_pdf = os.path.join(output_dir, "所有图片合集.pdf")
            
            print(f"\n开始处理 {len(img_files)} 张图片...")
            
            # 先处理第一张图片
            print(f"处理第1张图片: {os.path.basename(img_files[0])}")
            first_img = Image.open(img_files[0])
            if first_img.mode != 'RGB':
                first_img = first_img.convert('RGB')
            
            # 处理剩余图片
            additional_images = []
            for i in range(1, len(img_files)):
                try:
                    print(f"处理第{i+1}张图片: {os.path.basename(img_files[i])}")
                    img = Image.open(img_files[i])
                    if img.mode != 'RGB':
                        img = img.convert('RGB')
                    additional_images.append(img)
                except Exception as e:
                    print(f"  处理图片 {os.path.basename(img_files[i])} 时出错: {str(e)}")
                    continue
            
            # 保存为PDF
            if additional_images:
                first_img.save(output_pdf, save_all=True, append_images=additional_images, quality=quality)
                print(f"\n成功创建PDF: {output_pdf}")
                print(f"包含 {len(additional_images) + 1} 页")
            else:
                first_img.save(output_pdf, quality=quality)
                print(f"\n成功创建PDF: {output_pdf}")
                print("包含 1 页")
            
        except Exception as e:
            print(f"创建合并PDF时出错: {str(e)}")
    
    elif mode == 'separate':
        # 每张图片生成一个PDF
        for i, img_file in enumerate(img_files):
            try:
                img_filename = os.path.basename(img_file)
                img_name = os.path.splitext(img_filename)[0]
                
                print(f"处理图片 {i+1}/{len(img_files)}: {img_filename}")
                
                # 安全文件名
                safe_name = "".join([c if c.isalnum() or c in [' ', '_', '-', '.'] else '_' for c in img_name])
                output_pdf = os.path.join(output_dir, f"{safe_name}.pdf")
                
                # 打开图片并保存为PDF
                img = Image.open(img_file)
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                img.save(output_pdf, quality=quality)
                print(f"  已保存为PDF: {os.path.basename(output_pdf)}")
                
            except Exception as e:
                print(f"处理图片 {img_file} 时出错: {str(e)}")
                continue
        
        print("所有图片已单独转换为PDF完成！")
    
    elif mode == 'group':
        # 按文件名前缀分组合并为PDF
        groups = {}
        
        # 按前缀分组
        for img_file in img_files:
            img_filename = os.path.basename(img_file)
            # 尝试提取前缀，假设前缀是第一个非字母数字字符前的部分
            match = re.match(r'^(.*?)[-_\s]', img_filename)
            if match:
                prefix = match.group(1)
            else:
                prefix = os.path.splitext(img_filename)[0]  # 如果没有分隔符，使用完整文件名（不含扩展名）
            
            if prefix not in groups:
                groups[prefix] = []
            
            groups[prefix].append(img_file)
        
        # 处理每个分组
        for prefix, files in groups.items():
            try:
                # 按文件名自然排序
                files.sort(key=natural_sort_key)
                
                # 安全文件名
                safe_prefix = "".join([c if c.isalnum() or c in [' ', '_', '-', '.'] else '_' for c in prefix])
                output_pdf = os.path.join(output_dir, f"{safe_prefix}.pdf")
                
                print(f"处理分组: {prefix} ({len(files)} 张图片)")
                
                # 处理第一张图片
                first_img = Image.open(files[0])
                if first_img.mode != 'RGB':
                    first_img = first_img.convert('RGB')
                
                # 处理剩余图片
                additional_images = []
                for i in range(1, len(files)):
                    try:
                        img = Image.open(files[i])
                        if img.mode != 'RGB':
                            img = img.convert('RGB')
                        additional_images.append(img)
                    except Exception as e:
                        print(f"  处理图片 {os.path.basename(files[i])} 时出错: {str(e)}")
                        continue
                
                # 保存PDF
                if additional_images:
                    first_img.save(output_pdf, save_all=True, append_images=additional_images, quality=quality)
                else:
                    first_img.save(output_pdf, quality=quality)
                
                print(f"  已保存为PDF: {os.path.basename(output_pdf)} ({len(additional_images) + 1} 页)")
                
            except Exception as e:
                print(f"处理分组 {prefix} 时出错: {str(e)}")
                continue
        
        print("所有分组已转换为PDF完成！")

if __name__ == "__main__":
    # 默认使用单个PDF模式，将所有图片合并为一个PDF
    convert_mode = 'single'
    
    # 可以通过命令行参数指定模式
    if len(sys.argv) > 1:
        if sys.argv[1] in ['separate', 'single', 'group']:
            convert_mode = sys.argv[1]
        else:
            print("无效的模式参数！")
            print("支持的模式: single, separate, group")
            sys.exit(1)
    
    print(f"开始转换图片为PDF，使用模式: {convert_mode}")
    
    create_pdf_from_images(mode=convert_mode)
    
    print(f"\n脚本执行完成！使用的模式: {convert_mode}")
    print("PDF文件已保存在当前目录中。")
    print("\n模式说明:")
    print("- 'single': 所有图片合并为一个PDF (默认)")
    print("- 'separate': 每张图片生成单独的PDF")
    print("- 'group': 按文件名前缀分组生成PDF")
    print("\n要更改模式，请使用命令行参数，例如:")
    print("python images_to_pdf.py separate")