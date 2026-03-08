import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '../../../../lib/supabaseAdmin'

export async function POST(request: NextRequest) {
  try {
    const { userId, email, newPassword, accessToken } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: 'ต้องระบุ userId' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(url, anonKey, {
      global: { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} },
    })
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
      return NextResponse.json({ error: 'ไม่มีสิทธิ์แก้ไขสมาชิก' }, { status: 403 })
    }

    const updates: { email?: string; password?: string } = {}
    if (typeof email === 'string' && email.trim()) updates.email = email.trim()
    if (typeof newPassword === 'string' && newPassword.length >= 6) updates.password = newPassword

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'ไม่มีข้อมูลที่ต้องอัปเดต' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, updates)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}
