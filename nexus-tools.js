fluid: { active: false, frame: null, canvas: null, listener: null },
        flow: { active: false, frame: null, canvas: null, listener: null },
        dvd: { active: false, frame: null, element: null, x: 0, y: 0, vx: 2, vy: 2 },
        flashlight: { active: false, overlay: null, listener: null },
        shake: { active: false },
        editMode: { active: false },
        zapper: { active: false, overListener: null, outListener: null, clickListener: null, hoveredEl: null },
        ghost: { active: false, clickListener: null },
        cloner: { active: false, clickListener: null },
        swapper: { active: false, listener: null, url: '' },
        imager: { active: false, element: null, isDragging: false, isResizing: false },
        imgEditor: { active: false, overListener: null, outListener: null, clickListener: null, toolbar: null, currentImg: null },
        hijacker: { active: false, clickListener: null },
        colorizer: { active: false, clickListener: null },
        windows: []
    };

@@ -33,11 +37,11 @@
            @keyframes mega-enter { 0% { opacity: 0; transform: scale(0.9) translateY(-20px); filter: blur(10px) } 100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0) } }
            @keyframes mega-shake { 0% { transform: translate(2px, 1px) rotate(0deg); } 10% { transform: translate(-1px, -2px) rotate(-1deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 30% { transform: translate(0px, 2px) rotate(0deg); } 40% { transform: translate(1px, -1px) rotate(1deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 60% { transform: translate(-3px, 1px) rotate(0deg); } 70% { transform: translate(2px, 1px) rotate(-1deg); } 80% { transform: translate(-1px, -1px) rotate(1deg); } 90% { transform: translate(2px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }
            .mega-shake-active { animation: mega-shake 0.4s infinite !important; overflow: hidden !important; }
            .mega-window { position: fixed; background: var(--bg-panel); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid var(--accent-glow); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--accent-glow); border-radius: var(--border-rad); display: flex; flex-direction: column; font-family: var(--font-main); color: var(--text-main); animation: mega-enter 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; z-index: 9999990; resize: both; overflow: hidden; min-width: 300px; min-height: 400px }
            .mega-window { position: fixed; background: var(--bg-panel); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid var(--accent-glow); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--accent-glow); border-radius: var(--border-rad); display: flex; flex-direction: column; font-family: var(--font-main); color: var(--text-main); animation: mega-enter 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; z-index: 9999990; resize: both; overflow: hidden; min-width: 320px; min-height: 400px }
            .mega-header { padding: 12px 16px; background: var(--bg-header); border-bottom: 1px solid var(--accent-glow); cursor: grab; display: flex; align-items: center; justify-content: space-between; font-weight: 700; font-size: 14px; user-select: none; flex-shrink: 0 }
            .mega-header:active { cursor: grabbing }
            .mega-tab-bar { display: flex; border-bottom: 1px solid var(--accent-glow); background: rgba(0,0,0,0.2); }
            .mega-tab-btn { flex: 1; background: transparent; border: none; padding: 10px; color: var(--text-main); cursor: pointer; opacity: 0.7; font-weight: 600; border-bottom: 2px solid transparent; transition: all 0.2s; }
            .mega-tab-btn { flex: 1; background: transparent; border: none; padding: 10px; color: var(--text-main); cursor: pointer; opacity: 0.7; font-weight: 600; font-size: 11px; border-bottom: 2px solid transparent; transition: all 0.2s; }
            .mega-tab-btn:hover { opacity: 1; background: rgba(255,255,255,0.05); }
            .mega-tab-btn.active { opacity: 1; border-bottom: 2px solid var(--accent); background: rgba(255,255,255,0.05); }
            .mega-content { flex: 1; overflow-y: auto; padding: 16px; display: none; }
@@ -255,40 +259,48 @@
        const panel = document.createElement('div');
        panel.id = 'fun-effects-mega-ui';
        panel.className = 'mega-window';
        Object.assign(panel.style, { top: '20px', right: '20px', width: '340px', height: '650px', left: 'auto', bottom: 'auto' });
        Object.assign(panel.style, { top: '20px', right: '20px', width: '360px', height: '650px', left: 'auto', bottom: 'auto' });

        const header = document.createElement('div');
        header.className = 'mega-header';
        header.innerHTML = '<div style="display:flex;gap:10px;align-items:center;"><span style="font-size:18px">⚡</span><span>NEXUS CONTROL</span></div>';
        panel.appendChild(header);
        makeDraggable(panel, header);

        /* Tabs */
        /* 3 TABS SETUP */
        const tabBar = document.createElement('div');
        tabBar.className = 'mega-tab-bar';
        
        const tabMain = document.createElement('button');
        tabMain.className = 'mega-tab-btn active';
        tabMain.innerText = 'FX & Chaos';
        tabMain.className = 'mega-tab-btn active'; tabMain.innerText = 'FX & Chaos';
        
        const tabEdit = document.createElement('button');
        tabEdit.className = 'mega-tab-btn';
        tabEdit.innerText = 'Editor & Img';
        tabEdit.className = 'mega-tab-btn'; tabEdit.innerText = 'Editor & Img';
        
        const tabLinks = document.createElement('button');
        tabLinks.className = 'mega-tab-btn'; tabLinks.innerText = 'Mods & Colors';

        tabBar.appendChild(tabMain);
        tabBar.appendChild(tabEdit);
        tabBar.appendChild(tabLinks);
        panel.appendChild(tabBar);

        const contentMain = document.createElement('div');
        contentMain.className = 'mega-content active';
        const contentEdit = document.createElement('div');
        contentEdit.className = 'mega-content';
        const contentMain = document.createElement('div'); contentMain.className = 'mega-content active';
        const contentEdit = document.createElement('div'); contentEdit.className = 'mega-content';
        const contentLinks = document.createElement('div'); contentLinks.className = 'mega-content';

        /* Tab Logic */
        tabMain.onclick = function() {
            tabMain.classList.add('active'); tabEdit.classList.remove('active');
            contentMain.classList.add('active'); contentEdit.classList.remove('active');
            tabMain.classList.add('active'); tabEdit.classList.remove('active'); tabLinks.classList.remove('active');
            contentMain.classList.add('active'); contentEdit.classList.remove('active'); contentLinks.classList.remove('active');
        };
        tabEdit.onclick = function() {
            tabEdit.classList.add('active'); tabMain.classList.remove('active');
            contentEdit.classList.add('active'); contentMain.classList.remove('active');
            tabEdit.classList.add('active'); tabMain.classList.remove('active'); tabLinks.classList.remove('active');
            contentEdit.classList.add('active'); contentMain.classList.remove('active'); contentLinks.classList.remove('active');
        };
        tabLinks.onclick = function() {
            tabLinks.classList.add('active'); tabMain.classList.remove('active'); tabEdit.classList.remove('active');
            contentLinks.classList.add('active'); contentMain.classList.remove('active'); contentEdit.classList.remove('active');
        };

        /* Helpers */
@@ -309,7 +321,7 @@
            return d;
        }

        /* --- MAIN TAB CONTENT --- */
        /* --- TAB 1: MAIN & FX --- */
        contentMain.appendChild(createTitle('UI Theme'));
        const themeSel = document.createElement('select'); themeSel.id = 'mega-theme-sel'; themeSel.className = 'mega-select';
        themeSel.innerHTML = '<option value="cyberpunk">Cyberpunk</option><option value="matrix">Matrix / Hacker</option><option value="synthwave">Synthwave</option><option value="light">Clean Light</option>';
@@ -368,6 +380,28 @@
            } return state.flow.active;
        }));

        // NEW Flashlight Mode
        contentMain.appendChild(createBtn('Mode: Flashlight', '🔦', function() {
            if(state.flashlight.active) {
                document.removeEventListener('mousemove', state.flashlight.listener);
                if(state.flashlight.overlay) state.flashlight.overlay.remove();
                state.flashlight.active = false;
            } else {
                const overlay = document.createElement('div');
                Object.assign(overlay.style, {
                    position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '999980',
                    background: 'radial-gradient(circle at 50vw 50vh, transparent 100px, rgba(0,0,0,0.95) 150px)'
                });
                document.body.appendChild(overlay);
                state.flashlight.overlay = overlay;
                state.flashlight.listener = function(e) {
                    overlay.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, transparent 100px, rgba(0,0,0,0.95) 150px)`;
                };
                document.addEventListener('mousemove', state.flashlight.listener);
                state.flashlight.active = true;
            } return state.flashlight.active;
        }));

        contentMain.appendChild(createTitle('Chaos Tools'));

        contentMain.appendChild(createBtn('System Shake', '💢', function() {
@@ -386,7 +420,8 @@
            return false;
        }));

        /* --- EDITING TAB CONTENT --- */

        /* --- TAB 2: EDITING TAB CONTENT --- */
        contentEdit.appendChild(createTitle('Text Editor'));
        const toolbar = document.createElement('div'); toolbar.className = 'mega-toolbar';
        ['B', 'I', 'U'].forEach(function(cmd) {
@@ -442,6 +477,22 @@
            } return state.ghost.active;
        }));

        // NEW Element Cloner
        contentEdit.appendChild(createBtn('Mode: Element Cloner', '👯', function() {
            if(state.cloner.active) {
                document.removeEventListener('click', state.cloner.clickListener, true); state.cloner.active = false;
            } else {
                state.cloner.clickListener = function(e) {
                    if(!e.target.closest('.mega-window')) {
                        e.preventDefault(); e.stopPropagation();
                        const clone = e.target.cloneNode(true);
                        e.target.parentNode.insertBefore(clone, e.target.nextSibling);
                    }
                };
                document.addEventListener('click', state.cloner.clickListener, true); state.cloner.active = true;
            } return state.cloner.active;
        }));

        contentEdit.appendChild(createTitle('Image Tools'));

        contentEdit.appendChild(createBtn('Live Image Editor', '🛠️', function() {
@@ -499,8 +550,70 @@
        contentEdit.appendChild(imagerBtn);
        const imagerText = document.createElement('div'); imagerText.innerHTML = '<div class="mega-helper-text">Imager: Drag/Resize -> Press ENTER to set.</div>'; contentEdit.appendChild(imagerText);


        /* --- TAB 3: MODS & COLORS (NEW) --- */
        
        // Link Hijacker
        contentLinks.appendChild(createTitle('Link Hijacker'));
        const newLinkUrl = document.createElement('input'); newLinkUrl.className = 'mega-input'; newLinkUrl.placeholder = 'New Link Target URL (https://...)';
        const newLinkText = document.createElement('input'); newLinkText.className = 'mega-input'; newLinkText.placeholder = 'New Hypertext (Optional)';
        contentLinks.appendChild(newLinkUrl);
        contentLinks.appendChild(newLinkText);

        contentLinks.appendChild(createBtn('Mode: Click to Hijack Link', '🔗', function() {
            if(state.hijacker.active) {
                document.removeEventListener('click', state.hijacker.clickListener, true); state.hijacker.active = false;
            } else {
                if(!newLinkUrl.value) { alert('Enter a Target URL first!'); return false; }
                state.hijacker.clickListener = function(e) {
                    const aTag = e.target.closest('a');
                    if(aTag && !aTag.closest('.mega-window')) {
                        e.preventDefault(); e.stopPropagation();
                        aTag.href = newLinkUrl.value;
                        if(newLinkText.value) aTag.innerText = newLinkText.value;
                    }
                };
                document.addEventListener('click', state.hijacker.clickListener, true); state.hijacker.active = true;
            } return state.hijacker.active;
        }));
        
        const hijackerText = document.createElement('div'); hijackerText.innerHTML = '<div class="mega-helper-text">Enable -> Click a link on the page to change where it goes.</div>'; contentLinks.appendChild(hijackerText);

        // Element Color Changer
        contentLinks.appendChild(createTitle('Element Colorizer'));
        
        const colorTools = document.createElement('div'); colorTools.className = 'mega-toolbar';
        
        const bgLbl = document.createElement('span'); bgLbl.innerText = 'Back:'; bgLbl.style.fontSize='12px';
        const bgColorPicker = document.createElement('input'); bgColorPicker.type = 'color'; bgColorPicker.value = '#00f0ff'; bgColorPicker.className = 'mega-color-picker';
        
        const fgLbl = document.createElement('span'); fgLbl.innerText = 'Text:'; fgLbl.style.fontSize='12px'; fgLbl.style.marginLeft='10px';
        const fgColorPicker = document.createElement('input'); fgColorPicker.type = 'color'; fgColorPicker.value = '#000000'; fgColorPicker.className = 'mega-color-picker';
        
        colorTools.appendChild(bgLbl); colorTools.appendChild(bgColorPicker);
        colorTools.appendChild(fgLbl); colorTools.appendChild(fgColorPicker);
        contentLinks.appendChild(colorTools);

        contentLinks.appendChild(createBtn('Mode: Paint Elements', '🎨', function() {
            if(state.colorizer.active) {
                document.removeEventListener('click', state.colorizer.clickListener, true); state.colorizer.active = false;
            } else {
                state.colorizer.clickListener = function(e) {
                    if(!e.target.closest('.mega-window')) {
                        e.preventDefault(); e.stopPropagation();
                        e.target.style.backgroundColor = bgColorPicker.value;
                        e.target.style.color = fgColorPicker.value;
                    }
                };
                document.addEventListener('click', state.colorizer.clickListener, true); state.colorizer.active = true;
            } return state.colorizer.active;
        }));
        const colorizerText = document.createElement('div'); colorizerText.innerHTML = '<div class="mega-helper-text">Enable -> Click anything to change its color instantly.</div>'; contentLinks.appendChild(colorizerText);


        panel.appendChild(contentMain);
        panel.appendChild(contentEdit);
        panel.appendChild(contentLinks);

        /* Close */
        const closeBtn = document.createElement('button'); closeBtn.className = 'mega-btn'; closeBtn.style.marginTop = '20px';
@@ -510,11 +623,15 @@
            if (state.fluid.active) { cancelAnimationFrame(state.fluid.frame); window.removeEventListener('mousemove', state.fluid.listener); if(state.fluid.canvas) state.fluid.canvas.remove(); }
            if (state.flow.active) { cancelAnimationFrame(state.flow.frame); window.removeEventListener('mousemove', state.flow.listener); if(state.flow.canvas) state.flow.canvas.remove(); }
            if (state.dvd.active) { cancelAnimationFrame(state.dvd.frame); if(state.dvd.element) state.dvd.element.remove(); }
            if (state.flashlight.active) { document.removeEventListener('mousemove', state.flashlight.listener); if(state.flashlight.overlay) state.flashlight.overlay.remove(); }
            if (state.editMode.active) { document.designMode = 'off'; }
            if (state.shake.active) { document.body.classList.remove('mega-shake-active'); }
            if (state.zapper.active) { document.removeEventListener('mouseover', state.zapper.overListener, true); document.removeEventListener('mouseout', state.zapper.outListener, true); document.removeEventListener('click', state.zapper.clickListener, true); }
            if (state.ghost.active) { document.removeEventListener('click', state.ghost.clickListener, true); }
            if (state.cloner.active) { document.removeEventListener('click', state.cloner.clickListener, true); }
            if (state.swapper.active) { document.removeEventListener('click', state.swapper.listener, true); }
            if (state.hijacker.active) { document.removeEventListener('click', state.hijacker.clickListener, true); }
            if (state.colorizer.active) { document.removeEventListener('click', state.colorizer.clickListener, true); }
            if (state.imgEditor.active) { document.removeEventListener('mouseover', state.imgEditor.overListener, true); document.removeEventListener('mouseout', state.imgEditor.outListener, true); document.removeEventListener('click', state.imgEditor.clickListener, true); if(state.imgEditor.toolbar) state.imgEditor.toolbar.remove(); }
            if (state.imager.active && state.imager.element) { state.imager.element.remove(); }
            document.querySelectorAll('.mega-window').forEach(function(w) { w.remove(); });
