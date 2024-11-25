import { JobPrediction } from "@/components/jobs/job-prediction";
import { useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
export async function generateStaticParams() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getjobitems`);
        const data = await res.json();
        
        return data.joblist.map((id: string) => ({
            id: id.toString(),
        }));
    } catch (error) {
        console.error('Error fetching job list:', error);
        return [];
    }
}

export default async function PredictPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    if (id) {
        return <JobPrediction id={id} />;
    }
}