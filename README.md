# 📝 Tasksplit
https://task-split02.vercel.app/

> **ระบบจัดการและแบ่งส่วนงานที่ออกแบบมาเพื่อเพิ่มประสิทธิภาพในการทำงานร่วมกัน**

---

## 👥 สมาชิกผู้พัฒนา (Team Members)

| รหัสนักศึกษา | ชื่อ-นามสกุล | บทบาทในทีม |
|:------------|:------------|:-----------|
| `67021253` | นายวีรกร วงศ์ษารัฐ | 🎯 Developer / Project Lead |
| `67020847` | นายชิษณุพงศ์ วงค์สูน | 🎨 Developer / UI Design |
| `67020746` | นายกฤตเมธ ป้องตัน | ✅ Developer / Quality Assurance |

---

## 🚀 เกี่ยวกับโปรเจค (About Project)

Tasksplit เป็นระบบจัดการงานที่ช่วยให้ทีมทำงานร่วมกันได้อย่างมีประสิทธิภาพ ด้วยฟีเจอร์ที่ครบครันและใช้งานง่าย

## 🛠️ การรันบนเครื่อง (Local Setup)

เหตุผลที่ “clone แล้วเปิด `http://localhost:3000` แต่ไม่ขึ้นงาน” มักเกิดจาก 2 อย่างนี้:

- **`localhost` ใช้ได้แค่เครื่องตัวเอง**: ถ้าเอาลิงก์ `http://localhost:3000` ไปเปิดบนเครื่อง/มือถือคนอื่น มันจะชี้ไปที่เครื่องของเขาเอง (ซึ่งไม่ได้รันโปรเจกต์) ต้องใช้ URL ที่ deploy แล้ว (เช่น Vercel) หรือใช้ IP เครื่องในวง LAN
- **โปรเจกต์ที่ clone ไม่มี `.env.local`**: ไฟล์นี้มักถูก ignore ไม่ถูก push ขึ้น git ทำให้ Supabase ไม่เชื่อมต่อและดึงงานไม่ได้

### 1) สร้างไฟล์ `.env.local`

คัดลอก `.env.example` แล้วสร้างเป็น `.env.local` จากนั้นใส่ค่าจาก Supabase:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2) ติดตั้งและรัน

```bash
npm install
npm run dev
```

แล้วเปิด `http://localhost:3000`

### 3) ถ้ารันได้แต่ “ไม่เห็นงาน”

ให้เปิด DevTools → Console แล้วดู log `[fetchTasks] error:` (มักเป็นเรื่องสิทธิ์ RLS ของ Supabase ที่ไม่อนุญาตให้ดึงข้อมูล)

### ✨ ฟีเจอร์หลัก

- 🔄 **ระบบกระจายงานอัตโนมัติ** - แบ่งงานให้คนในทีมอย่างเท่าเทียมและเหมาะสม
- ⚡ **ติดตามสถานะ Real-time** - เห็นความคืบหน้าของงานทันที
- 📱 **Multi-platform** - รองรับการใช้งานผ่าน Web Browser และ Mobile
- 👨‍💼 **การจัดการทีม** - เพิ่ม-ลดสมาชิก และกำหนดสิทธิ์ได้ง่าย
- 📊 **Dashboard** - สรุปภาพรวมการทำงานของทีม

---



## 🤝 การมีส่วนร่วม (Contributing)

เรายินดีรับ Contribution จากทุกคน! หากต้องการมีส่วนร่วม:

1. Fork โปรเจค
2. สร้าง Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. Push ไปยัง Branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

---

## 📄 License

โปรเจคนี้เป็น Open Source ภายใต้ [MIT License](LICENSE)

---

## 📞 ติดต่อ (Contact)

- 📧 Email: [your-email@example.com](mailto:your-email@example.com)
- 🌐 Website: [https://github.com/wongsarat7006-lang/TaskSplit02](https://github.com/wongsarat7006-lang/TaskSplit02)
- 💬 Issues: [GitHub Issues](https://github.com/wongsarat7006-lang/TaskSplit02/issues)

---

<div align="center">

### ⭐ ถ้าชอบโปรเจคนี้ อย่าลืมกด Star ให้ด้วยนะ!

**Made with 🧡 by Tasksplit Team**

</div>
