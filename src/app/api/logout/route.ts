import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // ล้าง session หรือ token ตามที่ใช้
    // ตัวอย่าง: ล้าง cookie session
    const response = NextResponse.json(
      { message: 'ออกจากระบบเรียบร้อยแล้ว' },
      { status: 200 }
    );

    // ล้าง cookie session (ถ้าใช้)
    response.cookies.delete('session');
    response.cookies.delete('token');

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการออกจากระบบ' },
      { status: 500 }
    );
  }
}
