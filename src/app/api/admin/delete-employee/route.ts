import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: NextRequest) {
  try {
    const { userId, accessToken } = await request.json()
    if (!userId) {
      return NextResponse.json(
        { error: 'ต้องระบุ userId' },
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
      return NextResponse.json({ error: 'ไม่มีสิทธิ์ลบบัญชีพนักงาน' }, { status: 403 })
    }

    // ลบจาก auth.users
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // ลบ row profiles ด้วย (เผื่อ trigger ไม่ทำงาน)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[delete-employee] ERROR', e)
    return NextResponse.json(
      { error: e?.message || 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

