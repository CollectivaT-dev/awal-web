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
import Loading from '@/app/loading';
import { Separator } from '@/components/ui/separator';

const LeaderBoardPage = () => {
    const { locale } = useLocaleStore();
    const [d, setDictionary] = useState<MessagesProps>();
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
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
                setLoading(true);
                const res = await axios.get(`/api/stats?page=${currentPage}`);
                if (res.data && res.data.leaderboard) {
                    setUsers(res.data.leaderboard);
                    const totalEntries = res.data.totalLeaderboardEntries;
                    setTotalPages(Math.ceil(totalEntries / 10)); // Assuming 10 is your page size
                } else {
                    console.log('No data received');
                }
                setLoading(false);
            } catch (error) {
                toast.error(`${d?.toasters.alert_general}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentPage]);
    const handlePageChange = (newPage: number) => {
        // Prevent going to a page less than 1 or greater than totalPages
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    const calculateRank = (index: number) => {
        // Calculate the starting index of the current page
        const startIndex = (currentPage - 1) * 10; // Assuming 10 is your page size
        return startIndex + index + 1;
    };
    if (loading) {
        return <Loading />;
    }
    return (
        <div className="flex-col-center min-h-[80vh]">
            <Table className="flex-col-center">
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">
                            {d?.texts.rank}
                        </TableHead>
                        <TableHead className="text-center">
                            {d?.user.username}
                        </TableHead>
                        <TableHead className="text-center font-semibold">
                            {d?.nav.points}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map(({ id, username, score }, index) => (
                        <TableRow
                            key={id}
                            className="flex flex-row justify-between items-center"
                        >
                            <TableCell className="font-medium" key={id}>
                                {calculateRank(index)} {/* Calculate rank */}
                            </TableCell>
                            <TableCell className="font-medium" key={username}>
                                {username}
                            </TableCell>
                            <TableCell key={score}>{score}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
			<Separator className="my-10 w-[20%]" />
            </Table>
            {/* pagination */}
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            className="cursor-pointer"
                            onClick={() => handlePageChange(currentPage - 1)}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink>{currentPage}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            className="cursor-pointer"
                            onClick={() => handlePageChange(currentPage + 1)}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};
export default LeaderBoardPage;
