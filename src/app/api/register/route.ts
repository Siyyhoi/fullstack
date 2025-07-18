import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

interface RegisterBody {
    email: string;
    password: string;
    username: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as RegisterBody;

        if (!body) return NextResponse.json({
            massage: 'Body Invalid',
        })

        if (!body.email || !body.password || !body.username) return NextResponse.json({
            massage: 'Please provide email and password',
        })
        

        const hashPassword = createHash('sha256').update(body.password).digest('hex');
        console.log('Hashed Password:', hashPassword);

        const user = await prisma.user.findFirst({
            where: {
                email: body.email
            },
        })

        if (user) {
            return NextResponse.json({
                message: 'user is already'
            });
        }

        await prisma.user.create ({
            data: {
                email: body.email,
                password: hashPassword,
                username: body.username
            },
        })

        return NextResponse.json({
            status: 'success',
        })

    } catch (error) {
        return NextResponse.json({ 
            message: 'Error :' + error,
        });
    }

}