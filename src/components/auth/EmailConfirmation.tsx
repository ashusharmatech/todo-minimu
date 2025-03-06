
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const EmailConfirmation = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Extract the access token from the URL hash
        const hash = location.hash;
        
        if (!hash) {
          setStatus('error');
          setMessage('Invalid confirmation link. No authentication data found.');
          return;
        }

        // Call Supabase to process the token and complete the sign up
        const { error } = await supabase.auth.refreshSession();

        if (error) {
          console.error('Error confirming email:', error);
          setStatus('error');
          setMessage(`Error confirming your email: ${error.message}`);
          return;
        }

        setStatus('success');
        setMessage('Your email has been successfully verified!');
        toast({
          title: "Email verified",
          description: "Your email has been successfully verified. You can now use all features of the application.",
        });

        // Redirect to planner after a short delay
        setTimeout(() => {
          navigate('/planner');
        }, 2000);
      } catch (error: any) {
        console.error('Email confirmation error:', error);
        setStatus('error');
        setMessage(`An unexpected error occurred: ${error.message}`);
      }
    };

    handleEmailConfirmation();
  }, [location, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {status === 'loading' ? 'Verifying Email' : 
             status === 'success' ? 'Email Verified' : 'Verification Failed'}
          </CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {status === 'loading' && (
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="mt-2">Redirecting you to the application...</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          {status === 'error' && (
            <Button onClick={() => navigate('/login')}>
              Return to Login
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailConfirmation;
