const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import crypto from 'crypto';
async function updateNullTokens() {
    const users = await prisma.user.findMany({
        where: {
            OR: [
                { resetPasswordToken: null },
                { emailVerificationToken: null },
            ],
        },
    });

    for (const user of users) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken:
                    user.resetPasswordToken ??
                    crypto.randomBytes(32).toString('utf8'), // Replace "someUniqueValue" with a strategy to generate unique values
                emailVerificationToken:
                    user.emailVerificationToken ??
                    crypto.randomBytes(32).toString('utf8'), // Same as above
            },
        });
    }
}

updateNullTokens()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
