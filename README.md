<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tasksplit - Task Management System</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            min-height: 100vh;
            padding: 2rem;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            padding: 3rem 2rem;
            text-align: center;
            color: white;
        }

        .header h1 {
            font-size: 3rem;
            margin-bottom: 0.5rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .header .emoji {
            font-size: 3.5rem;
            margin-bottom: 1rem;
            display: inline-block;
            animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.95;
            line-height: 1.6;
        }

        .content {
            padding: 2.5rem;
        }

        .section {
            margin-bottom: 2.5rem;
        }

        .section-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.8rem;
            color: #ff6b35;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 3px solid #ffe8e0;
        }

        .team-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            overflow: hidden;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.2);
        }

        .team-table thead {
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            color: white;
        }

        .team-table th {
            padding: 1rem;
            text-align: left;
            font-weight: 600;
        }

        .team-table tbody tr {
            transition: all 0.3s ease;
        }

        .team-table tbody tr:nth-child(odd) {
            background-color: #2a2a2a;
        }

        .team-table tbody tr:nth-child(even) {
            background-color: #1f1f1f;
        }

        .team-table tbody tr:hover {
            background: linear-gradient(90deg, #ff6b35 0%, #f7931e 100%);
            transform: scale(1.01);
            box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .team-table td {
            padding: 1rem;
            border-bottom: 1px solid #3a3a3a;
            color: #e0e0e0;
        }

        .feature-list {
            list-style: none;
            padding: 0;
        }

        .feature-list li {
            background: linear-gradient(90deg, #2a2a2a 0%, #1f1f1f 100%);
            padding: 1rem 1.5rem;
            margin-bottom: 0.8rem;
            border-radius: 10px;
            border-left: 4px solid #ff6b35;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(255, 107, 53, 0.15);
            color: #e0e0e0;
        }

        .feature-list li:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
            border-left-width: 6px;
            background: linear-gradient(90deg, #3a3a3a 0%, #2a2a2a 100%);
        }

        .feature-list li::before {
            content: "✓";
            color: #ff6b35;
            font-weight: bold;
            margin-right: 0.8rem;
            font-size: 1.2rem;
        }

        .tech-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }

        .tech-item {
            background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
            padding: 1.2rem;
            border-radius: 12px;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(255, 107, 53, 0.15);
            border: 1px solid #3a3a3a;
        }

        .tech-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
            border-color: #ff6b35;
        }

        .tech-category {
            font-weight: 700;
            color: #ff6b35;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .tech-value {
            color: #e0e0e0;
            font-size: 1rem;
        }

        .badge {
            display: inline-block;
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            color: white;
            padding: 0.4rem 1rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            box-shadow: 0 4px 10px rgba(255, 107, 53, 0.3);
        }

        .footer {
            background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
            padding: 2rem;
            text-align: center;
            color: #ff6b35;
            font-weight: 500;
            border-top: 2px solid #3a3a3a;
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .content {
                padding: 1.5rem;
            }
            
            .tech-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="emoji">📝</div>
            <h1>Tasksplit</h1>
            <p>ระบบจัดการและแบ่งส่วนงานที่ออกแบบมาเพื่อเพิ่มประสิทธิภาพในการทำงานร่วมกัน</p>
        </div>

        <div class="content">
            <!-- Team Members Section -->
            <div class="section">
                <h2 class="section-title">
                    <span>👥</span>
                    <span>สมาชิกผู้พัฒนา</span>
                </h2>
                <table class="team-table">
                    <thead>
                        <tr>
                            <th>รหัสนักศึกษา</th>
                            <th>ชื่อ-นามสกุล</th>
                            <th>บทบาทในทีม</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span class="badge">67021253</span></td>
                            <td>นายวีรกร วงศ์ษารัฐ</td>
                            <td>Developer / Project Lead</td>
                        </tr>
                        <tr>
                            <td><span class="badge">67020847</span></td>
                            <td>นายชิษณุพงศ์ วงค์สูน</td>
                            <td>Developer / UI Design</td>
                        </tr>
                        <tr>
                            <td><span class="badge">67020746</span></td>
                            <td>นายกฤตเมธ ป้องตัน</td>
                            <td>Developer / Quality Assurance</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- About Project Section -->
            <div class="section">
                <h2 class="section-title">
                    <span>🚀</span>
                    <span>เกี่ยวกับโปรเจค</span>
                </h2>
                <ul class="feature-list">
                    <li>ระบบช่วยกระจายงานให้คนในทีมอย่างเท่าเทียม</li>
                    <li>ติดตามสถานะการทำงานแบบ Real-time</li>
                    <li>รองรับการใช้งานผ่าน Web Browser หรือ Mobile</li>
                </ul>
            </div>

            <!-- Tech Stack Section -->
            <div class="section">
                <h2 class="section-title">
                    <span>🛠</span>
                    <span>เทคโนโลยีที่ใช้</span>
                </h2>
                <div class="tech-grid">
                    <div class="tech-item">
                        <div class="tech-category">Frontend</div>
                        <div class="tech-value">HTML, CSS, JavaScript<br>(React / Vue)</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-category">Backend</div>
                        <div class="tech-value">Node.js / Python / PHP</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-category">Database</div>
                        <div class="tech-value">MySQL / MongoDB</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-category">Tools</div>
                        <div class="tech-value">Git, GitHub, VS Code</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>✨ Tasksplit - พัฒนาโดยทีมที่มุ่งมั่นสร้างสรรค์ระบบการทำงานที่ดีขึ้น ✨</p>
        </div>
    </div>
</body>
</html>
