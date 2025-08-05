import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import Swal from 'sweetalert2';


interface RegisterBody {
    username: string;
    password: string;
    email: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as RegisterBody;

        if (!body) return NextResponse.json({
            message: 'Body Invalid',
        }, { status: 400 })

        if (!body.username || !body.password || !body.email) {
            return NextResponse.json({
                message: 'Please provide all required fields',
            }, { status: 400 })
        }
        
        const hashPassword = createHash('sha256').update(body.password).digest('hex');
        console.log('Hashed Password:', hashPassword);

        const user = await prisma.user.findFirst({
            where: {
                username: body.username
            },
        })

        if (user) {
            return NextResponse.json({
                message: 'Username already exists'
            }, { status: 409 });
        }

        await prisma.user.create({
            data: {
                username: body.username,
                password: hashPassword,
                email: body.email
            },
        })

        return NextResponse.json({
            status: 'success',
            message: 'User registered successfully'
        }, { status: 201 })

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ 
            message: 'Internal server error',
        }, { status: 500 });
    }
}