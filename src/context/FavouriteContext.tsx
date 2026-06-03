import React, {
  createContext,
  useContext,
  useState,
} from 'react'

type FavouriteContextType = {
  favourites: string[]
  toggleFavourite: (id: string) => void
  isFavourite: (id: string) => boolean
}

const FavouriteContext = createContext<FavouriteContextType | null>(null)

export function FavouriteProvider({ children }: any) {
  const [favourites, setFavourites] = useState<string[]>([])

  const toggleFavourite = (id: string) => {
    setFavourites(prev =>
      prev.includes(id)
        ? prev.filter(fid => fid !== id)
        : [...prev, id]
    )
  }

  const isFavourite = (id: string) => favourites.includes(id)
  console.log('GLOBAL FAVOURITES =>', favourites)

  return (
    <FavouriteContext.Provider
      value={{ favourites, toggleFavourite, isFavourite }}
    >
      {children}
    </FavouriteContext.Provider>
  )
}

export function useFavourite() {
  const context = useContext(FavouriteContext)
  if (!context) {
    throw new Error('useFavourite must be used inside FavouriteProvider')
  }
  return context
}
