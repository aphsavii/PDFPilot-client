import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/shadcn/ui/card';
import { Alert, AlertDescription } from '@/shadcn/ui/alert';

const Loader = () => (
  <div className="flex justify-center items-center">
    <svg className="animate-spin h-4 w-4 lg:h-6 lg:w-6 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>
);

function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.size <= 2 * 1024 * 1024) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a PDF file smaller than 2MB.');
      setFile(null);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('https://api.slietshare.online/pdf-chatbot/embed/pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      navigate(`/chat/${data.fileId}`);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 h-[calc(100vh-150px)] lg:h-[calc(100vh-200px)]">
      <Card>
        <CardHeader>
          <CardTitle>Upload PDF</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="file"
              accept=".pdf"
              name="pdf"
              onChange={handleFileChange}
              className="file:mr-4 file:py-1 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
            />
            {file && <span className="ml-2">{file.name}</span>}

            {file && (
              <Button onClick={uploadFile} disabled={loading} className="ml-3 lg:ml-5">
                {loading ? <Loader /> : <><Upload className="mr-2 h-4 w-4" /> Upload</>}
              </Button>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Home;