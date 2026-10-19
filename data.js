/* ===========================================================
   坤坤工具箱 · 工具清单
   -----------------------------------------------------------
   新增工具：复制一条对象，改字段即可。
   字段说明：
     name     工具名称（必填）
     desc     一句话简介（必填，卡片上显示）
     detail   长介绍（卡片展开后显示，建议 2~4 句）
     url      链接，一般为官网地址（可留空，留空则不显示"打开链接"按钮）
     category 分类，必须是下面 7 个之一：
              系统工具 / 办公效率 / 影音图像 / 开发编程 / 网络工具 / 安全维护 / 其他
   =========================================================== */

window.TOOLS = [
  {
    name: "PDF Gear",
    desc: "文件格式免费转换",
    detail: "支持 PDF 与 Word、Excel、PPT、图片之间的相互转换，另带压缩、合并、拆分和 OCR 识别功能。基础功能免费，界面提供中文，适合日常处理文档格式转换的场景。",
    url: "https://www.pdfgear.com/",
    category: "办公效率"
  },
  {
    name: "Everything",
    desc: "本地文件名瞬时搜索",
    detail: "基于 NTFS 索引的文件名搜索工具，安装后建立一次索引，之后输入关键字即可实时列出全盘匹配的文件和文件夹。只匹配文件名，不读取文件内容，常驻内存占用很小。",
    url: "https://www.voidtools.com/",
    category: "系统工具"
  },
  {
    name: "7-Zip",
    desc: "开源压缩与解压工具",
    detail: "支持 7z、ZIP、RAR、TAR 等常见格式的解压，压缩 7z 格式时的压缩率高于普通 ZIP。开源免费，提供命令行版本，可以集成到右键菜单中使用。",
    url: "https://www.7-zip.org/",
    category: "系统工具"
  },
  {
    name: "PotPlayer",
    desc: "本地视频播放器",
    detail: "支持绝大多数常见视频和音频格式，内置常用解码器，安装后一般无需再配置解码包。提供倍速播放、字幕加载、画面截取等功能，运行时的资源占用相对较低。",
    url: "https://potplayer.daum.net/",
    category: "影音图像"
  },
  {
    name: "Visual Studio Code",
    desc: "代码编辑器",
    detail: "微软开发的免费代码编辑器，通过扩展支持 Python、C++、JavaScript 等多种语言。内置终端、Git 集成和调试功能，适合作为日常写代码和多文件文本编辑的主力工具。",
    url: "https://code.visualstudio.com/",
    category: "开发编程"
  },
  {
    name: "Snipaste",
    desc: "截图与贴图工具",
    detail: "按 F1 截图后可标注、取色，按 F3 把截图贴在屏幕最上层当作参考。支持多屏和自定义快捷键，截图后可直接复制到剪贴板或保存为文件。",
    url: "https://zh.snipaste.com/",
    category: "办公效率"
  },
  {
    name: "Fiddler Classic",
    desc: "HTTP 抓包与调试",
    detail: "抓取本机及局域网内的 HTTP/HTTPS 请求，可查看请求头、响应内容和耗时。支持断点修改请求、模拟弱网环境，常用于排查接口问题和分析网页加载过程。",
    url: "https://www.telerik.com/fiddler/fiddler-classic",
    category: "网络工具"
  },
  {
    name: "Geek Uninstaller",
    desc: "软件卸载与残留清理",
    detail: "在卸载程序后扫描并删除注册表项和残留文件夹，弥补系统自带卸载的不足。单个可执行文件，免安装，支持强制卸载和按安装日期排序查看。",
    url: "https://geekuninstaller.com/",
    category: "安全维护"
  },
  {
    name: "1kPPT模板",
    desc: "PPT 模板资源合集",
    detail: "",
    url: "https://pan.quark.cn/s/d4f844b92c1e#/list/share",
    category: "办公效率"
  },
  {
    name: "PrivaZer",
    desc: "免费电脑垃圾清理工具",
    detail: "",
    url: "https://privazer.com/",
    category: "系统工具"
  },
  {
    name: "ZyperWin++",
    desc: "电脑系统快速优化",
    detail: "",
    url: "https://github.com/ZyperWave/ZyperWinOptimize",
    category: "系统工具"
  },
  {
    name: "办公等工具总库",
    desc: "常用软件资源导航",
    detail: "",
    url: "https://s7zy.top/",
    category: "其他"
  },
  {
    name: "HiBit Uninstaller",
    desc: "电脑软件卸载与残留清理",
    detail: "",
    url: "https://www.hibitsoft.ir/",
    category: "安全维护"
  }
];
