const constructLanguageData = (languages: any) => ({
    english: languages.english || false,
    arabic: languages.arabic || false,
    french: languages.french || false,
    catalan: languages.catalan || false,
    spanish: languages.spanish || false,
});

const constructCheckedData = (data: any) => ({
    isChecked: data?.isChecked || false,
    oral: data?.oral || 0,
    written_lat: data?.written_lat || 0,
    written_tif: data?.written_tif || 0,
});

const constructOtherData = (other: any) => ({
    isChecked: other?.isChecked || false,
    body: other?.body || '',
});

const constructResidenceData = (residence: any) => ({
    country: residence.country || '',
    province: residence.province || '',
    city: residence.city || '',
});

export const patchQuery = (body: any) => ({
    where: {
        id: body.userId,
    },
    data: {
        username: body.username,
        email: body.email,
        name: body.name || '',
        surname: body.surname || '',
        central: body.central?.isChecked ? body.central : constructCheckedData(body.central),
        tachelhit: body.tachelhit?.isChecked ? body.tachelhit : constructCheckedData(body.tachelhit),
        tarifit: body.tarifit?.isChecked ? body.tarifit : constructCheckedData(body.tarifit),
        other: constructOtherData(body.other),
        languages: constructLanguageData(body.languages),
        updatedAt: new Date(),
        isSubscribed: body.isSubscribed || false,
        age: body.age || null,
        gender: body.gender || 'other',
        isPrivacy: body.isPrivacy || true,
        residence: constructResidenceData(body.residence),
    },
});
