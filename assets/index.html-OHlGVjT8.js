import{_ as n,c as a,a as e,o as i}from"./app-CJfFg5nr.js";const l="/blog/assets/1-BV5-OazZ.png",p="/blog/assets/2-B4U0gflr.png",t={};function c(r,s){return i(),a("div",null,s[0]||(s[0]=[e('<ul><li>创建一个空 windows 程序空项目</li><li>右键项目选择 生成依赖项 -&gt; 生成自定义 -&gt; 选择 masm</li></ul><p><img src="'+l+'" alt="" width="648" height="785"></p><p><img src="'+p+`" alt="" width="1440" height="759"></p><ul><li>新建一个空的 cpp 文件，后缀自己换成 .asm</li><li>右键项目选择 属性 -&gt; 链接器 -&gt; 系统 -&gt; 子系统 -&gt; 控制台 (/SUBSYSTEM:CONSOLE)</li><li>右键项目选择 属性 -&gt; 链接器 -&gt; 系统 -&gt; 高级 -&gt; 入口点(自己填 main)</li><li>选中生成的文件右键属性 -&gt; 常规 -&gt; 项类型(选择 Microsoft Macro Assembler)</li><li>选中 x64 直接运行</li></ul><p>以下是汇编代码版的 Hello World</p><div class="language-plain line-numbers-mode" data-ext="plain" data-title="plain"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span>EXTERN GetStdHandle : PROC</span></span>
<span class="line"><span>EXTERN WriteFile : PROC</span></span>
<span class="line"><span>EXTERN ExitProcess : PROC</span></span>
<span class="line"><span>.DATA?</span></span>
<span class="line"><span>hFile QWORD ?</span></span>
<span class="line"><span>BytesWritten DWORD ?</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.DATA</span></span>
<span class="line"><span>hello BYTE &#39;Hello world!&#39;, 13, 10</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.CODE</span></span>
<span class="line"><span>main PROC</span></span>
<span class="line"><span>; https://blogs.msdn.microsoft.com/oldnewthing/20160623-00/?p=93735</span></span>
<span class="line"><span>sub rsp, 40 ; Shadow space (4 * 8) &amp; 1 parameter (8 bytes)</span></span>
<span class="line"><span>; https://docs.microsoft.com/en-us/cpp/build/stack-allocation</span></span>
<span class="line"><span>and spl, -16 ; Align to 16</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; https://msdn.microsoft.com/library/windows/desktop/ms683231.aspx</span></span>
<span class="line"><span>mov ecx, -11 ; DWORD nStdHandle = STD_OUTPUT_HANDLE</span></span>
<span class="line"><span>call GetStdHandle ; Call WinApi</span></span>
<span class="line"><span>mov hFile, rax ; Save returned handle</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; https://msdn.microsoft.com/library/windows/desktop/aa365747.aspx</span></span>
<span class="line"><span>mov rcx, hFile ; HANDLE hFile (here: Stdout)</span></span>
<span class="line"><span>lea rdx, hello ; LPCVOID lpBuffer</span></span>
<span class="line"><span>lea r9, BytesWritten ; LPDWORD lpNumberOfBytesWritten</span></span>
<span class="line"><span>mov r8d, LENGTHOF hello ; DWORD nNumberOfBytesToWrite</span></span>
<span class="line"><span>mov qword ptr [rsp+32], 0 ; LPOVERLAPPED lpOverlapped = NULL</span></span>
<span class="line"><span>call WriteFile ; Call WinAPI</span></span>
<span class="line"><span></span></span>
<span class="line"><span>exit:</span></span>
<span class="line"><span>; https://msdn.microsoft.com/library/windows/desktop/ms682658.aspx</span></span>
<span class="line"><span>xor ecx, ecx ; Set RCX to null for return value</span></span>
<span class="line"><span>call ExitProcess ; Call WinAPI to exit</span></span>
<span class="line"><span>main ENDP</span></span>
<span class="line"><span></span></span>
<span class="line"><span>END</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,6)]))}const o=n(t,[["render",c],["__file","index.html.vue"]]),m=JSON.parse('{"path":"/article/tr4ayjno/","title":"assembly","lang":"zh-CN","frontmatter":{"title":"assembly","tags":["assembly"],"createTime":"2025/02/28 19:25:24","permalink":"/article/tr4ayjno/","description":"创建一个空 windows 程序空项目 右键项目选择 生成依赖项 -> 生成自定义 -> 选择 masm 新建一个空的 cpp 文件，后缀自己换成 .asm 右键项目选择 属性 -> 链接器 -> 系统 -> 子系统 -> 控制台 (/SUBSYSTEM:CONSOLE) 右键项目选择 属性 -> 链接器 -> 系统 -> 高级 -> 入口点(自己填 ...","head":[["meta",{"property":"og:url","content":"https://upcloudrabbit.github.io/blog/blog/article/tr4ayjno/"}],["meta",{"property":"og:site_name","content":"upcloudrabbit blog"}],["meta",{"property":"og:title","content":"assembly"}],["meta",{"property":"og:description","content":"创建一个空 windows 程序空项目 右键项目选择 生成依赖项 -> 生成自定义 -> 选择 masm 新建一个空的 cpp 文件，后缀自己换成 .asm 右键项目选择 属性 -> 链接器 -> 系统 -> 子系统 -> 控制台 (/SUBSYSTEM:CONSOLE) 右键项目选择 属性 -> 链接器 -> 系统 -> 高级 -> 入口点(自己填 ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-01T06:16:18.000Z"}],["meta",{"property":"article:tag","content":"assembly"}],["meta",{"property":"article:modified_time","content":"2025-03-01T06:16:18.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"assembly\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-01T06:16:18.000Z\\",\\"author\\":[]}"]]},"headers":[],"readingTime":{"minutes":0.94,"words":281},"git":{"updatedTime":1740809778000,"contributors":[{"name":"upcloudrabbit","username":"upcloudrabbit","email":"1814876440@qq.com","commits":2,"avatar":"https://avatars.githubusercontent.com/upcloudrabbit?v=4","url":"https://github.com/upcloudrabbit"}]},"autoDesc":true,"filePathRelative":"c&cpp/assembly.md","categoryList":[{"id":"76214a","sort":10003,"name":"c&cpp"}]}');export{o as comp,m as data};
