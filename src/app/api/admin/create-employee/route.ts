import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: NextRequest) {
  try {
    const { full_name, email, password, accessToken } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'ต้องระบุอีเมลและรหัสผ่าน' },
        { status: 400 }
      )
    }

    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' },
        { status: 400 }
      )
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(url, anonKey, {
      global: { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} },
    })

    // ตรวจสอบว่า caller เป็น admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์สร้างบัญชีพนักงาน' }, { status: 403 })
    }

    // สร้าง user ใน Supabase Auth
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: full_name || null,
      },
    })

    if (createError || !created?.user) {
      return NextResponse.json(
        { error: createError?.message || 'ไม่สามารถสร้างผู้ใช้ใหม่ได้' },
        { status: 400 }
      )
    }

    const userId = created.user.id

    // อัปเดต/สร้างแถวใน profiles ให้ตรงกับ user ใหม่
    const { data: profileRow, error: upsertError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          full_name: full_name || null,
          email,
          role: 'employee',
        },
        { onConflict: 'id' }
      )
      .select('id, full_name, email, avatar_url, role')
      .single()

    if (upsertError) {
      return NextResponse.json(
        { error: upsertError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ profile: profileRow })
  } catch (e: any) {
    console.error('[create-employee] ERROR', e)
    return NextResponse.json(
      { error: e?.message || 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

