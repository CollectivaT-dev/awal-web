'use client';
import useLocaleStore from '@/app/hooks/languageStore';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { MessagesProps, getDictionary } from '@/i18n';
import axios from 'axios';
import { useEffect, useState } from 'react';

const LeaderBoardPage = () => {
    const { locale } = useLocaleStore();
    const [d, setDictionary] = useState<MessagesProps>();
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setDictionary(m);
        };

        fetchDictionary();
    }, [locale]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/stats');
                const users = res.data.leaderboard;
                console.log(users);
                console.log(res.data);
                setUsers(users);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);
    console.log(users);
    return (
        <div className="min-h-screen flex-col-center">
            <Table className="flex flex-col">
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center text-slate-100">
                            {d?.user.username}
                        </TableHead>
                        <TableHead className="text-center text-slate-100">
                            {d?.nav.points}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map(({ id, username, score }) => (
                        <TableRow
                            key={id}
                            className="flex flex-row justify-between items-center"
                        >
                            <TableCell className="font-medium" key={username}>
                                {username}
                            </TableCell>
                            <TableCell key={score}>{score}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
export default LeaderBoardPage;
