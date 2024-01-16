import { AmazicConfig } from '@/app/(settings)/SettingsConfig';
import prisma from '@/lib/prisma';

type ModelName = 'central' | 'tachelhit' | 'tarifit';

async function PostAmazicLanguage(
    userId: string,
    data: AmazicConfig.AmazicProps,
    modelName: ModelName,
) {
    let existingData;
    let result;

    switch (modelName) {
        case 'central':
            existingData = await prisma.central.findMany({
                where: { userId: userId },
            });
            result =
                existingData.length > 0
                    ? await prisma.central.updateMany({
                          where: { userId: userId },
                          data: {
                              isChecked: data?.isChecked || false,
                              oral: data?.oral || 0,
                              written_tif: data?.written_tif || 0,
                              written_lat: data?.written_lat || 0,
                          },
                      })
                    : await prisma.central.create({
                          data: {
                              userId: userId,
                              isChecked: data?.isChecked || false,
                              oral: data?.oral || 0,
                              written_tif: data?.written_tif || 0,
                              written_lat: data?.written_lat || 0,
                          },
                      });
            break;
        case 'tachelhit':
            existingData = await prisma.tachelhit.findMany({
                where: { userId: userId },
            });
            result =
                existingData.length > 0
                    ? await prisma.tachelhit.updateMany({
                          where: { userId: userId },
                          data: {
                              isChecked: data?.isChecked || false,
                              oral: data?.oral || 0,
                              written_tif: data?.written_tif || 0,
                              written_lat: data?.written_lat || 0,
                          },
                      })
                    : await prisma.tachelhit.create({
                          data: {
                              userId: userId,
                              isChecked: data?.isChecked || false,
                              oral: data?.oral || 0,
                              written_tif: data?.written_tif || 0,
                              written_lat: data?.written_lat || 0,
                          },
                      });
            break;

        case 'tarifit':
            existingData = await prisma.tarifit.findMany({
                where: { userId: userId },
            });
            result =
                existingData.length > 0
                    ? await prisma.tarifit.updateMany({
                          where: { userId: userId },
                          data: {
                              isChecked: data?.isChecked || false,
                              oral: data?.oral || 0,
                              written_tif: data?.written_tif || 0,
                              written_lat: data?.written_lat || 0,
                          },
                      })
                    : await prisma.tarifit.create({
                          data: {
                              userId: userId,
                              isChecked: data?.isChecked || false,
                              oral: data?.oral || 0,
                              written_tif: data?.written_tif || 0,
                              written_lat: data?.written_lat || 0,
                          },
                      });
            break;
        default:
            throw new Error(`Model ${modelName} not found`);
    }

    return result;
}

export default PostAmazicLanguage;
