import { NavLink } from "react-router-dom";

type HeaderProps = {
  watchlistCount: number;
};

const navClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-link nav-link--active" : "nav-link";

export function Header({ watchlistCount }: HeaderProps) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Moviedux home">
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="Moviedux"
          className="brand-logo"
        />
      </a>

      <nav className="primary-nav" aria-label="Primary navigation">
        <NavLink to="/" end className={navClassName}>
          Discover
        </NavLink>
        <NavLink to="/watchlist" className={navClassName}>
          Watchlist
          <span className="nav-count" aria-label={`${watchlistCount} saved movies`}>
            {watchlistCount}
          </span>
        </NavLink>
      </nav>
    </header>
  );
}
