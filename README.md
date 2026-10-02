# Student Activity Comparison Using LCS
## 📌 Project Overview

Student Activity Comparison Using LCS is a web-based system designed to compare the activity sequences of multiple students using the Longest Common Subsequence (LCS) algorithm.

- The system stores student details and their activities.
- Students can add, edit, delete, and search activities.
- Multiple students can be selected for comparison.
- The system finds the longest common sequence of activities.
- It identifies common and missing activities for each student.
- It calculates the Match Percentage for every student.
- Results can be viewed through dashboards, charts, PDF reports, and Excel reports.
- The system uses Dynamic Programming to efficiently solve the LCS problem.

## ❓ Problem Statement

# Longest Common Student Activity:
Two students maintain daily activity logs represented as sequences of activity codes. Find the longest sequence of activities that appears in both logs in the same order, even if some activities are missing from either log.

## 🎯 Objectives

- To manage student details in a structured way.
- To store and manage student activity records.
- To compare the activities of multiple students.
- To find the Longest Common Subsequence of activities.
- To apply Dynamic Programming for solving the LCS problem.
- To identify common activities among selected students.
- To identify missing activities for each student.
- To calculate the Match Percentage of each student.
- To display comparison results using charts and dashboards.
- To generate detailed PDF and Excel reports.

## 🧠 Algorithm Used

**Longest Common Subsequence (LCS)**

**Technique:** Dynamic Programming

- LCS is used to find the longest sequence common to multiple student activity sequences.
- The order of activities is preserved during comparison.
- Activities do not need to be continuous to be part of the common sequence.
- Dynamic Programming avoids repeatedly solving the same subproblems.
- The system compares the activities of the selected students.
- If the current activities match, they are included in the common sequence.
- If they do not match, different possibilities are considered to find the longest sequence.
- The final LCS represents the common activity pattern among the selected students.

## 📸 Website Screenshots

### 🏠 Home Page

The user enters how many students they want to compare.
The system dynamically displays forms to enter each student’s Name, Roll Number, and Branch.
It provides easy access to manage students and continue with activity comparison using LCS.
## Screenshot of HomePage
<img width="1516" height="642" alt="Screenshot 2026-10-03 001354" src="https://github.com/user-attachments/assets/463376e7-a44c-4aa6-931e-cd837286c442" />


### 👨‍🎓 Student Management

![Student Management](screenshots/students.png)

### 📝 Activity Management

![Activity Management](screenshots/activities.png)

### 🔗 LCS Comparison

![LCS Comparison](screenshots/comparison.png)

### 📊 Comparison Results

![Comparison Results](screenshots/comparison-result.png)

### 📈 Dashboard

![Dashboard](screenshots/dashboard.png)

### 📄 Reports

![Reports](screenshots/report.png)

## 📌 Project Overview

Student Activity Comparison Using LCS is a web-based system...

## 🎯 Objectives

- Manage student details
- Compare student activities
- Find the LCS

## 🧠 Algorithm Used

**Longest Common Subsequence (LCS)**

**Technique:** Dynamic Programming

## 📸 Website Screenshots

### 🏠 Home Page

![Home Page](screenshots/home.png)

### 👨‍🎓 Student Management

![Student Management](screenshots/students.png)

### 📝 Activity Management

![Activity Management](screenshots/activities.png)

### 🔗 LCS Comparison

![LCS Comparison](screenshots/comparison.png)

### 📊 Comparison Results

![Comparison Results](screenshots/comparison-result.png)

### 📈 Dashboard

![Dashboard](screenshots/dashboard.png)

### 📄 Reports

![Reports](screenshots/report.png)

## 🛠️ Technologies Used

- Python
- Flask
- SQLite
- HTML
- CSS
- JavaScript
- Chart.js
- OpenPyXL
- ReportLab

## 🚀 Future Scope

- AI-based activity recommendations
- Cloud database integration
- Mobile application
- Advanced analytics

## ✅ Conclusion

The project demonstrates the use of the Longest Common Subsequence algorithm with Dynamic Programming to compare student activities.
