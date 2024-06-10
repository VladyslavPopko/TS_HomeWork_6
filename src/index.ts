type MatchFilter = {
  filter: string;
};

type RangeFilter = {
  filter: number;
  filterTo: number;
};

type ValueSearchFilter<T> = {
  values: T[];
};

interface Movie {
  title: string;
  year: number;
  rating: number;
  awards: string[];
}

interface Category {
  name: string;
  movies: Movie[];
}

interface Filterable<T> {
  applySearchValue(filter: MatchFilter): void;
  applyFiltersValue(filters: Partial<T>): void;
}

interface MovieFilters {
  title?: MatchFilter;
  year?: RangeFilter;
  rating?: RangeFilter;
  awards?: ValueSearchFilter<string>;
}

interface CategoryFilters {
  name?: MatchFilter;
  movies?: ValueSearchFilter<Movie>;
}

class MovieList implements Filterable<MovieFilters> {
  private movies: Movie[];
  private filters: Partial<MovieFilters>;

  constructor(movies: Movie[]) {
    this.movies = movies;
    this.filters = {};
  }

  applySearchValue(filter: MatchFilter): void {
    this.filters.title = filter;
  }

  applyFiltersValue(filters: Partial<MovieFilters>): void {
    this.filters = { ...this.filters, ...filters };
  }

  getFilteredMovies(): Movie[] {
    return this.movies.filter(movie => {
      let matches = true;
      if (this.filters.title) {
        matches = matches && movie.title.includes(this.filters.title.filter);
      }
      if (this.filters.year) {
        matches = matches && movie.year >= this.filters.year.filter && movie.year <= this.filters.year.filterTo;
      }
      if (this.filters.rating) {
        matches = matches && movie.rating >= this.filters.rating.filter && movie.rating <= this.filters.rating.filterTo;
      }
      if (this.filters.awards) {
        matches = matches && this.filters.awards.values.every(award => movie.awards.includes(award));
      }
      return matches;
    });
  }
}

class CategoryList implements Filterable<CategoryFilters> {
  private categories: Category[];
  private filters: Partial<CategoryFilters>;

  constructor(categories: Category[]) {
    this.categories = categories;
    this.filters = {};
  }

  applySearchValue(filter: MatchFilter): void {
    this.filters.name = filter;
  }

  applyFiltersValue(filters: Partial<CategoryFilters>): void {
    this.filters = { ...this.filters, ...filters };
  }

  getFilteredCategories(): Category[] {
    return this.categories.filter(category => {
      let matches = true;
      if (this.filters.name) {
        matches = category.name.includes(this.filters.name.filter);
      }
      if (this.filters.movies) {
        matches = this.filters.movies.values.every(movie =>
          category.movies.some(catMovie => catMovie.title === movie.title)
        );
      }
      return matches;
    });
  }
}
