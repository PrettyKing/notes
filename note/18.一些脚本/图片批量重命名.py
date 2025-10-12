#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
图片重命名工具类
提供灵活的图片批量重命名功能
"""

import os
import time
from datetime import datetime
from pathlib import Path
from typing import List, Optional, Union, Callable
import argparse


class ImageRenamer:
    """图片重命名工具类"""
    
    # 支持的图片格式
    SUPPORTED_FORMATS = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp', '.svg', '.ico'}
    
    def __init__(self, directory: str = ".", case_sensitive: bool = False):
        """
        初始化图片重命名器
        
        Args:
            directory: 目标目录路径
            case_sensitive: 是否区分大小写匹配文件扩展名
        """
        self.directory = Path(directory)
        self.case_sensitive = case_sensitive
        self._validate_directory()
    
    def _validate_directory(self):
        """验证目录是否存在"""
        if not self.directory.exists():
            raise FileNotFoundError(f"目录 '{self.directory}' 不存在")
        if not self.directory.is_dir():
            raise NotADirectoryError(f"'{self.directory}' 不是一个目录")
    
    def get_image_files(self) -> List[Path]:
        """
        获取目录下所有图片文件
        
        Returns:
            图片文件路径列表
        """
        image_files = []
        for file_path in self.directory.iterdir():
            if file_path.is_file():
                ext = file_path.suffix.lower() if not self.case_sensitive else file_path.suffix
                if ext in self.SUPPORTED_FORMATS:
                    image_files.append(file_path)
        return sorted(image_files)
    
    def rename_with_timestamp(self, 
                            format_template: str = "yyyy-mm-dd-hh-mm",
                            use_milliseconds: bool = False,
                            dry_run: bool = False) -> dict:
        """
        使用时间戳重命名图片
        
        Args:
            format_template: 时间格式模板 (yyyy, mm, dd, hh, mm)
            use_milliseconds: 是否使用毫秒级时间戳
            dry_run: 是否只预览不执行
            
        Returns:
            重命名结果字典
        """
        current_time = datetime.now()
        if use_milliseconds:
            timestamp = int(time.time() * 1000)
        else:
            timestamp = int(time.time())
        
        # 解析时间格式
        time_str = self._parse_time_format(format_template, current_time)
        
        def name_generator(index: int, file_path: Path) -> str:
            return f"{time_str}-{timestamp + index}{file_path.suffix.lower()}"
        
        return self._execute_rename(name_generator, dry_run)
    
    def rename_with_sequence(self,
                           prefix: str = "",
                           suffix: str = "",
                           start_number: int = 1,
                           padding: int = 3,
                           dry_run: bool = False) -> dict:
        """
        使用序号重命名图片
        
        Args:
            prefix: 文件名前缀
            suffix: 文件名后缀
            start_number: 起始序号
            padding: 序号补零位数
            dry_run: 是否只预览不执行
            
        Returns:
            重命名结果字典
        """
        def name_generator(index: int, file_path: Path) -> str:
            number = start_number + index
            return f"{prefix}{number:0{padding}d}{suffix}{file_path.suffix.lower()}"
        
        return self._execute_rename(name_generator, dry_run)
    
    def rename_with_datetime(self,
                           format_template: str = "yyyy-mm-dd_hh-mm-ss",
                           add_sequence: bool = True,
                           dry_run: bool = False) -> dict:
        """
        使用日期时间重命名图片
        
        Args:
            format_template: 时间格式模板
            add_sequence: 是否添加序号避免重名
            dry_run: 是否只预览不执行
            
        Returns:
            重命名结果字典
        """
        current_time = datetime.now()
        time_str = self._parse_time_format(format_template, current_time)
        
        def name_generator(index: int, file_path: Path) -> str:
            if add_sequence:
                return f"{time_str}_{index + 1:03d}{file_path.suffix.lower()}"
            else:
                return f"{time_str}{file_path.suffix.lower()}"
        
        return self._execute_rename(name_generator, dry_run)
    
    def rename_with_custom_function(self,
                                  custom_func: Callable[[int, Path], str],
                                  dry_run: bool = False) -> dict:
        """
        使用自定义函数重命名图片
        
        Args:
            custom_func: 自定义命名函数，接收(索引, 文件路径)，返回新文件名
            dry_run: 是否只预览不执行
            
        Returns:
            重命名结果字典
        """
        return self._execute_rename(custom_func, dry_run)
    
    def _parse_time_format(self, format_template: str, dt: datetime) -> str:
        """解析时间格式模板"""
        format_mapping = {
            'yyyy': dt.strftime('%Y'),
            'mm': dt.strftime('%m'),
            'dd': dt.strftime('%d'),
            'hh': dt.strftime('%H'),
            'MM': dt.strftime('%M'),  # 分钟用大写MM避免与月份冲突
            'ss': dt.strftime('%S')
        }
        
        result = format_template
        for pattern, value in format_mapping.items():
            result = result.replace(pattern, value)
        
        return result
    
    def _execute_rename(self, name_generator: Callable[[int, Path], str], dry_run: bool) -> dict:
        """
        执行重命名操作
        
        Args:
            name_generator: 文件名生成函数
            dry_run: 是否只预览
            
        Returns:
            重命名结果字典
        """
        image_files = self.get_image_files()
        
        if not image_files:
            return {
                'success': True,
                'message': '没有找到图片文件',
                'total': 0,
                'renamed': 0,
                'failed': 0,
                'operations': []
            }
        
        operations = []
        renamed_count = 0
        failed_count = 0
        
        for i, image_file in enumerate(image_files):
            try:
                new_name = name_generator(i, image_file)
                new_path = self.directory / new_name
                
                # 处理文件名冲突
                new_path = self._resolve_conflict(new_path)
                
                operation = {
                    'old_name': image_file.name,
                    'new_name': new_path.name,
                    'status': 'success'
                }
                
                if not dry_run:
                    image_file.rename(new_path)
                
                operations.append(operation)
                renamed_count += 1
                
            except Exception as e:
                operation = {
                    'old_name': image_file.name,
                    'new_name': '',
                    'status': 'failed',
                    'error': str(e)
                }
                operations.append(operation)
                failed_count += 1
        
        return {
            'success': failed_count == 0,
            'message': f'{"预览" if dry_run else "重命名"}完成',
            'total': len(image_files),
            'renamed': renamed_count,
            'failed': failed_count,
            'operations': operations
        }
    
    def _resolve_conflict(self, new_path: Path) -> Path:
        """解决文件名冲突"""
        if not new_path.exists():
            return new_path
        
        counter = 1
        stem = new_path.stem
        suffix = new_path.suffix
        parent = new_path.parent
        
        while new_path.exists():
            new_name = f"{stem}_{counter}{suffix}"
            new_path = parent / new_name
            counter += 1
        
        return new_path


# 便捷函数
def rename_images_with_timestamp(directory: str = ".", 
                               format_template: str = "yyyy-mm-dd-hh-MM",
                               dry_run: bool = False) -> dict:
    """
    便捷函数：使用时间戳重命名图片
    
    Args:
        directory: 目标目录
        format_template: 时间格式模板
        dry_run: 是否只预览
        
    Returns:
        重命名结果
    """
    renamer = ImageRenamer(directory)
    return renamer.rename_with_timestamp(format_template, dry_run=dry_run)


def rename_images_with_sequence(directory: str = ".",
                              prefix: str = "image_",
                              start_number: int = 1,
                              dry_run: bool = False) -> dict:
    """
    便捷函数：使用序号重命名图片
    
    Args:
        directory: 目标目录
        prefix: 文件名前缀
        start_number: 起始序号
        dry_run: 是否只预览
        
    Returns:
        重命名结果
    """
    renamer = ImageRenamer(directory)
    return renamer.rename_with_sequence(prefix=prefix, start_number=start_number, dry_run=dry_run)


def print_rename_result(result: dict):
    """打印重命名结果"""
    print(f"\n{result['message']}")
    print(f"总文件数: {result['total']}")
    print(f"成功: {result['renamed']}")
    print(f"失败: {result['failed']}")
    print("-" * 50)
    
    for op in result['operations']:
        if op['status'] == 'success':
            print(f"✓ {op['old_name']} -> {op['new_name']}")
        else:
            print(f"✗ {op['old_name']} 失败: {op.get('error', '未知错误')}")


def main():
    """命令行入口"""
    parser = argparse.ArgumentParser(description='图片批量重命名工具')
    parser.add_argument('-d', '--directory', default='.', help='目标目录')
    parser.add_argument('-m', '--mode', choices=['timestamp', 'sequence', 'datetime'], 
                       default='timestamp', help='重命名模式')
    parser.add_argument('-f', '--format', default='yyyy-mm-dd-hh-MM', 
                       help='时间格式模板')
    parser.add_argument('-p', '--prefix', default='', help='文件名前缀')
    parser.add_argument('-s', '--start', type=int, default=1, help='起始序号')
    parser.add_argument('--dry-run', action='store_true', help='预览模式，不实际重命名')
    
    args = parser.parse_args()
    
    try:
        renamer = ImageRenamer(args.directory)
        
        if args.mode == 'timestamp':
            result = renamer.rename_with_timestamp(args.format, dry_run=args.dry_run)
        elif args.mode == 'sequence':
            result = renamer.rename_with_sequence(args.prefix, start_number=args.start, dry_run=args.dry_run)
        elif args.mode == 'datetime':
            result = renamer.rename_with_datetime(args.format, dry_run=args.dry_run)
        
        print_rename_result(result)
        
    except Exception as e:
        print(f"错误: {e}")


if __name__ == "__main__":
    main()


"""
====================================
基础使用方法和示例
====================================

1. 快速使用 - 便捷函数方式：
   
   # 使用时间戳重命名当前目录下的图片
   from image_renamer import rename_images_with_timestamp, print_rename_result
   result = rename_images_with_timestamp()
   print_rename_result(result)
   
   # 指定目录和时间格式
   result = rename_images_with_timestamp("./photos", "yyyy-mm-dd-hh-MM")
   print_rename_result(result)
   
   # 使用序号重命名
   from image_renamer import rename_images_with_sequence
   result = rename_images_with_sequence("./photos", "image_", 1)
   print_rename_result(result)

2. 完整功能 - 类使用方式：

   from image_renamer import ImageRenamer, print_rename_result
   
   # 创建重命名器
   renamer = ImageRenamer("./photos")  # 默认当前目录用 "."
   
   # 方式1: 时间戳重命名 (默认格式: 2024-09-08-14-30-1725778200)
   result = renamer.rename_with_timestamp()
   print_rename_result(result)
   
   # 方式2: 自定义时间格式
   result = renamer.rename_with_timestamp("yyyy年mm月dd日-hh时MM分")
   print_rename_result(result)
   
   # 方式3: 序号重命名 (photo_001.jpg, photo_002.jpg...)
   result = renamer.rename_with_sequence(prefix="photo_", start_number=1, padding=3)
   print_rename_result(result)
   
   # 方式4: 日期时间重命名
   result = renamer.rename_with_datetime("yyyy-mm-dd_hh-MM-ss")
   print_rename_result(result)

3. 安全预览模式（推荐先预览再执行）：

   # 预览重命名结果，不实际执行
   result = renamer.rename_with_timestamp(dry_run=True)
   print_rename_result(result)
   
   # 确认无误后再执行
   result = renamer.rename_with_timestamp(dry_run=False)
   print_rename_result(result)

4. 自定义重命名逻辑：

   def my_custom_namer(index, file_path):
       # index: 文件索引 (从0开始)
       # file_path: Path对象，包含原文件信息
       return f"vacation_{index + 1:03d}_{file_path.stem}{file_path.suffix.lower()}"
   
   result = renamer.rename_with_custom_function(my_custom_namer)
   print_rename_result(result)

5. 命令行使用：

   # 基本使用
   python image_renamer.py
   
   # 指定目录
   python image_renamer.py -d "./photos"
   
   # 时间戳模式
   python image_renamer.py -m timestamp -f "yyyy-mm-dd-hh-MM"
   
   # 序号模式
   python image_renamer.py -m sequence -p "photo_" -s 1
   
   # 日期时间模式
   python image_renamer.py -m datetime -f "yyyy年mm月dd日"
   
   # 预览模式
   python image_renamer.py --dry-run

6. 时间格式说明：
   yyyy - 4位年份 (2024)
   mm   - 2位月份 (01-12)
   dd   - 2位日期 (01-31)
   hh   - 2位小时 (00-23)
   MM   - 2位分钟 (00-59) 注意：分钟用大写MM
   ss   - 2位秒数 (00-59)

7. 支持的图片格式：
   .jpg, .jpeg, .png, .gif, .bmp, .tiff, .webp, .svg, .ico

8. 结果说明：
   函数返回字典包含：
   - success: 是否全部成功
   - message: 结果消息
   - total: 总文件数
   - renamed: 成功重命名数
   - failed: 失败数
   - operations: 详细操作列表

====================================
"""

# 使用示例代码（设置RUN_EXAMPLES=True来运行）
RUN_EXAMPLES = False

if __name__ == "__main__" and RUN_EXAMPLES:
    print("=== 图片重命名工具使用示例 ===\n")
    
    # 示例1: 基本时间戳重命名
    print("示例1: 基本时间戳重命名")
    result = rename_images_with_timestamp(".", "yyyy-mm-dd-hh-MM")
    print_rename_result(result)
    
    # 示例2: 序号重命名
    print("\n示例2: 序号重命名")
    result = rename_images_with_sequence(".", "photo_", 1)
    print_rename_result(result)
    
    # 示例3: 使用类进行复杂操作
    print("\n示例3: 类操作方式")
    renamer = ImageRenamer(".")
    
    # 预览重命名
    print("预览模式:")
    result = renamer.rename_with_datetime("yyyy年mm月dd日-hh时MM分ss秒", dry_run=True)
    print_rename_result(result)
    
    # 自定义重命名函数
    print("\n自定义函数:")
    def custom_namer(index: int, file_path: Path) -> str:
        return f"custom_{index:04d}_{int(time.time())}{file_path.suffix.lower()}"
    
    result = renamer.rename_with_custom_function(custom_namer, dry_run=True)
    print_rename_result(result)