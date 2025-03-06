
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckSquare, List, Clock } from 'lucide-react';

const Home = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/planner');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Minimalist Planner</h1>
        {user ? (
          <Button onClick={() => navigate('/planner')}>Go to Planner</Button>
        ) : (
          <Button onClick={() => navigate('/login')}>Login</Button>
        )}
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Organize your life with simplicity</h2>
            <p className="text-xl text-muted-foreground mb-8">
              A minimalist weekly planner to help you focus on what matters most
            </p>
            <Button size="lg" onClick={handleGetStarted}>
              {user ? 'Go to Planner' : 'Get Started'}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="border rounded-lg p-6 shadow-sm">
              <div className="mb-4 flex justify-center">
                <Calendar className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Weekly Planning</h3>
              <p className="text-muted-foreground text-center">
                Plan your week with an elegant, drag-and-drop interface that helps you visualize your time.
              </p>
            </div>

            <div className="border rounded-lg p-6 shadow-sm">
              <div className="mb-4 flex justify-center">
                <CheckSquare className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Task Management</h3>
              <p className="text-muted-foreground text-center">
                Create, edit, and complete tasks with ease. Add subtasks to break down complex work.
              </p>
            </div>

            <div className="border rounded-lg p-6 shadow-sm">
              <div className="mb-4 flex justify-center">
                <List className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Custom Lists</h3>
              <p className="text-muted-foreground text-center">
                Organize tasks into custom lists with color coding for better visual organization.
              </p>
            </div>

            <div className="border rounded-lg p-6 shadow-sm">
              <div className="mb-4 flex justify-center">
                <Clock className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Recurring Tasks</h3>
              <p className="text-muted-foreground text-center">
                Set up recurring tasks for habits and regular commitments that repeat automatically.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} Minimalist Planner. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
