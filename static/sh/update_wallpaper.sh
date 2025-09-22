#!/bin/bash

# 设置Bing每日壁纸的API链接
url="https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN"

# 获取API返回的JSON数据
response=$(curl -s -H "Accept: application/json" --insecure "$url")

# 从JSON数据中提取图片基本链接（使用grep）
imgurl_base=$(echo "$response" | grep -oP '(?<="urlbase":")[^"]*')

# 拼接完整的图片链接
pc_imgurl="https://cn.bing.com${imgurl_base}_1920x1080.jpg"

# 指定CSS文件路径
css_file="/www/wwwroot/www.xxx.com/static/css/styles.css"

# 检查图片链接是否有效
if [ -n "$imgurl_base" ] && [ "$imgurl_base" != "null" ]; then
    echo "获取到的桌面端图片URL: $pc_imgurl"
    
    # 转义URL中的特殊字符
    escaped_pc_imgurl=$(echo "$pc_imgurl" | sed 's/[\/&]/\\&/g')
    
    # 更新桌面端背景图片
    sed -i "s#background-image: url('.*'); *\/\* 设置桌面背景图片 \*\/#background-image: url('$escaped_pc_imgurl'); /* 设置桌面背景图片 */#" "$css_file"
    
    # 验证替换是否成功
    if grep -q "$escaped_pc_imgurl" "$css_file"; then
        echo "CSS背景图片URL已成功更新"
    else
        echo "警告: 替换操作已执行，但未在文件中找到更新后的URL"
        exit 1
    fi
else
    # 如果获取图片链接失败，则输出错误信息并退出脚本
    echo "error: 无法获取图片链接"
    exit 1
fi
