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
<img width="1406" height="553" alt="Screenshot 2026-10-03 003929" src="https://github.com/user-attachments/assets/a23d9712-82d5-4f27-aa15-a03dd59d58bf" />



### 👨‍🎓 Student Management
Add and store student details such as Name, Roll Number, and Branch.
Search students easily using their name or roll number.
Edit or delete student information whenever required.
View each student's total activities and latest Match Percentage.
## Screenshot for Student Management
<img width="1513" height="533" alt="Screenshot 2026-10-03 004551" src="https://github.com/user-attachments/assets/88aca38b-4080-429d-8bdd-e48b1dc912f9" />


### 📝 Activity Management
Add activities with details such as Activity Name, Category, Date, and Verification Status.
Students can have multiple activities recorded in the system.
Activities can be searched, edited, deleted, and filtered.
The system maintains the student's complete activity history.
## Screenshot for Activity Management
<img width="1483" height="518" alt="Screenshot 2026-10-03 005041" src="https://github.com/user-attachments/assets/664ecd2f-a7cd-467c-af59-b8af459f2d75" />


### 🔗 LCS Comparison
Select two or more students for activity comparison.
The system applies the Longest Common Subsequence (LCS) algorithm.
It finds the longest common sequence of activities while maintaining their order.
It also identifies the missing activities for each student.
## Screenshot for LCS Comparison
<img width="603" height="558" alt="Screenshot 2026-10-03 005620" src="https://github.com/user-attachments/assets/c75dfea2-ced2-4a37-947d-1a220afc2c66" />


### 📈 Dashboard
Displays important statistics such as total students and total activities.
Shows Match Percentage for students.
Provides charts for student activities and activity categories.
Gives a quick visual overview of the overall system.

## Screenshot for Dashboard
<img width="597" height="496" alt="Screenshot 2026-10-03 005946" src="https://github.com/user-attachments/assets/63683e1c-ec86-4ab1-99cc-7033cba76709" />

### 📄 Reports
Generates detailed student activity reports.
Includes LCS comparison and missing activity details.
Reports can be downloaded in PDF and Excel formats.
Excel contains activity-wise details, Match %, and comparison information.

## Screenshot for Reports
<img width="591" height="623" alt="Screenshot 2026-10-03 010246" src="https://github.com/user-attachments/assets/daabd22f-0447-4978-b0da-595ac03df43c" />

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
## Local Host URL: http://127.0.0.1:5000

## 🚀 Future Scope

- AI-based activity recommendations
- Cloud database integration
- Mobile application
- Advanced analytics

## ✅ Conclusion

The project demonstrates the use of the Longest Common Subsequence algorithm with Dynamic Programming to compare student activities.
