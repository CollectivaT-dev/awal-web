import getCurrentUser from '@/app/actions/get/getCurrentUser';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    //console.log(req);
    try {
        const body = await req.json();
        //console.log(body.userId);
        console.log(body);
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        username: body.username
                            .toLowerCase()
                            .replace(/\s/g, ''),
                    },
                    { email: body.email.toLowerCase() },
                ],
                NOT: { id: body.userId },
            },
        });
        //console.log(existingUser);
        //console.log(existingUser);
        if (existingUser) {
            return new NextResponse(
                JSON.stringify({ error: 'username and email error' }),
                {
                    status: 406,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
        }

        //Validation checks for central, tachelhit, and tarifit
        if (
            (body.central?.isChecked &&
                (body.central.oral === 0 ||
                    body.central.written_lat === 0 ||
                    body.central.tarifit === 0)) ||
            (body.tachelhit?.isChecked &&
                (body.tachelhit.oral === 0 ||
                    body.tachelhit.written_lat === 0 ||
                    body.tachelhit.tarifit === 0)) ||
            (body.tarifit?.isChecked &&
                (body.tarifit.oral === 0 ||
                    body.tarifit.written_lat === 0 ||
                    body.tarifit.written_tif === 0))
        ) {
            return new NextResponse(
                JSON.stringify({ error: 'variation selection error' }),
                {
                    status: 406,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
        }
        //console.log(body.other.body.length);
        if (body.other?.isChecked && body.other.body.length === 0) {
            return new NextResponse(
                JSON.stringify({ error: 'Non Empty String' }),
                {
                    status: 406,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
        }

        const user = await prisma.user.updateMany({
            where: {
                id: body.userId,
            },
            data: {
                username: body.username,
                email: body.email,
                name: body.name ? body.name : '',
                surname: body.surname ? body.surname : '',
                central: body.central?.isChecked
                    ? body.central
                    : {
                          isChecked: false,
                          oral: 0,
                          written_lat: 0,
                          written_tif: 0,
                      },
                tachelhit: body.tachelhit?.isChecked
                    ? body.tachelhit
                    : {
                          isChecked: false,
                          oral: 0,
                          written_lat: 0,
                          written_tif: 0,
                      },
                tarifit: body.tarifit?.isChecked
                    ? body.tarifit
                    : {
                          isChecked: false,
                          oral: 0,
                          written_lat: 0,
                          written_tif: 0,
                      },
                other: body.other?.isChecked
                    ? body.other
                    : {
                          isChecked: false,
                          body: '',
                      },
                languages: {
                    english: body.languages.english
                        ? body.languages.english
                        : false,
                    arabic: body.languages.arabic
                        ? body.languages.arabic
                        : false,
                    french: body.languages.french
                        ? body.languages.french
                        : false,
                    catalan: body.languages.catalan
                        ? body.languages.catalan
                        : false,
                    spanish: body.languages.spanish
                        ? body.languages.spanish
                        : false,
                },
                updatedAt: new Date(),
                isSubscribed: body.isSubscribed ? body.isSubscribed : false,
                age: body.age ? body.age : null,
                gender: body.gender ? body.gender : 'other',
                isPrivacy: body.isPrivacy ? body.isPrivacy : true,
                origin: body.origin ? body.origin : '',
            },
        });
        //console.log({ ...user });

        return NextResponse.json({
            user,
        });
    } catch (error) {
        console.error(error);
        return new NextResponse(
            JSON.stringify({ message: 'Internal Server Error' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    }
}

export async function GET(req: Request) {
    const currentUser = await getCurrentUser();

    //console.log(currentUser);
    if (!currentUser) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    const user = await prisma.user.findUnique({
        where: {
            id: currentUser.id,
        },
    });
    //console.log(user);

    return new NextResponse(JSON.stringify(user), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
