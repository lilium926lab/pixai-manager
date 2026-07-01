// PixAI 管理ツール
// ローカルストレージにデータを保存し、プロンプト、ベースモデル、LoRA を管理します。

const STORAGE_KEY = 'pixaiManagerData';

// 初期データを読み込み
function loadData() {
    const json = localStorage.getItem(STORAGE_KEY);
    if (json) {
        try {
            const data = JSON.parse(json);
            return {
                prompts: data.prompts || [],
                baseModels: data.baseModels || [],
                loras: data.loras || []
            };
        } catch (e) {
            console.error('データの読み込みに失敗しました', e);
        }
    }
    return { prompts: [], baseModels: [], loras: [] };
}

// データを保存
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataStore));
}

// データストア
let dataStore = loadData();

// ユニークID生成
function generateId() {
    return Date.now() + Math.random().toString(36).substring(2, 9);
}

// --- プロンプト管理 ---
const promptForm = document.getElementById('promptForm');
const promptTableBody = document.querySelector('#promptTable tbody');
const promptSearch = document.getElementById('promptSearch');

promptForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('promptName').value.trim();
    const text = document.getElementById('promptText').value.trim();
    if (name && text) {
        dataStore.prompts.push({ id: generateId(), name, text });
        saveData();
        promptForm.reset();
        renderPrompts();
    }
});

function deletePrompt(id) {
    dataStore.prompts = dataStore.prompts.filter(p => p.id !== id);
    saveData();
    renderPrompts();
}

function renderPrompts() {
    const query = promptSearch.value.toLowerCase();
    promptTableBody.innerHTML = '';
    dataStore.prompts
        .filter(p => p.name.toLowerCase().includes(query) || p.text.toLowerCase().includes(query))
        .forEach(p => {
            const tr = document.createElement('tr');
            const tdName = document.createElement('td');
            tdName.textContent = p.name;
            const tdText = document.createElement('td');
            tdText.textContent = p.text;
            const tdActions = document.createElement('td');
            const delBtn = document.createElement('button');
            delBtn.textContent = '削除';
            delBtn.className = 'delete';
            delBtn.addEventListener('click', () => deletePrompt(p.id));
            tdActions.appendChild(delBtn);
            tr.appendChild(tdName);
            tr.appendChild(tdText);
            tr.appendChild(tdActions);
            promptTableBody.appendChild(tr);
        });
}

promptSearch.addEventListener('input', renderPrompts);

// --- ベースモデル管理 ---
const baseModelForm = document.getElementById('baseModelForm');
const baseModelTableBody = document.querySelector('#baseModelTable tbody');
const baseModelFilterCommercial = document.getElementById('baseModelFilterCommercial');
const baseModelSearch = document.getElementById('baseModelSearch');

baseModelForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('baseModelName').value.trim();
    const type = document.getElementById('baseModelType').value.trim();
    const tagsStr = document.getElementById('baseModelTags').value.trim();
    const commercial = document.getElementById('baseModelCommercial').checked;
    const tags = tagsStr ? tagsStr.split(/\s*,\s*/) : [];
    if (name && type) {
        dataStore.baseModels.push({ id: generateId(), name, type, tags, commercial });
        saveData();
        baseModelForm.reset();
        renderBaseModels();
    }
});

function deleteBaseModel(id) {
    dataStore.baseModels = dataStore.baseModels.filter(m => m.id !== id);
    saveData();
    renderBaseModels();
}

function renderBaseModels() {
    const showCommercialOnly = baseModelFilterCommercial.checked;
    const query = baseModelSearch.value.toLowerCase();
    baseModelTableBody.innerHTML = '';
    dataStore.baseModels
        .filter(m => {
            if (showCommercialOnly && !m.commercial) return false;
            const tagString = m.tags.join(',');
            return m.name.toLowerCase().includes(query) || m.type.toLowerCase().includes(query) || tagString.toLowerCase().includes(query);
        })
        .forEach(m => {
            const tr = document.createElement('tr');
            const tdName = document.createElement('td');
            tdName.textContent = m.name;
            const tdType = document.createElement('td');
            tdType.textContent = m.type;
            const tdTags = document.createElement('td');
            tdTags.textContent = m.tags.join(', ');
            const tdComm = document.createElement('td');
            tdComm.textContent = m.commercial ? '可' : '不可';
            const tdActions = document.createElement('td');
            const delBtn = document.createElement('button');
            delBtn.textContent = '削除';
            delBtn.className = 'delete';
            delBtn.addEventListener('click', () => deleteBaseModel(m.id));
            tdActions.appendChild(delBtn);
            tr.appendChild(tdName);
            tr.appendChild(tdType);
            tr.appendChild(tdTags);
            tr.appendChild(tdComm);
            tr.appendChild(tdActions);
            baseModelTableBody.appendChild(tr);
        });
}

baseModelFilterCommercial.addEventListener('change', renderBaseModels);
baseModelSearch.addEventListener('input', renderBaseModels);

// --- LoRA 管理 ---
const loraForm = document.getElementById('loraForm');
const loraTableBody = document.querySelector('#loraTable tbody');
const loraFilterCommercial = document.getElementById('loraFilterCommercial');
const loraSearch = document.getElementById('loraSearch');

loraForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('loraName').value.trim();
    const baseModel = document.getElementById('loraBaseModel').value.trim();
    const tagsStr = document.getElementById('loraTags').value.trim();
    const commercial = document.getElementById('loraCommercial').checked;
    const tags = tagsStr ? tagsStr.split(/\s*,\s*/) : [];
    if (name && baseModel) {
        dataStore.loras.push({ id: generateId(), name, baseModel, tags, commercial });
        saveData();
        loraForm.reset();
        renderLoras();
    }
});

function deleteLora(id) {
    dataStore.loras = dataStore.loras.filter(l => l.id !== id);
    saveData();
    renderLoras();
}

function renderLoras() {
    const showCommercialOnly = loraFilterCommercial.checked;
    const query = loraSearch.value.toLowerCase();
    loraTableBody.innerHTML = '';
    dataStore.loras
        .filter(l => {
            if (showCommercialOnly && !l.commercial) return false;
            const tagString = l.tags.join(',');
            return l.name.toLowerCase().includes(query) || l.baseModel.toLowerCase().includes(query) || tagString.toLowerCase().includes(query);
        })
        .forEach(l => {
            const tr = document.createElement('tr');
            const tdName = document.createElement('td');
            tdName.textContent = l.name;
            const tdBaseModel = document.createElement('td');
            tdBaseModel.textContent = l.baseModel;
            const tdTags = document.createElement('td');
            tdTags.textContent = l.tags.join(', ');
            const tdComm = document.createElement('td');
            tdComm.textContent = l.commercial ? '可' : '不可';
            const tdActions = document.createElement('td');
            const delBtn = document.createElement('button');
            delBtn.textContent = '削除';
            delBtn.className = 'delete';
            delBtn.addEventListener('click', () => deleteLora(l.id));
            tdActions.appendChild(delBtn);
            tr.appendChild(tdName);
            tr.appendChild(tdBaseModel);
            tr.appendChild(tdTags);
            tr.appendChild(tdComm);
            tr.appendChild(tdActions);
            loraTableBody.appendChild(tr);
        });
}

loraFilterCommercial.addEventListener('change', renderLoras);
loraSearch.addEventListener('input', renderLoras);

// 初期描画
document.addEventListener('DOMContentLoaded', () => {
    renderPrompts();
    renderBaseModels();
    renderLoras();
});