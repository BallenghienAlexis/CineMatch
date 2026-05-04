import React, { createContext, useState, useMemo } from 'react';

type GenreContextType = {
  selectedGenreId: number | null;
  setSelectedGenreId: (id: number | null) => void;
};

const GenreContext = createContext<GenreContextType>({
  selectedGenreId: null,
  setSelectedGenreId: () => {},
});

export function GenreProvider(props: any) {
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);

  const value = useMemo(
    () => ({
      selectedGenreId,
      setSelectedGenreId,
    }),
    [selectedGenreId]
  );

  return (
    <GenreContext.Provider value={value}>
      {props.children}
    </GenreContext.Provider>
  );
}

export function useGenreSelection() {
  const context = React.useContext(GenreContext);
  if (!context) {
    throw new Error('useGenreSelection must be used within GenreProvider');
  }
  return context;
}


