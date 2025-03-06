
import React, { useState } from 'react';
import WeekView from '@/components/WeekView';
import Header from '@/components/Header';
import LoginModal from '@/components/modals/LoginModal';
import ListsModal from '@/components/modals/ListsModal';
import { addDays } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showListsModal, setShowListsModal] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        onShowLoginModal={() => setShowLoginModal(true)} 
        onShowListsModal={() => setShowListsModal(true)} 
      />
      
      <main className="flex-1 overflow-hidden">
        <WeekView 
          currentDate={currentDate} 
          onDateChange={setCurrentDate} 
        />
      </main>

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      
      <ListsModal
        isOpen={showListsModal}
        onClose={() => setShowListsModal(false)}
      />
    </div>
  );
};

export default Index;
