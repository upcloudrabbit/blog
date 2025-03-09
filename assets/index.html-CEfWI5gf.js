import{_ as p,c as r,a,b as n,d as i,e as o,f as e,r as c,o as d}from"./app-CJfFg5nr.js";const t="/blog/assets/1-rllfRTOm.png",u={},b={start:"3"},m={start:"4"};function v(y,s){const l=c("font");return d(),r("div",null,[s[4]||(s[4]=a(`<p>修改 IP：</p><ol><li>进入路径 <code>cd /etc/network</code></li><li>进行编辑 <code>interfaces</code></li></ol><div class="language-plain line-numbers-mode" data-ext="plain" data-title="plain"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span># This file describes the network interfaces available on your system</span></span>
<span class="line"><span># and how to activate them. For more information, see interfaces(5).</span></span>
<span class="line"><span></span></span>
<span class="line"><span>source /etc/network/interfaces.d/*</span></span>
<span class="line"><span></span></span>
<span class="line"><span># The loopback network interface</span></span>
<span class="line"><span># 这里配置静态地址的话把 ens33 也加上</span></span>
<span class="line"><span>auto lo ens33</span></span>
<span class="line"><span>iface lo inet loopback</span></span>
<span class="line"><span></span></span>
<span class="line"><span># The primary network interface</span></span>
<span class="line"><span>allow-hotplug ens33</span></span>
<span class="line"><span>#iface ens33 inet dhcp</span></span>
<span class="line"><span>iface ens33 inet static</span></span>
<span class="line"><span>address 192.168.109.50</span></span>
<span class="line"><span>netmask 255.255.255.0</span></span>
<span class="line"><span>gateway 192.168.109.2</span></span>
<span class="line"><span># 顺便配置域名解析服务</span></span>
<span class="line"><span>dns-nameservers 223.5.5.5, 192.168.109.2</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>重启网卡 <code>systemctl restart networking</code></li></ol><p>开放 Root 远程登录：</p><ol><li>进入路径 <code>cd /etc/ssh</code></li><li>编辑文件 <code>sshd_config</code>添加或者取消注释 <code>PermitRootLogin yes</code> <code>PasswordAuthentication yes</code>分别在 33、57 行左右位置</li><li>重启 ssh 服务 <code>/etc/init.d/ssh restart</code></li></ol><h1 id="debian11-修改-apt-get-源" tabindex="-1"><a class="header-anchor" href="#debian11-修改-apt-get-源"><span>Debian11 修改 apt-get 源</span></a></h1><p>使用命令 apt-get 安装包时有时会出现 <code>Media change: please insert the disc labeled</code>错误，这个是源没有选对，直接修改源 <code>vi /etc/apt/sources.list</code>。参考以下：</p><ul><li>debian11 源</li></ul><div class="language-plain line-numbers-mode" data-ext="plain" data-title="plain"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span>deb https://mirrors.huaweicloud.com/debian/ bullseye main non-free contrib</span></span>
<span class="line"><span>deb https://mirrors.huaweicloud.com/debian/ bullseye-updates main non-free contrib</span></span>
<span class="line"><span>deb https://mirrors.huaweicloud.com/debian/ bullseye-backports main non-free contrib</span></span>
<span class="line"><span>deb https://mirrors.tuna.tsinghua.edu.cn/debian-security/ bullseye-security main non-free contrib</span></span>
<span class="line"><span>deb https://security.debian.org/debian-security bullseye-security main non-free contrib</span></span>
<span class="line"><span>deb-src https://mirrors.huaweicloud.com/debian/ bullseye main non-free contrib</span></span>
<span class="line"><span>deb-src https://mirrors.huaweicloud.com/debian/ bullseye-updates main contrib</span></span>
<span class="line"><span>deb-src https://mirrors.huaweicloud.com/debian/ bullseye-backports main non-free contrib</span></span>
<span class="line"><span>deb-src https://mirrors.tuna.tsinghua.edu.cn/debian-security/ bullseye-security main non-free contrib</span></span>
<span class="line"><span>deb-src https://security.debian.org/debian-security bullseye-security main non-free contrib</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>debian12 源</li></ul><div class="language-plain line-numbers-mode" data-ext="plain" data-title="plain"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span>deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free non-free-firmware </span></span>
<span class="line"><span>deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free non-free-firmware </span></span>
<span class="line"><span>deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware </span></span>
<span class="line"><span>deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware </span></span>
<span class="line"><span>deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-backports main contrib non-free non-free-firmware </span></span>
<span class="line"><span>deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-backports main contrib non-free non-free-firmware</span></span>
<span class="line"><span>deb https://mirrors.tuna.tsinghua.edu.cn/debian-security bookworm-security main contrib non-free non-free-firmware </span></span>
<span class="line"><span>deb-src https://mirrors.tuna.tsinghua.edu.cn/debian-security bookworm-security main contrib non-free non-free-firmware</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>运行命令更新源 <code>rm -rf sources.list~ sources.list.d &amp;&amp; apt update</code></p><h1 id="debian11-安装-docker-ce" tabindex="-1"><a class="header-anchor" href="#debian11-安装-docker-ce"><span>Debian11 安装 Docker-CE</span></a></h1><ol><li>Docker 安装要求 linux 内核不能低于 3.10</li><li>安装 Docker 依赖环境</li></ol><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span style="color:#61AFEF;">apt-get</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> apt-transport-https</span><span style="color:#98C379;"> ca-certificates</span><span style="color:#98C379;"> curl</span><span style="color:#98C379;"> gnupg</span><span style="color:#98C379;"> lsb-release</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div>`,16)),n("ol",b,[n("li",null,[i(l,{style:{color:"rgb(51, 51, 51)"}},{default:o(()=>s[0]||(s[0]=[e("添加 Docker 官方的 GPT 密钥")])),_:1})])]),s[5]||(s[5]=a('<div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -fsSL</span><span style="color:#98C379;"> https://download.docker.com/linux/debian/gpg</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> gpg</span><span style="color:#D19A66;"> --dearmor</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> /usr/share/keyrings/docker-archive-keyring.gpg</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div>',1)),n("ol",m,[n("li",null,[i(l,{style:{color:"rgb(51, 51, 51)"}},{default:o(()=>s[1]||(s[1]=[e("安装 Docker 源（命令中的 lsb_release -cs 返回 bullseye，也就是debian11 的代号）")])),_:1})])]),s[6]||(s[6]=a(`<div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span style="color:#61AFEF;">mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> /etc/apt/sources.list.d</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">touch</span><span style="color:#98C379;"> /etc/apt/sources.list.d/docker.list</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(</span><span style="color:#61AFEF;">lsb_release</span><span style="color:#D19A66;"> -cs</span><span style="color:#98C379;">) stable&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#98C379;"> /etc/apt/sources.list.d/docker.list</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/dev/null</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ol start="5"><li>更新下 apt 源</li></ol><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span style="color:#61AFEF;">apt-get</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> update</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ol start="6"><li>安装 Docker 引擎（这里安装完成就已经启动并且添加到开机自启了）</li></ol><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span style="color:#61AFEF;">apt-get</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> docker-ce</span><span style="color:#98C379;"> docker-ce-cli</span><span style="color:#98C379;"> containerd.io</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ol start="7"><li>修改 docker 拉取镜像源，<a href="https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors" target="_blank" rel="noopener noreferrer">阿里云镜像源</a>（data-root 可指定存储本地镜像路径——需要有读写权限）</li></ol><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span style="color:#61AFEF;">mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> /etc/docker</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">tee</span><span style="color:#98C379;"> /etc/docker/daemon.json</span><span style="color:#ABB2BF;"> &lt;&lt;-</span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">{</span></span>
<span class="line"><span style="color:#98C379;">  &quot;data-root&quot;: &quot;/home/lhc/softs/docker_storage&quot;,</span></span>
<span class="line"><span style="color:#98C379;">  &quot;registry-mirrors&quot;: [</span></span>
<span class="line"><span style="color:#98C379;">    &quot;https://docker.m.daocloud.io&quot;,</span></span>
<span class="line"><span style="color:#98C379;">    &quot;https://docker.jianmuhub.com&quot;,</span></span>
<span class="line"><span style="color:#98C379;">    &quot;https://huecker.io&quot;,</span></span>
<span class="line"><span style="color:#98C379;">    &quot;https://dockerhub.timeweb.cloud&quot;,</span></span>
<span class="line"><span style="color:#98C379;">    &quot;https://dockerhub1.beget.com&quot;</span></span>
<span class="line"><span style="color:#98C379;">  ]</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="8"><li>添加用户到 Docker 组（不用每次切到 root 用户也能使用 docker 命令, docker 组在安装 docker 时已经自动创建完成）</li></ol><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span style="color:#61AFEF;">usermod</span><span style="color:#D19A66;"> -aG</span><span style="color:#98C379;"> docker</span><span style="color:#98C379;"> mpsp</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 退出到 mpsp 用户执行以下命令, 或者重启服务器</span></span>
<span class="line"><span style="color:#61AFEF;">newgrp</span><span style="color:#98C379;"> docker</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="debian12-安装-vim-失败" tabindex="-1"><a class="header-anchor" href="#debian12-安装-vim-失败"><span>Debian12 安装 vim 失败</span></a></h1><p>debian12 安装 vim 时出现以下问题，说是 vim-common 出现版本冲突，于是卸载 vim-common 结果 vi 也不能用了</p><p><img src="`+t+`" alt="" width="1373" height="379"></p><p>这里需要按照以下步骤进行处理，aptitude 会给出解决方案，方案一条条给出：方案一时啥也不干，直接 n + 回车否决；方案二为降级两个包的版本，这里可以解决问题，方案三为卸载一个包，降级 ncurses-base （参照提示问题就在这个包上）直接 Y + 回车安装完成，vim 和 vi 都可以使用</p><div class="language-plain line-numbers-mode" data-ext="plain" data-title="plain"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span>apt-get purge -y vim-common</span></span>
<span class="line"><span>apt-get update &amp;&amp; apt-get upgrade</span></span>
<span class="line"><span># 安装 aptitude（功能与 apt-get 一致且拥有解决包冲突的能力）</span></span>
<span class="line"><span>apt-get install -y aptitude</span></span>
<span class="line"><span>aptitude install vim</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="`+t+'" alt="" width="1373" height="379"></p><h1 id="debian12-安装-bochs" tabindex="-1"><a class="header-anchor" href="#debian12-安装-bochs"><span>Debian12 安装 bochs</span></a></h1><p>安装版本为: bochs-2.7</p>',17)),n("ol",null,[s[3]||(s[3]=n("li",null,[e("首先需要安装依赖 "),n("code",null,'<font style="color:rgb(24, 25, 28);">apt install -y libghc-x11-dev xorg-dev libgtk2.0-dev libgtk-3-dev libxpm-dev libxrandr-dev </font>build-essential make libsdl1.2-dev libncurses5-dev')],-1)),n("li",null,[i(l,{style:{color:"rgb(24, 25, 28)"}},{default:o(()=>s[2]||(s[2]=[e("依次运行以下命令安装")])),_:1})])]),s[7]||(s[7]=a(`<div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span style="color:#7F848E;font-style:italic;"># --prefix 可以指定安装路径</span></span>
<span class="line"><span style="color:#61AFEF;">./configure</span><span style="color:#D19A66;"> --prefix=/home/liuhaochu/softs/bochs-2.7</span><span style="color:#D19A66;"> --enable-debugger</span><span style="color:#D19A66;"> --enable-disasm</span><span style="color:#D19A66;"> --enable-iodebug</span><span style="color:#D19A66;"> --enable-x86-debugger</span><span style="color:#D19A66;"> --with-x</span><span style="color:#D19A66;"> --with-x11</span><span style="color:#D19A66;"> --enable-debugger-gui</span><span style="color:#98C379;"> LDFLAGS=&#39;-pthread&#39;</span></span>
<span class="line"><span style="color:#61AFEF;">make</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">make</span><span style="color:#98C379;"> install</span><span style="color:#ABB2BF;"> </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加到软链到全局</span></span>
<span class="line"><span style="color:#61AFEF;">ln</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> 用户路径/bochs</span><span style="color:#98C379;"> /usr/local/bin</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">ln</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> 用户路径/bximage</span><span style="color:#98C379;"> /usr/local/bin</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>如果需要 Debug 版本则需要重写选择一个目录进行安装（在源码目录下运行）</li></ol><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span style="color:#7F848E;font-style:italic;"># 清空原来的编译文件</span></span>
<span class="line"><span style="color:#61AFEF;">make</span><span style="color:#98C379;"> clean</span></span>
<span class="line"><span style="color:#61AFEF;">./configure</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --prefix=/home/liuhaochu/softs/bochs-gdb-2.7</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --without-wx</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --with-x11</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --with-x</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --with-term</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --disable-docbook</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --enable-cpu-level=6</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --enable-fpu</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --enable-3dnow</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --enable-disasm</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --enable-long-phy-address</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --enable-disasm</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --enable-pcidev</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --enable-usb</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --with-sdl</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --enable-all-optimizations</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --enable-gdb-stub</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --with-nogui</span></span>
<span class="line"><span style="color:#61AFEF;">sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;s/^LIBS = /LIBS = -lpthread/g&#39;</span><span style="color:#98C379;"> Makefile</span></span>
<span class="line"><span style="color:#61AFEF;">make</span><span style="color:#D19A66;"> -j</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;"> &amp; </span><span style="color:#61AFEF;">make</span><span style="color:#98C379;"> install</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 这里只需要编译完成的 bochs 即可</span></span>
<span class="line"><span style="color:#61AFEF;">ln</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> 用户路径/bochs</span><span style="color:#98C379;"> /usr/local/bin/bochs-gdb</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3))])}const g=p(u,[["render",v],["__file","index.html.vue"]]),k=JSON.parse('{"path":"/article/lmenjhvq/","title":"debian","lang":"zh-CN","frontmatter":{"title":"debian","tags":["debian","os"],"createTime":"2025/03/09 19:15:14","permalink":"/article/lmenjhvq/","description":"修改 IP： 进入路径 cd /etc/network 进行编辑 interfaces 重启网卡 systemctl restart networking 开放 Root 远程登录： 进入路径 cd /etc/ssh 编辑文件 sshd_config添加或者取消注释 PermitRootLogin yes PasswordAuthentication ...","head":[["meta",{"property":"og:url","content":"https://upcloudrabbit.github.io/blog/blog/article/lmenjhvq/"}],["meta",{"property":"og:site_name","content":"upcloudrabbit blog"}],["meta",{"property":"og:title","content":"debian"}],["meta",{"property":"og:description","content":"修改 IP： 进入路径 cd /etc/network 进行编辑 interfaces 重启网卡 systemctl restart networking 开放 Root 远程登录： 进入路径 cd /etc/ssh 编辑文件 sshd_config添加或者取消注释 PermitRootLogin yes PasswordAuthentication ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-09T11:20:29.000Z"}],["meta",{"property":"article:tag","content":"debian"}],["meta",{"property":"article:tag","content":"os"}],["meta",{"property":"article:modified_time","content":"2025-03-09T11:20:29.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"debian\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-09T11:20:29.000Z\\",\\"author\\":[]}"]]},"headers":[],"readingTime":{"minutes":3.96,"words":1188},"git":{"updatedTime":1741519229000,"contributors":[{"name":"upcloudrabbit","username":"upcloudrabbit","email":"1814876440@qq.com","commits":2,"avatar":"https://avatars.githubusercontent.com/upcloudrabbit?v=4","url":"https://github.com/upcloudrabbit"}]},"autoDesc":true,"filePathRelative":"os/debian.md","categoryList":[{"id":"dd302f","sort":10000,"name":"os"}]}');export{g as comp,k as data};
