'use client';

import { useState } from 'react';
import { FileUp, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [jobStatus, setJobStatus] = useState<any>(null);

    const importMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            const res = await api.post('/imports/inventory', formData);
            return res.data;
        },
        onSuccess: (data) => {
            setJobStatus(data);
            checkStatus(data.id);
        },
    });

    const checkStatus = async (jobId: string) => {
        const timer = setInterval(async () => {
            const res = await api.get(`/imports/status/${jobId}`);
            setJobStatus(res.data);
            if (res.data.status === 'COMPLETED' || res.data.status === 'FAILED') {
                clearInterval(timer);
            }
        }, 2000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (file) {
            importMutation.mutate(file);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <FileUp className="w-6 h-6" />
                    Bulk Data Import
                </h1>
                <p className="text-muted-foreground">Upload the "Inventory Template.xlsx" file to seed or update the master list.</p>
            </div>

            <div className="border-2 border-dashed rounded-xl p-12 text-center space-y-4 hover:border-primary transition-colors cursor-pointer"
                onClick={() => document.getElementById('fileInput')?.click()}>
                <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".xlsx"
                />
                <div className="bg-muted p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <FileUp className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                    <p className="font-medium">{file ? file.name : 'Click to select Excel file'}</p>
                    <p className="text-xs text-muted-foreground mt-1">Accepts .xlsx files up to 10MB</p>
                </div>
            </div>

            {file && !importMutation.isPending && !jobStatus && (
                <button
                    onClick={handleUpload}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90"
                >
                    Start Import Process
                </button>
            )}

            {importMutation.isPending && (
                <div className="flex items-center justify-center gap-2 p-4 bg-muted rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading file...
                </div>
            )}

            {jobStatus && (
                <div className={cn(
                    "p-6 border rounded-xl space-y-4",
                    jobStatus.status === 'COMPLETED' ? "bg-green-50 border-green-200" :
                        jobStatus.status === 'FAILED' ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"
                )}>
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Import Job Status: {jobStatus.status}</h3>
                        {jobStatus.status === 'COMPLETED' ? <CheckCircle className="text-green-600" /> :
                            jobStatus.status === 'FAILED' ? <AlertCircle className="text-red-600" /> :
                                <Loader2 className="animate-spin text-blue-600" />}
                    </div>

                    <div className="text-sm space-y-1">
                        <p>Filename: {jobStatus.filename}</p>
                        <p>Job ID: {jobStatus.id}</p>
                        {jobStatus.errorLog && (
                            <div className="mt-4 p-4 bg-white border border-red-100 rounded text-red-600 font-mono text-xs whitespace-pre-wrap">
                                {JSON.stringify(jobStatus.errorLog, null, 2)}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
