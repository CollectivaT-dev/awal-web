'use client';

import useLocaleStore from '@/app/hooks/languageStore';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { MessagesProps, getDictionary } from '@/i18n';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface StatsProps {
    users: {
        id: string;
        username: string | null;
        score: number | null | 0;
    }[];
}

const Stats: React.FC<StatsProps> = ({ users }) => {
    const { data: session } = useSession();
    const { locale } = useLocaleStore();
    const [d, setD] = useState<MessagesProps>();
    console.log(users);

    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m);
        };
        fetchDictionary();
    }, [locale]);

    return (
        <div className="w-full h-full p-10 flex-col-center  my-10">
            <h1 className="text-sm mobile:text-2xl mobile:font-semibold capitalize ">
                stats
            </h1>
            <div className="h-full p-10 flex-row-center border-2 border-opacity-40 shadow-xl shadow-slate-100/50">
                {/* <div className='w-1/2'>

</div> */}
                <Table className="flex flex-col border-solid  ">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">
                                {d?.user.username}
                            </TableHead>
                            <TableHead className="text-center">
                                {d?.nav.points}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u.id } className='flex flex-row justify-between items-center'>
                                <TableCell
                                    className="font-medium "
                                    key={u.username}
                                >
                                    {u.username}
                                </TableCell>
                                <TableCell
                                    className=""
                                    key={u.score}
                                >
                                    {u.score}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
					
        </div>
    );
};
export default Stats;
