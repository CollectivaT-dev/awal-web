import { OtherLanguagesConfig } from '@/app/(settings)/SettingsConfig';
import prisma from '@/lib/prisma';

async function PostOtherLanguages(
    userId: string,
    data: OtherLanguagesConfig.OtherLanguagesProps,
) {
    let existingData;
    let result;

    existingData = await prisma.otherLanguages.findMany({
        where: { userId: userId },
    });
    result =
        existingData.length > 0
            ? await prisma.otherLanguages.updateMany({
                  where: { userId: userId },
                  data: {
                      english: data.english ? data.english : false,
                      spanish: data.spanish ? data.spanish : false,
                      catala: data.catala ? data.catala : false,
                      french: data.french ? data.french : false,
                      arabic: data.arabic ? data.arabic : false,
                  },
              })
            : await prisma.otherLanguages.create({
                  data: {
                      userId: userId,
                      english: data.english ? data.english : false,
                      spanish: data.spanish ? data.spanish : false,
                      catala: data.catala ? data.catala : false,
                      french: data.french ? data.french : false,
                      arabic: data.arabic ? data.arabic : false,
                  },
              });

    return result;
}

export default PostOtherLanguages;
