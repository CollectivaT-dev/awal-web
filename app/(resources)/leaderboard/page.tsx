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
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import toast from 'react-hot-toast';

const LeaderBoardPage = () => {
    const { locale } = useLocaleStore();
    const [d, setDictionary] = useState<MessagesProps>();
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setDictionary(m as unknown as MessagesProps);
        };
        fetchDictionary();
    }, [locale]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/stats?page=${currentPage}`);
                const users = res.data.leaderboard;
                console.log(users);
                console.log(res.data);
                setUsers(users);
            } catch (error) {
                toast.error(`${d?.toasters.alert_general}`);
            }
        };
        fetchData();
    }, [currentPage]);
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };
    console.log(users);
    return (
        <div className="min-h-[80vh] flex-col flex justify-between items-center">
            <Table className="flex-col flex items-stretch justify-center max-w-[50vh]">
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
                <TableBody >
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
            {/* pagination */}
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink>{currentPage}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};
export default LeaderBoardPage;
