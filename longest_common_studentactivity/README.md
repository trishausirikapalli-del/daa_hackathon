# LONGEST COMMON STUDENT ACTIVITY (DAA Hackathon Project)

> **A Student Activity Management and Comparison System based on the Longest Common Subsequence (LCS) Algorithm using Dynamic Programming.**

---

## 📌 Problem Statement

In academic and professional environments, students engage in diverse co-curricular, technical, and extracurricular activities over time. When evaluating cohorts, competitive programming teams, student clubs, or accreditation records, academic coordinators face difficulties in:
1. Comparing student journeys chronologically across heterogeneous activities.
2. Identifying common shared learning sequences across multiple students.
3. Discovering student-specific missing activities and domain coverage gaps.
4. Measuring affinity and alignment against cohort milestones mathematically.

**Longest Common Student Activity** solves this by modeling each student's activity log as an ordered sequence and applying the **Longest Common Subsequence (LCS) Dynamic Programming** algorithm across multiple students to identify common paths, missing activities, exact match percentages, and multi-sheet audit reports.

---

## 🚀 Project Overview

The system is built as a responsive, modern **Single Page Application (SPA)** with zero full-page refreshes. All CRUD operations (Students & Activities), Dynamic Multi-Student Comparison, Dashboard analytics, Chart.js visualizations, and Report generation (Excel & PDF) execute dynamically via asynchronous `fetch()` APIs talking to a lightweight **Flask + SQLite** backend.

---

## ✨ Features

- **Single Page Application (SPA)**: Everything lives on `http://127.0.0.1:5000/` without page reloads.
- **Interactive First Screen**: Dynamic student form generator asking *"How many students do you want to compare?"* with quick presets (2, 3, 4, 5) and instant tag inputs.
- **Student Management (CRUD)**: Add, edit, delete, and search students by name or roll number with real-time feedback.
- **Unlimited Student Activities**: Chronologically ordered activities with custom categories, verification statuses, and proof/reference IDs.
- **Dynamic Programming LCS Algorithm**: Finds the exact Longest Common Subsequence preserving chronological ordering across 2 or more students.
- **Missing Activities Discovery**: Automatically isolates activities absent from the common sequence for every student.
- **Exact Match Percentage Formula**: Strictly enforces `(Common Activities / Total Activities) × 100`.
- **Interactive Analytics Dashboard**: Live metrics and 4 Chart.js visualizations (Activity counts, Match percentages, Category distributions, and Grouped performance).
- **Individual Student Reports**: In-depth view featuring student activities, comparison details (with whom, LCS sequence, common count, missing activities, match %), and past comparison history.
- **Comprehensive Excel Reports (`openpyxl`)**: 8 dedicated sheets with bold headers, freeze panes, auto-filters, borders, and row-by-row repetitions of every activity.
- **Executive PDF Reports (`reportlab`)**: Styled document containing metadata banners, visual sequence arrows, performance tables, and complete activity logs with two-pass page numbering.
- **Comparison History Persistence**: Stored runs in SQLite (`activity.db`) with instant reload and export.

---

## 🛠 Technology Stack

- **Backend**: Python 3, Flask
- **Database**: SQLite 3 (`activity.db`) with Foreign Key cascades
- **Algorithm**: Dynamic Programming (Longest Common Subsequence - LCS)
- **Frontend**: HTML5, Vanilla CSS3 (Dark Mode, Glassmorphism, Responsive Grid), Vanilla JavaScript (ES6+ Fetch API)
- **Visualizations**: Chart.js 4
- **Excel Generation**: `openpyxl`
- **PDF Generation**: `reportlab`

---

## 🧠 LCS Algorithm & Dynamic Programming Explanation

### 1. Mathematical Formulation

Let sequence $A = \langle a_1, a_2, \dots, a_m \rangle$ and sequence $B = \langle b_1, b_2, \dots, b_n \rangle$ represent activities completed by two students in chronological order.

A sequence $Z = \langle z_1, z_2, \dots, z_k \rangle$ is a common subsequence if $Z$ is a subsequence of both $A$ and $B$.

The **Dynamic Programming table** $DP[i][j]$ defines the length of the LCS of prefixes $A[1 \dots i]$ and $B[1 \dots j]$:

$$
DP[i][j] = \begin{cases} 
0 & \text{if } i = 0 \text{ or } j = 0 \\
DP[i-1][j-1] + 1 & \text{if } a_i = b_j \\
\max(DP[i-1][j], DP[i][j-1]) & \text{if } a_i \neq b_j
\end{cases}
$$

### 2. Backtracking for Sequence Reconstruction

Starting at $DP[m][n]$:
- If $a_i = b_j$, append $a_i$ to LCS and step diagonally to $DP[i-1][j-1]$.
- Otherwise, step in the direction of $\max(DP[i-1][j], DP[i][j-1])$.
- Reverse the collected items to yield the chronological common sequence.

### 3. Multi-Student LCS ($K \ge 2$)

For comparing $K$ students $S_1, S_2, \dots, S_K$, the system applies progressive pairwise LCS:

$$LCS(S_1, S_2, \dots, S_K) = LCS(\dots(LCS(LCS(S_1, S_2), S_3), \dots), S_K)$$

This guarantees an optimal subsequence that appears in the exact relative order in every student's history.

---

## 🎯 Exact Match Percentage Formula

The system strictly adheres to the mandated formula across the UI, Dashboard, Reports, Excel, and PDF:

$$\text{Match \%} = \left(\frac{\text{Common Activities}}{\text{Total Activities of that student}}\right) \times 100$$

### Example:
- **Student A**: Total Activities = 10, Common Activities = 6
  $$\text{Match \%} = (6 / 10) \times 100 = 60.00\%$$
- **Student B**: Total Activities = 8, Common Activities = 6
  $$\text{Match \%} = (6 / 8) \times 100 = 75.00\%$$
- **Student C**: Total Activities = 12, Common Activities = 6
  $$\text{Match \%} = (6 / 12) \times 100 = 50.00\%$$

---

## 🗄 Database Structure (`activity.db`)

All tables are automatically created on startup with foreign key constraints enabled:

1. **`students`**:
   - `id` (INTEGER, PK)
   - `name` (TEXT)
   - `roll_no` (TEXT, UNIQUE)
   - `branch` (TEXT)
   - `created_at` (TIMESTAMP)

2. **`activities`**:
   - `id` (INTEGER, PK)
   - `student_id` (INTEGER, FK -> students.id)
   - `activity_name` (TEXT)
   - `category` (TEXT)
   - `activity_date` (TEXT)
   - `verification_status` (TEXT)
   - `proof_reference` (TEXT)
   - `order_index` (INTEGER)
   - `created_at` (TIMESTAMP)

3. **`comparisons`**:
   - `id` (INTEGER, PK)
   - `comparison_date` (TIMESTAMP)
   - `student_ids` (TEXT, JSON array)
   - `lcs_sequence` (TEXT, JSON array)
   - `lcs_length` (INTEGER)
   - `created_at` (TIMESTAMP)

4. **`comparison_students`**:
   - `id` (INTEGER, PK)
   - `comparison_id` (INTEGER, FK -> comparisons.id)
   - `student_id` (INTEGER)
   - `student_name` (TEXT)
   - `roll_no` (TEXT)
   - `total_activities` (INTEGER)
   - `common_activities_count` (INTEGER)
   - `missing_activities_list` (TEXT)
   - `match_percentage` (REAL)

5. **`comparison_results`**:
   - `id` (INTEGER, PK)
   - `comparison_id` (INTEGER, FK -> comparisons.id)
   - `student_id` (INTEGER, NULLable)
   - `common_activity` (TEXT)
   - `lcs_position` (INTEGER)

6. **`missing_activities`**:
   - `id` (INTEGER, PK)
   - `comparison_id` (INTEGER, FK -> comparisons.id)
   - `student_id` (INTEGER)
   - `student_name` (TEXT)
   - `roll_no` (TEXT)
   - `missing_activity` (TEXT)

7. **`comparison_activity_results`**:
   - `id` (INTEGER, PK)
   - `comparison_id` (INTEGER, FK -> comparisons.id)
   - `student_id` (INTEGER)
   - `activity_name` (TEXT)
   - `is_common` (INTEGER)
   - `activity_match_pct` (REAL)
   - `student_match_pct` (REAL)

---

## 📁 Project Structure

```
daa hackathon/
│
├── app.py                     # Complete Flask backend, DB init, DP LCS, & Exporters
├── activity.db                # SQLite database (auto-created on startup)
├── requirements.txt           # Python dependencies (Flask, openpyxl, reportlab)
├── README.md                  # Comprehensive project documentation
├── .gitignore                 # Git ignore rules
│
├── templates/
│   └── index.html             # The SINGLE visible HTML page
│
├── static/
│   ├── style.css              # Glassmorphic, responsive dark theme
│   └── dashboard.js           # SPA controller, AJAX CRUD, Chart.js, & LCS UI
│
└── reports/
    ├── pdf/                   # Generated PDF reports (.gitkeep)
    └── excel/                 # Generated Excel spreadsheets (.gitkeep)
```

---

## 📊 Excel Report Structure (8 Dedicated Sheets)

The Excel report generated via `openpyxl` includes 8 sheets formatted with headers, borders, filters, and freeze panes:

1. **`Student Details`**: `Name | Roll No | Branch | Total Activities | Common Activities | Missing Activities | Match %`
2. **`All Activities`**: Master log containing **EVERY activity of EVERY student** row-by-row. Columns: `Name | Roll No | Branch | Activity Name | Common Activities | Total Activities | Missing Activities | Match %`
3. **`Comparison`**: `Comparison ID | Date | Compared Students | LCS | LCS Length`
4. **`LCS Result`**: `Comparison ID | Student | Common Activity | LCS Position`
5. **`Missing Activities`**: Row-by-row missing activities per student: `Comparison ID | Student | Roll No | Missing Activity`
6. **`Student Summary`**: `Student | Roll No | Total Activities | Common Activities | Missing Activities | Match %`
7. **`Activity-wise Percentage`**: `Student | Activity | Common With Group | Activity Match % | Student Match %` (100% if part of LCS, 0% if missing)
8. **`Category Analysis`**: `Category | Total Activities | Common Activities | Percentage`

---

## 📄 PDF Report Structure (`reportlab`)

The PDF report generated via `reportlab` includes:
- **Document Header**: Title, Comparison ID, Date & Time, and Compared Student count.
- **Common Activity Sequence Banner**: Visual arrow flow highlighting the discovered LCS items.
- **Student Performance & Match % Summary Table**: Total Activities, Common Count, Missing Count, and exact Match %.
- **Missing Activities Breakdown**: Grouped cards identifying unique missing activities per student.
- **Master Activity Log**: All activities rendered with status and commonality badges.
- **Two-Pass Numbered Footer**: *"Page X of Y"* with official copyright and algorithm indicators.

---

## 💻 Installation & Setup

### Prerequisites
- Python 3.9 or higher

### Installation Steps

1. Clone or extract the project repository.
2. Open terminal in the project directory:
   ```bash
   cd "longest_common_studentactivity"
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

## 🚀 How to Run the Application

Start the Flask application:
```bash
python app.py
```

Open your browser at:
```
http://127.0.0.1:5000/
```

> **Note**: The application operates entirely on this single URL. All section transitions, forms, comparisons, and modal updates occur without any full-page reload!

---

## 📖 How to Use

1. **First Screen (Dynamic Setup)**:
   - Enter how many students you wish to compare (e.g., 2, 3, 4, 5).
   - Click **Generate Forms** to create dynamic student cards.
   - Enter student names, roll numbers, branches, and activity sequence tags.
   - Click **Save Students & Launch Comparison**.
2. **Dashboard**:
   - Inspect overall metrics (Total Students, Total Activities, Comparisons, Latest LCS, Average Match %).
   - View the 4 real-time interactive charts.
3. **Students Directory**:
   - Search by name or roll number.
   - Add new students, edit existing ones, or delete records.
4. **Activities**:
   - Filter activities by student, category, or search keywords.
   - Add new activities with custom categories and certificate proof IDs.
5. **Compare Studio**:
   - Check the boxes next to 2 or more students.
   - Click **COMPARE STUDENTS**.
   - Review the discovered LCS chain, individual student match gauges, and missing activities.
   - Click **Download Excel** or **Download PDF** to export.
6. **Individual Student Report**:
   - Enter a student's name or roll number.
   - View their profile, full activity log, compared partners, LCS alignment, and previous comparison history.
7. **History**:
   - Browse previous comparison runs and re-download generated files anytime.

---

## 🔮 Future Enhancements

- Integration with University ERP / LMS APIs (Moodle, Canvas) for automatic activity verification.
- Weighted LCS where certifiable hackathons carry higher match weights than generic seminars.
- Multi-dimensional LCS tracking both activity type and skill tags.
- Export to Google Sheets and JSON REST API integrations for mobile applications.

---

## 📦 GitHub Submission Commands

Run the following commands in the project directory to publish to GitHub:

```bash
git init
git add .
git commit -m "Initial commit - Longest Common Student Activity"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
