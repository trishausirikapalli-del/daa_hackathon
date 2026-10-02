/**
 * LONGEST COMMON STUDENT ACTIVITY - SINGLE PAGE APPLICATION CONTROLLER
 * Handles all AJAX interactions, Dynamic Forms, LCS comparisons,
 * Dashboard charts, Student reports, and Toast notifications.
 */

// Global State
const appState = {
    students: [],
    activities: [],
    comparisons: [],
    currentComparison: null,
    charts: {
        studentActivities: null,
        matchPercentages: null,
        categories: null,
        studentPerformance: null
    }
};

// ==============================================================================
// INITIALIZATION
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initDynamicSetup();
    initModals();
    initStudentsSection();
    initActivitiesSection();
    initCompareSection();
    initReportsSection();
    initHistorySection();

    // Initial Data Fetch
    loadInitialData();
});

async function loadInitialData() {
    await fetchStudents();
    await fetchActivities();
    await fetchDashboardData();
    await fetchComparisonHistory();
}

// ==============================================================================
// TOAST NOTIFICATIONS
// ==============================================================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check text-emerald';
    if (type === 'error') icon = 'fa-circle-exclamation text-rose';

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <div class="toast-content">${escapeHtml(message)}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ==============================================================================
// NAVIGATION (SPA SECTION SWITCHING)
// ==============================================================================

function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSectionId = btn.getAttribute('data-section');
            switchSection(targetSectionId);
        });
    });
}

function switchSection(sectionId) {
    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('data-section') === sectionId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update active section
    document.querySelectorAll('.spa-section').forEach(sec => {
        if (sec.id === sectionId) {
            sec.classList.add('active');
        } else {
            sec.classList.remove('active');
        }
    });

    // Specific triggers on section switch
    if (sectionId === 'dashboard-section') {
        fetchDashboardData();
    } else if (sectionId === 'students-section') {
        renderStudentsTable();
    } else if (sectionId === 'activities-section') {
        renderActivitiesTable();
    } else if (sectionId === 'compare-section') {
        renderCompareCheckboxes();
    } else if (sectionId === 'history-section') {
        fetchComparisonHistory();
    }
}

// ==============================================================================
// SECTION 1: DYNAMIC SETUP (FIRST SCREEN - REQUIREMENT 5 & 6)
// ==============================================================================

let dynamicCardCounter = 0;

function initDynamicSetup() {
    const countInput = document.getElementById('student-count-input');
    const btnInc = document.getElementById('btn-count-inc');
    const btnDec = document.getElementById('btn-count-dec');
    const btnGenerate = document.getElementById('btn-generate-forms');
    const btnAddAnother = document.getElementById('btn-add-another-student');
    const btnSaveBulk = document.getElementById('btn-save-bulk-students');

    btnInc.addEventListener('click', () => {
        let val = parseInt(countInput.value) || 2;
        if (val < 10) countInput.value = val + 1;
    });

    btnDec.addEventListener('click', () => {
        let val = parseInt(countInput.value) || 2;
        if (val > 2) countInput.value = val - 1;
    });

    document.querySelectorAll('.preset-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const count = parseInt(pill.getAttribute('data-count'));
            countInput.value = count;
            generateDynamicForms(count);
        });
    });

    btnGenerate.addEventListener('click', () => {
        const count = parseInt(countInput.value) || 2;
        generateDynamicForms(count);
    });

    btnAddAnother.addEventListener('click', () => {
        dynamicCardCounter++;
        appendDynamicFormCard(dynamicCardCounter);
    });

    btnSaveBulk.addEventListener('click', handleSaveBulkStudents);
}

function generateDynamicForms(count) {
    const grid = document.getElementById('dynamic-forms-grid');
    const wrapper = document.getElementById('dynamic-forms-wrapper');
    grid.innerHTML = '';
    dynamicCardCounter = 0;

    const defaultNames = ["Trisha Sharma", "Rahul Verma", "Priya Nair", "Amit Patel", "Sneha Roy", "Vikram Das"];
    const defaultRolls = ["201", "202", "203", "204", "205", "206"];
    const defaultBranches = ["Computer Science", "Information Technology", "AI & Data Science", "Electronics", "Computer Science", "Mechanical"];
    const defaultSeqSamples = [
        ["Python", "DSA", "Hackathon", "Java", "Seminar"],
        ["Python", "Java", "DSA", "Hackathon", "Sports"],
        ["Python", "DSA", "Hackathon", "Web Dev", "Certification"],
        ["Python", "DSA", "Hackathon", "Robotics", "Workshop"]
    ];

    for (let i = 0; i < count; i++) {
        dynamicCardCounter++;
        const sampleName = defaultNames[i % defaultNames.length];
        const sampleRoll = defaultRolls[i % defaultRolls.length];
        const sampleBranch = defaultBranches[i % defaultBranches.length];
        const sampleActs = defaultSeqSamples[i % defaultSeqSamples.length] || ["Python", "DSA", "Hackathon"];

        appendDynamicFormCard(dynamicCardCounter, sampleName, sampleRoll, sampleBranch, sampleActs);
    }

    wrapper.style.display = 'block';
    wrapper.scrollIntoView({ behavior: 'smooth' });
}

function appendDynamicFormCard(num, defName = '', defRoll = '', defBranch = 'Computer Science & Engineering', defActs = []) {
    const grid = document.getElementById('dynamic-forms-grid');

    const card = document.createElement('div');
    card.className = 'student-form-card';
    card.id = `dyn-card-${num}`;

    card.innerHTML = `
        <div class="student-card-header">
            <span class="student-num-badge"><i class="fa-solid fa-user-graduate"></i> Student #${num}</span>
            <button type="button" class="btn-remove-dynamic-card" onclick="removeDynamicCard(${num})" title="Remove Student">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
        <div class="form-group">
            <label>Name: *</label>
            <input type="text" class="dyn-input-name" placeholder="e.g. Student Full Name" value="${escapeHtml(defName)}" required>
        </div>
        <div class="form-row">
            <div class="form-group col-half">
                <label>Roll Number: *</label>
                <input type="text" class="dyn-input-roll" placeholder="e.g. 201" value="${escapeHtml(defRoll)}" required>
            </div>
            <div class="form-group col-half">
                <label>Branch: *</label>
                <input type="text" class="dyn-input-branch" placeholder="e.g. CSE" value="${escapeHtml(defBranch)}" required>
            </div>
        </div>
        <div class="student-activities-input-wrap">
            <label style="font-size:0.75rem; font-weight:600; color:var(--text-muted);">
                Activity Sequence (Add in Order):
            </label>
            <div style="display:flex; gap:0.4rem; margin-top:0.3rem;">
                <input type="text" class="dyn-act-input" placeholder="Type activity & press Enter...">
                <button type="button" class="btn btn-secondary btn-sm" onclick="addActivityTagFromInput(${num})">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
            <div class="activities-tag-container" id="dyn-tags-${num}">
                ${defActs.map(act => `
                    <span class="activity-tag">
                        <span>${escapeHtml(act)}</span>
                        <i class="fa-solid fa-xmark" onclick="this.parentElement.remove()"></i>
                    </span>
                `).join('')}
            </div>
            <div style="margin-top:0.4rem; display:flex; gap:0.25rem; flex-wrap:wrap;">
                <span style="font-size:0.7rem; color:var(--text-dim);">Suggestions:</span>
                ${["Python", "DSA", "Hackathon", "Java", "Seminar", "Workshop", "Sports"].map(tag => `
                    <button type="button" class="btn-link" style="font-size:0.7rem;" onclick="addQuickTag(${num}, '${tag}')">+${tag}</button>
                `).join('')}
            </div>
        </div>
    `;

    grid.appendChild(card);

    // Setup Enter key listener on activity input
    const actInput = card.querySelector('.dyn-act-input');
    actInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addActivityTagFromInput(num);
        }
    });
}

function removeDynamicCard(num) {
    const card = document.getElementById(`dyn-card-${num}`);
    if (card) {
        card.remove();
        const remaining = document.querySelectorAll('.student-form-card');
        if (remaining.length === 0) {
            document.getElementById('dynamic-forms-wrapper').style.display = 'none';
        }
    }
}

function addActivityTagFromInput(num) {
    const card = document.getElementById(`dyn-card-${num}`);
    if (!card) return;
    const input = card.querySelector('.dyn-act-input');
    const val = input.value.trim();
    if (!val) return;
    addQuickTag(num, val);
    input.value = '';
    input.focus();
}

function addQuickTag(num, text) {
    const tagContainer = document.getElementById(`dyn-tags-${num}`);
    if (!tagContainer) return;
    const span = document.createElement('span');
    span.className = 'activity-tag';
    span.innerHTML = `
        <span>${escapeHtml(text)}</span>
        <i class="fa-solid fa-xmark" onclick="this.parentElement.remove()"></i>
    `;
    tagContainer.appendChild(span);
}

async function handleSaveBulkStudents() {
    const cards = document.querySelectorAll('.student-form-card');
    if (cards.length < 2) {
        showToast("Please provide at least 2 students to compare.", "error");
        return;
    }

    const payload = [];
    let hasError = false;

    cards.forEach(card => {
        const name = card.querySelector('.dyn-input-name').value.trim();
        const roll = card.querySelector('.dyn-input-roll').value.trim();
        const branch = card.querySelector('.dyn-input-branch').value.trim();
        
        const tags = Array.from(card.querySelectorAll('.activity-tag span')).map(s => s.textContent.trim());

        if (!name || !roll || !branch) {
            hasError = true;
            card.style.borderColor = 'var(--danger)';
        } else {
            card.style.borderColor = 'var(--border-color)';
        }

        const activities = tags.map((actName, idx) => ({
            activity_name: actName,
            category: detectCategory(actName),
            activity_date: new Date().toISOString().split('T')[0],
            verification_status: 'Verified',
            proof_reference: `AUTO-REF-${idx+1}`
        }));

        payload.push({
            name,
            roll_no: roll,
            branch,
            activities
        });
    });

    if (hasError) {
        showToast("Please fill in all required student details (Name, Roll No, Branch).", "error");
        return;
    }

    try {
        const res = await fetch('/api/students/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ students: payload })
        });
        const data = await res.json();

        if (!data.success) {
            showToast(data.error || "Failed to save students.", "error");
            return;
        }

        showToast(data.message || "Students saved successfully!", "success");
        await fetchStudents();
        await fetchActivities();
        await fetchDashboardData();

        // Automatically jump to Compare section and compare these students
        switchSection('compare-section');
        renderCompareCheckboxes();

        // Select the newly created students and trigger compare
        if (data.student_ids && data.student_ids.length >= 2) {
            document.querySelectorAll('.student-select-box').forEach(box => {
                const sId = parseInt(box.getAttribute('data-id'));
                if (data.student_ids.includes(sId)) {
                    box.classList.add('checked');
                } else {
                    box.classList.remove('checked');
                }
            });
            executeComparisonWithSelected();
        }

    } catch (err) {
        showToast("Network error while saving students: " + err.message, "error");
    }
}

function detectCategory(name) {
    const lower = name.toLowerCase();
    if (lower.includes('python') || lower.includes('java') || lower.includes('code') || lower.includes('cpp')) return 'Coding';
    if (lower.includes('dsa') || lower.includes('academic') || lower.includes('system')) return 'Academic';
    if (lower.includes('hackathon') || lower.includes('sih')) return 'Hackathon';
    if (lower.includes('seminar') || lower.includes('talk')) return 'Seminar';
    if (lower.includes('workshop') || lower.includes('bootcamp')) return 'Workshop';
    if (lower.includes('sport') || lower.includes('cricket') || lower.includes('football')) return 'Sports';
    if (lower.includes('certif') || lower.includes('course')) return 'Certification';
    if (lower.includes('project') || lower.includes('repo')) return 'Project';
    return 'Other';
}

// ==============================================================================
// SECTION 2: DASHBOARD CONTROLLER & CHARTS
// ==============================================================================

async function fetchDashboardData() {
    try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        if (!data.success) return;

        const s = data.stats;
        document.getElementById('stat-total-students').textContent = s.total_students;
        document.getElementById('stat-total-activities').textContent = s.total_activities;
        document.getElementById('stat-total-comparisons').textContent = s.total_comparisons;
        document.getElementById('stat-latest-lcs').textContent = s.latest_lcs_length;
        document.getElementById('stat-avg-match').textContent = s.average_match_pct + '%';

        renderDashboardCharts(data.charts);
    } catch (err) {
        console.error("Dashboard fetch error:", err);
    }
}

function renderDashboardCharts(charts) {
    if (!charts) return;

    // 1. Student Activity Graph (Bar Chart)
    const ctx1 = document.getElementById('chart-student-activities');
    if (ctx1) {
        const labels = charts.student_activities.map(d => d.name);
        const values = charts.student_activities.map(d => d.count);

        if (appState.charts.studentActivities) {
            appState.charts.studentActivities.destroy();
        }

        appState.charts.studentActivities = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Activities',
                    data: values,
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: '#3B82F6',
                    borderWidth: 1.5,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { ticks: { color: '#94A3B8' }, grid: { display: false } },
                    y: { 
                        beginAtZero: true, 
                        ticks: { color: '#94A3B8', stepSize: 1 }, 
                        grid: { color: '#27354E' } 
                    }
                }
            }
        });
    }

    // 2. Match Percentage Graph (Bar/Line Chart)
    const ctx2 = document.getElementById('chart-match-percentages');
    if (ctx2) {
        const labels = charts.match_percentages.map(d => d.name);
        const values = charts.match_percentages.map(d => d.match_pct);
        const bgColors = values.map(v => v >= 70 ? 'rgba(16, 185, 129, 0.7)' : (v >= 40 ? 'rgba(245, 158, 11, 0.7)' : 'rgba(239, 68, 68, 0.7)'));
        const borderColors = values.map(v => v >= 70 ? '#10B981' : (v >= 40 ? '#F59E0B' : '#EF4444'));

        if (appState.charts.matchPercentages) {
            appState.charts.matchPercentages.destroy();
        }

        appState.charts.matchPercentages = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Match %',
                    data: values,
                    backgroundColor: bgColors,
                    borderColor: borderColors,
                    borderWidth: 1.5,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Match: ${context.parsed.y}%`
                        }
                    }
                },
                scales: {
                    x: { ticks: { color: '#94A3B8' }, grid: { display: false } },
                    y: { 
                        beginAtZero: true, 
                        max: 100,
                        ticks: { 
                            color: '#94A3B8',
                            callback: (v) => v + '%'
                        }, 
                        grid: { color: '#27354E' } 
                    }
                }
            }
        });
    }

    // 3. Activity Category Graph (Doughnut Chart)
    const ctx3 = document.getElementById('chart-categories');
    if (ctx3) {
        const labels = charts.categories.map(d => d.category);
        const values = charts.categories.map(d => d.count);
        const palette = [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
            '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6', '#F97316'
        ];

        if (appState.charts.categories) {
            appState.charts.categories.destroy();
        }

        appState.charts.categories = new Chart(ctx3, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: palette.slice(0, labels.length),
                    borderColor: '#111827',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: '#94A3B8', boxWidth: 12 }
                    }
                }
            }
        });
    }

    // 4. Individual Student Performance (Grouped Bar Chart)
    const ctx4 = document.getElementById('chart-student-performance');
    if (ctx4) {
        const labels = charts.student_performance.map(d => d.name);
        const totalData = charts.student_performance.map(d => d.total);
        const commonData = charts.student_performance.map(d => d.common);
        const missingData = charts.student_performance.map(d => d.missing);

        if (appState.charts.studentPerformance) {
            appState.charts.studentPerformance.destroy();
        }

        appState.charts.studentPerformance = new Chart(ctx4, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Total',
                        data: totalData,
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: '#3B82F6',
                        borderWidth: 1,
                        borderRadius: 4
                    },
                    {
                        label: 'Common (LCS)',
                        data: commonData,
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        borderColor: '#10B981',
                        borderWidth: 1,
                        borderRadius: 4
                    },
                    {
                        label: 'Missing',
                        data: missingData,
                        backgroundColor: 'rgba(239, 68, 68, 0.7)',
                        borderColor: '#EF4444',
                        borderWidth: 1,
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: '#94A3B8', boxWidth: 12 }
                    }
                },
                scales: {
                    x: { ticks: { color: '#94A3B8' }, grid: { display: false } },
                    y: { 
                        beginAtZero: true, 
                        ticks: { color: '#94A3B8', stepSize: 1 }, 
                        grid: { color: '#27354E' } 
                    }
                }
            }
        });
    }
}

// ==============================================================================
// SECTION 3: STUDENTS MANAGEMENT (CRUD & SEARCH - REQ 6 & 7)
// ==============================================================================

function initStudentsSection() {
    const searchInput = document.getElementById('student-search-input');
    const clearBtn = document.getElementById('btn-clear-student-search');
    const openAddBtn = document.getElementById('btn-open-add-student-modal');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        clearBtn.style.display = query ? 'block' : 'none';
        renderStudentsTable(query);
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        renderStudentsTable();
    });

    openAddBtn.addEventListener('click', () => {
        openStudentModal();
    });

    document.getElementById('btn-refresh-dashboard').addEventListener('click', () => {
        fetchDashboardData();
        showToast("Dashboard refreshed.", "info");
    });
}

async function fetchStudents() {
    try {
        const res = await fetch('/api/students');
        const data = await res.json();
        if (data.success) {
            appState.students = data.students || [];
            renderStudentsTable();
            populateStudentSelects();
            renderCompareCheckboxes();
            renderQuickChips();
        }
    } catch (err) {
        console.error("Failed to fetch students:", err);
    }
}

function renderStudentsTable(query = '') {
    const tbody = document.getElementById('students-table-body');
    const countBadge = document.getElementById('students-count-badge');
    if (!tbody) return;

    let filtered = appState.students;
    if (query) {
        filtered = filtered.filter(s => 
            s.name.toLowerCase().includes(query) || 
            s.roll_no.toLowerCase().includes(query) ||
            s.branch.toLowerCase().includes(query)
        );
    }

    countBadge.textContent = `${filtered.length} Student${filtered.length === 1 ? '' : 's'} Found`;

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center" style="padding: 2rem; color: var(--text-dim);">
                    <i class="fa-solid fa-user-slash" style="font-size: 1.8rem; margin-bottom: 0.5rem; display: block;"></i>
                    No students match your criteria. Click "Add Student" to create one.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(s => {
        const matchPct = s.latest_match_pct || 0.0;
        const matchClass = matchPct >= 70 ? 'badge-success' : (matchPct >= 40 ? 'badge-warning' : 'badge-danger');

        return `
            <tr>
                <td><strong>${escapeHtml(s.name)}</strong></td>
                <td><span class="badge badge-info">${escapeHtml(s.roll_no)}</span></td>
                <td>${escapeHtml(s.branch)}</td>
                <td><span class="badge badge-primary">${s.total_activities} activities</span></td>
                <td><span class="badge ${matchClass}">${matchPct.toFixed(2)}%</span></td>
                <td class="text-right">
                    <div class="table-actions">
                        <button type="button" class="btn btn-secondary btn-sm" onclick="viewStudentActivities(${s.id})" title="View Activities">
                            <i class="fa-solid fa-list"></i> View
                        </button>
                        <button type="button" class="btn btn-secondary btn-sm" onclick="editStudent(${s.id})" title="Edit Student">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button type="button" class="btn btn-secondary btn-sm" onclick="openStudentReportTab(${s.id})" title="View Report">
                            <i class="fa-solid fa-file-invoice"></i>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm" onclick="confirmDeleteStudent(${s.id}, '${escapeHtml(s.name)}')" title="Delete Student">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function viewStudentActivities(studentId) {
    const studentSelect = document.getElementById('filter-activity-student');
    if (studentSelect) {
        studentSelect.value = studentId;
    }
    switchSection('activities-section');
    renderActivitiesTable();
}

function openStudentReportTab(studentId) {
    const student = appState.students.find(s => s.id === studentId);
    if (student) {
        document.getElementById('report-search-query').value = student.name;
        loadStudentReport(student.id);
        switchSection('reports-section');
    }
}

// ==============================================================================
// SECTION 4: ACTIVITIES MANAGEMENT (CRUD & FILTERS - REQ 8 & 9)
// ==============================================================================

function initActivitiesSection() {
    const studentFilter = document.getElementById('filter-activity-student');
    const categoryFilter = document.getElementById('filter-activity-category');
    const searchFilter = document.getElementById('filter-activity-search');
    const resetBtn = document.getElementById('btn-reset-activity-filters');
    const openAddBtn = document.getElementById('btn-open-add-activity-modal');

    studentFilter.addEventListener('change', () => renderActivitiesTable());
    categoryFilter.addEventListener('change', () => renderActivitiesTable());
    searchFilter.addEventListener('input', () => renderActivitiesTable());

    resetBtn.addEventListener('click', () => {
        studentFilter.value = '';
        categoryFilter.value = 'All';
        searchFilter.value = '';
        renderActivitiesTable();
    });

    openAddBtn.addEventListener('click', () => {
        openActivityModal();
    });
}

async function fetchActivities() {
    try {
        const res = await fetch('/api/activities');
        const data = await res.json();
        if (data.success) {
            appState.activities = data.activities || [];
            renderActivitiesTable();
        }
    } catch (err) {
        console.error("Failed to fetch activities:", err);
    }
}

function renderActivitiesTable() {
    const tbody = document.getElementById('activities-table-body');
    if (!tbody) return;

    const studentId = document.getElementById('filter-activity-student').value;
    const category = document.getElementById('filter-activity-category').value;
    const search = document.getElementById('filter-activity-search').value.trim().toLowerCase();

    let filtered = appState.activities;

    if (studentId) {
        filtered = filtered.filter(a => a.student_id == studentId);
    }
    if (category && category !== 'All') {
        filtered = filtered.filter(a => a.category === category);
    }
    if (search) {
        filtered = filtered.filter(a => 
            a.activity_name.toLowerCase().includes(search) || 
            a.student_name.toLowerCase().includes(search) ||
            a.roll_no.toLowerCase().includes(search)
        );
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center" style="padding: 2rem; color: var(--text-dim);">
                    <i class="fa-solid fa-list-check" style="font-size: 1.8rem; margin-bottom: 0.5rem; display: block;"></i>
                    No activities found. Click "Add Activity" to record a new one.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map((a, idx) => {
        const statusClass = a.verification_status === 'Verified' ? 'badge-success' : (a.verification_status === 'Pending' ? 'badge-warning' : 'badge-danger');
        return `
            <tr>
                <td>${idx + 1}</td>
                <td><strong>${escapeHtml(a.student_name)}</strong></td>
                <td><span class="badge badge-info">${escapeHtml(a.roll_no)}</span></td>
                <td><strong>${escapeHtml(a.activity_name)}</strong></td>
                <td><span class="badge badge-primary">${escapeHtml(a.category)}</span></td>
                <td>${escapeHtml(a.activity_date)}</td>
                <td><span class="badge ${statusClass}">${escapeHtml(a.verification_status)}</span></td>
                <td><code>${escapeHtml(a.proof_reference || 'N/A')}</code></td>
                <td class="text-right">
                    <div class="table-actions">
                        <button type="button" class="btn btn-secondary btn-sm" onclick="editActivity(${a.id})" title="Edit Activity">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm" onclick="confirmDeleteActivity(${a.id}, '${escapeHtml(a.activity_name)}')" title="Delete Activity">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ==============================================================================
// SECTION 5: MULTI-STUDENT COMPARE & LCS STUDIO (REQ 11, 12, 13, 14)
// ==============================================================================

function initCompareSection() {
    const btnSelectAll = document.getElementById('btn-select-all-students');
    const btnDeselectAll = document.getElementById('btn-deselect-all-students');
    const btnRunCompare = document.getElementById('btn-run-comparison');

    btnSelectAll.addEventListener('click', () => {
        document.querySelectorAll('.student-select-box').forEach(b => b.classList.add('checked'));
    });

    btnDeselectAll.addEventListener('click', () => {
        document.querySelectorAll('.student-select-box').forEach(b => b.classList.remove('checked'));
    });

    btnRunCompare.addEventListener('click', executeComparisonWithSelected);
}

function renderCompareCheckboxes() {
    const container = document.getElementById('compare-student-checkboxes');
    if (!container) return;

    if (appState.students.length === 0) {
        container.innerHTML = `<p style="color:var(--text-dim);">No students available to compare.</p>`;
        return;
    }

    container.innerHTML = appState.students.map((s, idx) => `
        <div class="student-select-box ${idx < 3 ? 'checked' : ''}" data-id="${s.id}" onclick="toggleCompareCheckbox(this)">
            <div class="custom-checkbox"><i class="fa-solid fa-check"></i></div>
            <div class="select-box-info">
                <div class="select-name">${escapeHtml(s.name)}</div>
                <div class="select-meta">Roll: ${escapeHtml(s.roll_no)} | Acts: ${s.total_activities}</div>
            </div>
        </div>
    `).join('');
}

function toggleCompareCheckbox(elem) {
    elem.classList.toggle('checked');
}

async function executeComparisonWithSelected() {
    const selectedBoxes = document.querySelectorAll('.student-select-box.checked');
    const studentIds = Array.from(selectedBoxes).map(b => parseInt(b.getAttribute('data-id')));

    if (studentIds.length < 2) {
        showToast("Please select at least 2 students to compare.", "error");
        return;
    }

    try {
        const res = await fetch('/api/compare', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_ids: studentIds })
        });
        const data = await res.json();

        if (!data.success) {
            showToast(data.error || "Comparison failed.", "error");
            return;
        }

        appState.currentComparison = data.data;
        renderComparisonResults(data.data);
        showToast(`Comparison complete! Found ${data.data.lcs_length} common activities.`, "success");

        // Refresh comparisons & dashboard in background
        fetchDashboardData();
        fetchComparisonHistory();
        fetchStudents();

    } catch (err) {
        showToast("Error running comparison: " + err.message, "error");
    }
}

function renderComparisonResults(comp) {
    const panel = document.getElementById('comparison-results-panel');
    panel.style.display = 'block';

    document.getElementById('comp-result-id').textContent = comp.comparison_id;
    document.getElementById('comp-result-date').textContent = comp.comparison_date;
    document.getElementById('comp-result-length').textContent = comp.lcs_length;

    // Update download buttons with comparison ID
    document.getElementById('comp-download-excel-btn').href = `/api/export/excel?comparison_id=${comp.comparison_id}`;
    document.getElementById('comp-download-pdf-btn').href = `/api/export/pdf?comparison_id=${comp.comparison_id}`;
    document.getElementById('hdr-excel-btn').href = `/api/export/excel?comparison_id=${comp.comparison_id}`;
    document.getElementById('hdr-pdf-btn').href = `/api/export/pdf?comparison_id=${comp.comparison_id}`;

    // Render LCS Sequence Flow
    const flowContainer = document.getElementById('lcs-sequence-flow');
    if (!comp.lcs_sequence || comp.lcs_sequence.length === 0) {
        flowContainer.innerHTML = `<span style="color:var(--text-dim);">No common ordered subsequence discovered among selected students.</span>`;
    } else {
        flowContainer.innerHTML = comp.lcs_sequence.map((act, idx) => `
            <span class="lcs-flow-pill">
                <i class="fa-solid fa-code"></i> ${escapeHtml(act)}
            </span>
            ${idx < comp.lcs_sequence.length - 1 ? '<i class="fa-solid fa-arrow-right lcs-arrow"></i>' : ''}
        `).join('');
    }

    // Render Per-Student Comparison Grid (Requirement 12, 13, 14)
    const grid = document.getElementById('students-comparison-grid');
    grid.innerHTML = comp.students.map(s => {
        const matchPct = s.match_percentage;
        const matchColor = matchPct >= 70 ? 'text-emerald' : (matchPct >= 40 ? 'text-warning' : 'text-rose');

        return `
            <div class="comp-student-card">
                <div>
                    <div class="comp-card-top">
                        <div>
                            <div class="comp-student-name">${escapeHtml(s.name)}</div>
                            <div class="comp-student-roll">Roll: ${escapeHtml(s.roll_no)} | ${escapeHtml(s.branch)}</div>
                        </div>
                        <div class="comp-match-gauge">
                            <div class="gauge-pct ${matchColor}">${matchPct.toFixed(2)}%</div>
                            <div class="gauge-label">Match %</div>
                        </div>
                    </div>

                    <div class="comp-card-stats">
                        <div class="c-stat-item">
                            <div class="cs-val">${s.total_activities}</div>
                            <div class="cs-lbl">Total</div>
                        </div>
                        <div class="c-stat-item">
                            <div class="cs-val text-emerald">${s.common_count}</div>
                            <div class="cs-lbl">Common</div>
                        </div>
                        <div class="c-stat-item">
                            <div class="cs-val text-rose">${s.missing_count}</div>
                            <div class="cs-lbl">Missing</div>
                        </div>
                    </div>
                </div>

                <div class="comp-missing-section">
                    <div class="missing-title">
                        <i class="fa-solid fa-circle-exclamation"></i> Missing Activities (${s.missing_count}):
                    </div>
                    <div class="missing-tags-wrap">
                        ${s.missing_activities.length > 0 
                            ? s.missing_activities.map(m => `<span class="missing-tag">${escapeHtml(m)}</span>`).join('')
                            : '<span class="text-emerald" style="font-size:0.75rem;">None (All activities matched in LCS)</span>'
                        }
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Render Master Missing Activities Breakdown Table
    const missingTbody = document.getElementById('missing-activities-tbody');
    missingTbody.innerHTML = comp.students.map(s => {
        const missStr = s.missing_activities.length > 0 
            ? s.missing_activities.map(m => `<span class="badge badge-danger">${escapeHtml(m)}</span>`).join(' ')
            : '<span class="badge badge-success">None (100% in LCS)</span>';
        
        return `
            <tr>
                <td><strong>${escapeHtml(s.name)}</strong></td>
                <td><span class="badge badge-info">${escapeHtml(s.roll_no)}</span></td>
                <td>${s.total_activities}</td>
                <td><span class="badge badge-success">${s.common_count}</span></td>
                <td>${missStr}</td>
                <td><strong>${s.match_percentage.toFixed(2)}%</strong></td>
            </tr>
        `;
    }).join('');

    panel.scrollIntoView({ behavior: 'smooth' });
}

// ==============================================================================
// SECTION 6: INDIVIDUAL STUDENT REPORT (REQ 16)
// ==============================================================================

function initReportsSection() {
    const searchInput = document.getElementById('report-search-query');
    const searchBtn = document.getElementById('btn-search-student-report');

    searchBtn.addEventListener('click', () => {
        const q = searchInput.value.trim().toLowerCase();
        if (!q) {
            showToast("Please enter a student name or roll number.", "info");
            return;
        }

        const match = appState.students.find(s => 
            s.name.toLowerCase().includes(q) || 
            s.roll_no.toLowerCase() === q
        );

        if (match) {
            loadStudentReport(match.id);
        } else {
            showToast(`No student found matching "${q}".`, "error");
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchBtn.click();
        }
    });
}

function renderQuickChips() {
    const container = document.getElementById('quick-student-chips');
    if (!container) return;

    container.innerHTML = `<span>Quick Select:</span>` + appState.students.map(s => `
        <button type="button" class="student-chip" onclick="quickSelectStudentReport(${s.id}, '${escapeHtml(s.name)}')">
            ${escapeHtml(s.name)} (${escapeHtml(s.roll_no)})
        </button>
    `).join('');
}

function quickSelectStudentReport(id, name) {
    document.getElementById('report-search-query').value = name;
    loadStudentReport(id);
}

async function loadStudentReport(studentId) {
    try {
        const res = await fetch(`/api/student/${studentId}/report`);
        const data = await res.json();

        if (!data.success) {
            showToast(data.error || "Failed to load report.", "error");
            return;
        }

        const st = data.student;
        const comp = data.comparison_info;
        const hist = data.comparison_history;

        const card = document.getElementById('student-report-card');
        card.style.display = 'block';

        // Header info
        document.getElementById('rep-student-name').textContent = st.name;
        document.getElementById('rep-roll-no').textContent = st.roll_no;
        document.getElementById('rep-branch').textContent = st.branch;
        document.getElementById('rep-total-activities').textContent = st.total_activities;

        const matchPct = comp ? comp.match_percentage : (st.latest_match_pct || 0.0);
        document.getElementById('rep-match-pct').textContent = matchPct.toFixed(2) + '%';

        // Comparison Details (Section 16)
        if (comp) {
            document.getElementById('rep-compared-with').innerHTML = comp.compared_with.length > 0 
                ? comp.compared_with.map(name => `<span class="badge badge-info">${escapeHtml(name)}</span>`).join(' ')
                : 'Solo Run';

            const seqText = comp.common_activity_sequence && comp.common_activity_sequence.length > 0
                ? comp.common_activity_sequence.join(' ➔ ')
                : 'None';
            document.getElementById('rep-lcs-sequence').textContent = seqText;
            document.getElementById('rep-lcs-length').textContent = comp.lcs_length;
            document.getElementById('rep-common-count').textContent = comp.common_activities_count;

            const missText = comp.missing_activities && comp.missing_activities.length > 0
                ? comp.missing_activities.map(m => `<span class="badge badge-danger">${escapeHtml(m)}</span>`).join(' ')
                : '<span class="badge badge-success">None (All activities in LCS)</span>';
            document.getElementById('rep-missing-activities').innerHTML = missText;
        } else {
            document.getElementById('rep-compared-with').textContent = 'No comparison executed yet.';
            document.getElementById('rep-lcs-sequence').textContent = 'N/A';
            document.getElementById('rep-lcs-length').textContent = '0';
            document.getElementById('rep-common-count').textContent = '0';
            document.getElementById('rep-missing-activities').textContent = 'N/A';
        }

        // Activity History Table
        const actTbody = document.getElementById('rep-activities-tbody');
        actTbody.innerHTML = st.activities.map((a, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td><strong>${escapeHtml(a.activity_name)}</strong></td>
                <td><span class="badge badge-primary">${escapeHtml(a.category)}</span></td>
                <td>${escapeHtml(a.activity_date)}</td>
                <td><span class="badge ${a.verification_status === 'Verified' ? 'badge-success' : 'badge-warning'}">${escapeHtml(a.verification_status)}</span></td>
                <td><code>${escapeHtml(a.proof_reference || 'N/A')}</code></td>
            </tr>
        `).join('');

        // Comparison History Table
        const histTbody = document.getElementById('rep-history-tbody');
        if (!hist || hist.length === 0) {
            histTbody.innerHTML = `<tr><td colspan="6" class="text-center" style="color:var(--text-dim);">No previous comparisons.</td></tr>`;
        } else {
            histTbody.innerHTML = hist.map(h => `
                <tr>
                    <td>#${h.comparison_id}</td>
                    <td>${escapeHtml(h.comparison_date)}</td>
                    <td><span class="badge badge-info">${h.lcs_length}</span></td>
                    <td><span class="badge badge-success">${h.common_activities_count}</span></td>
                    <td>${escapeHtml(h.missing_activities_list || 'None')}</td>
                    <td><strong>${h.match_percentage.toFixed(2)}%</strong></td>
                </tr>
            `).join('');
        }

        card.scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        showToast("Error loading student report: " + err.message, "error");
    }
}

// ==============================================================================
// SECTION 7: COMPARISON HISTORY (REQ 22)
// ==============================================================================

function initHistorySection() {
    document.getElementById('btn-refresh-history').addEventListener('click', () => {
        fetchComparisonHistory();
        showToast("Comparison history refreshed.", "info");
    });
}

async function fetchComparisonHistory() {
    try {
        const res = await fetch('/api/comparisons');
        const data = await res.json();
        if (data.success) {
            appState.comparisons = data.comparisons || [];
            renderHistoryTable();
        }
    } catch (err) {
        console.error("Failed to fetch comparisons:", err);
    }
}

function renderHistoryTable() {
    const tbody = document.getElementById('history-table-body');
    if (!tbody) return;

    if (appState.comparisons.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center" style="padding: 2rem; color: var(--text-dim);">
                    <i class="fa-solid fa-clock-rotate-left" style="font-size: 1.8rem; margin-bottom: 0.5rem; display: block;"></i>
                    No comparisons run yet. Go to "Compare Studio" to compare students!
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = appState.comparisons.map(c => {
        const lcsDisplay = Array.isArray(c.lcs_sequence) ? c.lcs_sequence.join(' ➔ ') : 'None';
        return `
            <tr>
                <td><strong>#${c.id}</strong></td>
                <td>${escapeHtml(c.comparison_date)}</td>
                <td><span class="badge badge-primary">${c.student_count || (c.student_ids ? c.student_ids.length : 0)} Students</span></td>
                <td><div style="max-width:320px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(lcsDisplay)}</div></td>
                <td><span class="badge badge-success font-bold">${c.lcs_length}</span></td>
                <td class="text-right">
                    <div class="table-actions">
                        <button type="button" class="btn btn-secondary btn-sm" onclick="loadHistoricalComparison(${c.id})" title="Inspect in Studio">
                            <i class="fa-solid fa-eye"></i> View
                        </button>
                        <a href="/api/export/excel?comparison_id=${c.id}" class="btn btn-outline-excel btn-sm" title="Download Excel">
                            <i class="fa-solid fa-file-excel"></i>
                        </a>
                        <a href="/api/export/pdf?comparison_id=${c.id}" class="btn btn-outline-pdf btn-sm" title="Download PDF">
                            <i class="fa-solid fa-file-pdf"></i>
                        </a>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

async function loadHistoricalComparison(comp_id) {
    try {
        const res = await fetch(`/api/comparisons/${comp_id}`);
        const data = await res.json();
        if (data.success) {
            switchSection('compare-section');
            renderComparisonResults({
                comparison_id: data.comparison.id,
                comparison_date: data.comparison.comparison_date,
                lcs_sequence: data.comparison.lcs_sequence,
                lcs_length: data.comparison.lcs_length,
                students: data.students.map(s => ({
                    student_id: s.student_id,
                    name: s.student_name,
                    roll_no: s.roll_no,
                    branch: s.branch,
                    total_activities: s.total_activities,
                    common_count: s.common_activities_count,
                    missing_count: s.missing_activities.length,
                    missing_activities: s.missing_activities,
                    match_percentage: s.match_percentage
                }))
            });
        }
    } catch (err) {
        showToast("Failed to load historical comparison: " + err.message, "error");
    }
}

// ==============================================================================
// MODALS LOGIC (ADD / EDIT STUDENT & ACTIVITY)
// ==============================================================================

function initModals() {
    // Student Modal
    const studentModal = document.getElementById('student-modal');
    const closeStudentBtn = document.getElementById('btn-close-student-modal');
    const cancelStudentBtn = document.getElementById('btn-cancel-student-modal');
    const studentForm = document.getElementById('student-form');

    const closeStudentModal = () => studentModal.classList.remove('active');
    closeStudentBtn.addEventListener('click', closeStudentModal);
    cancelStudentBtn.addEventListener('click', closeStudentModal);
    studentModal.addEventListener('click', (e) => {
        if (e.target === studentModal) closeStudentModal();
    });

    studentForm.addEventListener('submit', handleStudentFormSubmit);

    // Activity Modal
    const activityModal = document.getElementById('activity-modal');
    const closeActivityBtn = document.getElementById('btn-close-activity-modal');
    const cancelActivityBtn = document.getElementById('btn-cancel-activity-modal');
    const activityForm = document.getElementById('activity-form');
    const categorySelect = document.getElementById('activity-form-category');
    const customCatGroup = document.getElementById('custom-category-group');

    const closeActivityModal = () => activityModal.classList.remove('active');
    closeActivityBtn.addEventListener('click', closeActivityModal);
    cancelActivityBtn.addEventListener('click', closeActivityModal);
    activityModal.addEventListener('click', (e) => {
        if (e.target === activityModal) closeActivityModal();
    });

    categorySelect.addEventListener('change', () => {
        if (categorySelect.value === 'Custom') {
            customCatGroup.style.display = 'block';
            document.getElementById('activity-form-custom-category').required = true;
        } else {
            customCatGroup.style.display = 'none';
            document.getElementById('activity-form-custom-category').required = false;
        }
    });

    activityForm.addEventListener('submit', handleActivityFormSubmit);
}

function openStudentModal(student = null) {
    const modal = document.getElementById('student-modal');
    const title = document.getElementById('student-modal-title');
    const idInput = document.getElementById('student-form-id');
    const nameInput = document.getElementById('student-form-name');
    const rollInput = document.getElementById('student-form-roll');
    const branchInput = document.getElementById('student-form-branch');

    if (student) {
        title.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Student`;
        idInput.value = student.id;
        nameInput.value = student.name;
        rollInput.value = student.roll_no;
        branchInput.value = student.branch;
    } else {
        title.innerHTML = `<i class="fa-solid fa-user-plus"></i> Add Student`;
        idInput.value = '';
        nameInput.value = '';
        rollInput.value = '';
        branchInput.value = '';
    }

    modal.classList.add('active');
    nameInput.focus();
}

async function handleStudentFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('student-form-id').value;
    const name = document.getElementById('student-form-name').value.trim();
    const roll_no = document.getElementById('student-form-roll').value.trim();
    const branch = document.getElementById('student-form-branch').value.trim();

    if (!name || !roll_no || !branch) {
        showToast("Please fill in all required fields.", "error");
        return;
    }

    const isEdit = !!id;
    const url = isEdit ? `/api/students/${id}` : '/api/students';
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, roll_no, branch })
        });
        const data = await res.json();

        if (!data.success) {
            showToast(data.error || "Operation failed.", "error");
            return;
        }

        showToast(data.message || (isEdit ? "Student updated!" : "Student added!"), "success");
        document.getElementById('student-modal').classList.remove('active');

        await fetchStudents();
        fetchDashboardData();
    } catch (err) {
        showToast("Network error: " + err.message, "error");
    }
}

function editStudent(id) {
    const student = appState.students.find(s => s.id === id);
    if (student) openStudentModal(student);
}

function confirmDeleteStudent(id, name) {
    if (confirm(`Are you sure you want to delete student "${name}"? This will also remove their activities.`)) {
        deleteStudent(id);
    }
}

async function deleteStudent(id) {
    try {
        const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
            showToast(data.message || "Student deleted.", "success");
            await fetchStudents();
            await fetchActivities();
            fetchDashboardData();
        } else {
            showToast(data.error || "Failed to delete student.", "error");
        }
    } catch (err) {
        showToast("Error deleting student: " + err.message, "error");
    }
}

// Activity Modal
function populateStudentSelects() {
    const selects = [
        document.getElementById('filter-activity-student'),
        document.getElementById('activity-form-student')
    ];

    selects.forEach((sel, i) => {
        if (!sel) return;
        const currentVal = sel.value;
        const firstOpt = i === 0 ? '<option value="">All Students</option>' : '<option value="" disabled selected>Choose a student...</option>';
        sel.innerHTML = firstOpt + appState.students.map(s => `
            <option value="${s.id}">${escapeHtml(s.name)} (${escapeHtml(s.roll_no)})</option>
        `).join('');
        if (currentVal) sel.value = currentVal;
    });
}

function openActivityModal(activity = null) {
    const modal = document.getElementById('activity-modal');
    const title = document.getElementById('activity-modal-title');
    const idInput = document.getElementById('activity-form-id');
    const studentSelect = document.getElementById('activity-form-student');
    const nameInput = document.getElementById('activity-form-name');
    const catSelect = document.getElementById('activity-form-category');
    const customCatInput = document.getElementById('activity-form-custom-category');
    const customGroup = document.getElementById('custom-category-group');
    const dateInput = document.getElementById('activity-form-date');
    const statusSelect = document.getElementById('activity-form-status');
    const proofInput = document.getElementById('activity-form-proof');

    populateStudentSelects();

    if (activity) {
        title.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Activity`;
        idInput.value = activity.id;
        studentSelect.value = activity.student_id;
        studentSelect.disabled = true;
        nameInput.value = activity.activity_name;
        
        // Category check
        const standardCats = ["Academic", "Coding", "Hackathon", "Competition", "Workshop", "Seminar", "Sports", "Club", "Certification", "Project"];
        if (standardCats.includes(activity.category)) {
            catSelect.value = activity.category;
            customGroup.style.display = 'none';
        } else {
            catSelect.value = 'Custom';
            customCatInput.value = activity.category;
            customGroup.style.display = 'block';
        }

        dateInput.value = activity.activity_date;
        statusSelect.value = activity.verification_status;
        proofInput.value = activity.proof_reference || '';
    } else {
        title.innerHTML = `<i class="fa-solid fa-plus-circle"></i> Add Activity`;
        idInput.value = '';
        studentSelect.disabled = false;
        nameInput.value = '';
        catSelect.value = 'Coding';
        customGroup.style.display = 'none';
        customCatInput.value = '';
        dateInput.value = new Date().toISOString().split('T')[0];
        statusSelect.value = 'Verified';
        proofInput.value = '';
    }

    modal.classList.add('active');
    nameInput.focus();
}

async function handleActivityFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('activity-form-id').value;
    const student_id = document.getElementById('activity-form-student').value;
    const activity_name = document.getElementById('activity-form-name').value.trim();
    let category = document.getElementById('activity-form-category').value;
    if (category === 'Custom') {
        category = document.getElementById('activity-form-custom-category').value.trim() || 'Other';
    }
    const activity_date = document.getElementById('activity-form-date').value;
    const verification_status = document.getElementById('activity-form-status').value;
    const proof_reference = document.getElementById('activity-form-proof').value.trim();

    if (!activity_name) {
        showToast("Please enter an activity name.", "error");
        return;
    }

    const isEdit = !!id;
    const url = isEdit ? `/api/activities/${id}` : '/api/activities';
    const method = isEdit ? 'PUT' : 'POST';

    const payload = {
        activity_name,
        category,
        activity_date,
        verification_status,
        proof_reference
    };
    if (!isEdit) payload.student_id = student_id;

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (!data.success) {
            showToast(data.error || "Operation failed.", "error");
            return;
        }

        showToast(data.message || (isEdit ? "Activity updated!" : "Activity added!"), "success");
        document.getElementById('activity-modal').classList.remove('active');

        await fetchActivities();
        await fetchStudents();
        fetchDashboardData();
    } catch (err) {
        showToast("Network error: " + err.message, "error");
    }
}

function editActivity(id) {
    const activity = appState.activities.find(a => a.id === id);
    if (activity) openActivityModal(activity);
}

function confirmDeleteActivity(id, name) {
    if (confirm(`Are you sure you want to delete activity "${name}"?`)) {
        deleteActivity(id);
    }
}

async function deleteActivity(id) {
    try {
        const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
            showToast(data.message || "Activity deleted.", "success");
            await fetchActivities();
            await fetchStudents();
            fetchDashboardData();
        } else {
            showToast(data.error || "Failed to delete activity.", "error");
        }
    } catch (err) {
        showToast("Error deleting activity: " + err.message, "error");
    }
}
