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
            setD(m as unknown as MessagesProps);
        };
        fetchDictionary();
    }, [locale]);

    return (
        <div className="w-full h-full p-10 flex-col-center  ">
            <h1 className="text-xl text-slate-200 lg:text-2xl font-semibold capitalize my-10">
                {d?.texts.statistic}
            </h1>
            <div className="h-full p-10 flex-row-center border-2 border-opacity-40 shadow-xl shadow-slate-100/50">
                <Table className="flex flex-col">
                    <TableHeader>
                        <TableRow>
                            {' '}
                            <TableHead className="text-center text-slate-100">
                                {d?.texts.rank}
                            </TableHead>
                            <TableHead className="text-center text-slate-100">
                                {d?.user.username}
                            </TableHead>
                            <TableHead className="text-center text-slate-100">
                                {d?.nav.points}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((u, index) => (
                            <TableRow
                                key={u.id}
                                className="flex flex-row justify-between items-center"
                            >
                                <TableCell className="text-center">
                                    {' '}
                                    {index + 1}
                                </TableCell>
                                <TableCell
                                    className="font-medium "
                                    key={u.username}
                                >
                                    {u.username}
                                </TableCell>
                                <TableCell key={u.score}>{u.score}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
export default Stats;
