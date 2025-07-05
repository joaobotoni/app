    import { ThemeProvider } from '@/app/contexts/ThemeContext';
    import { RegistrationForm } from '@/app/components/organisms/RegistrationForm';
    import React from 'react';

    export default function HomeScreen() {
      return (
        <ThemeProvider>
          <RegistrationForm />
        </ThemeProvider>
      );
    }